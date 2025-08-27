# Technical Specification
## List Randomizer App (v2.0)

### Architecture Overview

#### Tech Stack
**Frontend** ✅ PRODUCTION DEPLOYED
- Framework: React 18+ with TypeScript
- State Management: Context API (AuthContext, ListsContext, ThemeContext)
- Styling: Tailwind CSS + Framer Motion for animations
- Build Tool: Vite
- Additional: @dnd-kit for drag-and-drop, canvas-confetti for celebrations

**Backend** ✅ PRODUCTION DEPLOYED
- Runtime: Supabase (PostgreSQL + Authentication + Real-time)
- Database: Supabase PostgreSQL with Row Level Security
- Authentication: Real Google OAuth via Supabase
- Hosting: Vercel (frontend) + Supabase (backend)
- Live URL: https://listlotto.com

**Development Tools** ✅ CONFIGURED
- Version Control: Git/GitHub
- CI/CD: GitHub Actions (type checking, linting, build verification)
- Testing: Not yet implemented (see docs/TODO.md)
- Linting: ESLint (active, 2 minor warnings to fix)
- Monitoring: Available for future setup (see docs/TODO.md)

### Database Schema

```sql
-- Users table ✅ DEPLOYED
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image_url TEXT,
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Lists table ✅ DEPLOYED  
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Note: Items are stored as JSONB array in the lists.metadata field
-- This simplified approach works well for the current use case and 
-- provides better performance for reordering operations.

-- Row Level Security Policies ✅ ACTIVE
-- Users can only access their own data
-- Anonymous users use localStorage for guest mode
```

### API Implementation ✅ COMPLETE

The application uses **Supabase client-side SDK** instead of traditional REST API endpoints. All database operations go through:

#### Supabase Operations
```javascript
// Authentication (via Supabase Auth)
supabase.auth.signInWithOAuth({ provider: 'google' })
supabase.auth.signOut()
supabase.auth.getSession()

// Lists Operations (via Supabase Database)
supabase.from('lists').select('*')
supabase.from('lists').insert(data)
supabase.from('lists').update(data).eq('id', id)
supabase.from('lists').delete().eq('id', id)

// Real-time subscriptions
supabase.from('lists').on('*', callback).subscribe()
```

#### Row Level Security Policies ✅ ACTIVE
- Users can only access their own lists and items
- Guest users' data stays in localStorage
- Authenticated users' data syncs across devices

#### List Items
```
GET    /api/lists/:listId/items     - Get all items in list
POST   /api/lists/:listId/items     - Add item to list
PUT    /api/lists/:listId/items/:id - Update item
DELETE /api/lists/:listId/items/:id - Delete item
PUT    /api/lists/:listId/items/reorder - Reorder items
```

#### Randomization
```
POST   /api/lists/:listId/randomize - Get random item(s)
GET    /api/lists/:listId/history   - Get selection history
```

#### User
```
GET    /api/user/profile    - Get user profile
PUT    /api/user/profile    - Update profile
PUT    /api/user/preferences - Update preferences
DELETE /api/user            - Delete account
```

### Component Architecture

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginButton.tsx
│   │   ├── AuthProvider.tsx
│   │   └── ProtectedRoute.tsx
│   ├── lists/
│   │   ├── ListCard.tsx
│   │   ├── ListGrid.tsx
│   │   ├── ListEditor.tsx
│   │   └── ListItem.tsx
│   ├── randomizer/
│   │   ├── RandomizerModal.tsx
│   │   ├── AnimationEngine.tsx
│   │   ├── SpinnerAnimation.tsx
│   │   └── ResultDisplay.tsx
│   ├── common/
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── LoadingSpinner.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Card.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useLists.ts
│   ├── useRandomizer.ts
│   └── useTheme.ts
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── constants.ts
├── pages/
│   ├── index.tsx
│   ├── dashboard.tsx
│   ├── list/[id].tsx
│   └── settings.tsx
├── styles/
│   └── globals.css
└── types/
    └── index.ts
```

### State Management

```typescript
// Store structure
interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Lists
  lists: List[];
  currentList: List | null;
  isLoading: boolean;
  
  // UI
  theme: 'light' | 'dark';
  isRandomizing: boolean;
  
  // Actions
  fetchLists: () => Promise<void>;
  createList: (list: CreateListDto) => Promise<void>;
  updateList: (id: string, updates: UpdateListDto) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  randomizeSelection: (listId: string) => Promise<ListItem>;
}
```

### Animation System

```typescript
// Animation configuration
interface AnimationConfig {
  duration: number;
  easing: string;
  stages: AnimationStage[];
}

interface AnimationStage {
  name: string;
  duration: number;
  animation: FramerMotionAnimation;
}

// Example spinner animation
const spinnerAnimation: AnimationConfig = {
  duration: 3000,
  easing: "easeInOut",
  stages: [
    {
      name: "spin-up",
      duration: 1000,
      animation: {
        rotate: [0, 720],
        scale: [1, 1.2, 1]
      }
    },
    {
      name: "spin-fast",
      duration: 1500,
      animation: {
        rotate: [720, 1800]
      }
    },
    {
      name: "slow-down",
      duration: 500,
      animation: {
        rotate: [1800, 1980],
        scale: [1, 1.5]
      }
    }
  ]
};
```

### Security Considerations

#### Authentication
- Implement JWT refresh tokens
- Session timeout after 7 days
- Rate limiting on auth endpoints
- CSRF protection

#### Data Protection
- Input sanitization for all user inputs
- SQL injection prevention via parameterized queries
- XSS protection headers
- HTTPS only

#### API Security
- API rate limiting (100 requests/minute)
- Request validation with Zod
- CORS configuration
- API versioning

### Performance Optimizations

#### Frontend
- Code splitting with dynamic imports
- Image lazy loading
- Virtual scrolling for long lists
- Debounced search inputs
- Optimistic UI updates
- Service worker caching

#### Backend
- Database query optimization
- Redis caching for frequently accessed data
- Connection pooling
- Pagination for list endpoints
- Batch operations where possible

### Testing Strategy

#### Unit Tests
- Component testing with React Testing Library
- API endpoint testing
- Utility function testing
- Animation logic testing

#### Integration Tests
- Auth flow testing
- CRUD operations
- Randomization feature

#### E2E Tests
- Critical user journeys
- Cross-browser testing
- Mobile responsiveness

### Deployment Pipeline

```yaml
# GitHub Actions workflow
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: vercel/action@v20
```

### Monitoring & Analytics

#### Application Monitoring
- Sentry for error tracking
- Performance monitoring with Web Vitals
- Custom event tracking
- User session recording (with consent)

#### Analytics
- Google Analytics 4
- Custom events for:
  - List creation
  - Randomization usage
  - Feature adoption
  - User retention

### Development Timeline

#### Phase 1: Foundation (2 weeks)
- Project setup
- Authentication implementation
- Basic database schema
- Core API endpoints

#### Phase 2: Core Features (3 weeks)
- List CRUD operations
- Basic randomization
- Responsive UI
- Theme switching

#### Phase 3: Polish (2 weeks)
- Animation system
- PWA features
- Performance optimization
- Testing

#### Phase 4: Launch Prep (1 week)
- Deployment setup
- Monitoring integration
- Documentation
- Beta testing