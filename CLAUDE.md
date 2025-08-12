# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ListLotto is a React-based list randomizer web application that allows users to create, manage, and randomly select items from lists with engaging animations. The project is currently in documentation/planning phase with comprehensive specs but no actual implementation yet.

## Architecture

### Tech Stack (Planned)
- **Frontend**: React 18+ with TypeScript, Tailwind CSS, Framer Motion
- **State Management**: Context API (AuthContext, ListsContext, ThemeContext)  
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with dark/light theme support
- **Authentication**: Mock Google OAuth (in design files)
- **Database**: Local storage (MVP), PostgreSQL with Prisma (future)

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── lists/          # List management components  
│   ├── randomizer/     # Animation and selection components
│   ├── common/         # Layout and shared components
│   └── ui/             # Basic UI primitives
├── context/            # React context providers
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API clients
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

### Key Components
- **ListCard**: Display list preview with actions
- **RandomizerView**: Animated item selection with confetti
- **ListDetail**: Full list editing with drag-and-drop reordering
- **Dashboard**: Main list overview with search/filter
- **EmptyState**: Consistent empty state messaging

### Data Models
```typescript
interface List {
  id: string
  title: string
  items: ListItem[]
  createdAt: number
  updatedAt: number
  isArchived: boolean
}

interface ListItem {
  id: string
  text: string
  createdAt: number
}
```

## Development Commands

⚠️ **No build system is currently set up.** Based on the tech spec, the intended commands would be:

```bash
# Install dependencies
npm ci

# Development server  
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Linting
npm run lint

# Type checking
npm run typecheck
```

## Key Features

### Core Functionality
- **List Management**: Create, edit, delete, archive lists
- **Item Management**: Add, edit, remove, reorder items via drag-and-drop
- **Randomization**: Animated item selection with theatrical presentation
- **Theme Support**: Dark/light mode with system preference detection
- **Authentication**: Mock Google OAuth with guest mode fallback
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Animation System
- Uses Framer Motion for smooth transitions
- Confetti celebration effects via canvas-confetti
- Multi-stage randomization with progressive slowdown
- Optimistic UI updates for better UX

### State Management
- **AuthContext**: User authentication and guest mode
- **ListsContext**: CRUD operations for lists and items
- **ThemeContext**: Dark/light theme persistence
- Local storage for data persistence in MVP

## Important Implementation Notes

### CSS Classes
- Never delete Tailwind imports in `index.css` - they are critical for styling
- Uses `dark:` prefix classes for theme support
- Responsive breakpoints: `sm:`, `md:`, `lg:`

### React Patterns
- Functional components with hooks throughout
- Context providers wrap entire app in specific order
- Custom hooks for business logic (useLists, useAuth, useTheme)
- Optimistic updates for better perceived performance

### Routing
- React Router v6 with nested routes
- Protected routes based on auth state
- URL structure: `/`, `/list/:id`, `/randomize/:id`, `/settings`, `/login`

### TypeScript
- Strict typing for all data models
- Interface definitions in shared types file
- Proper prop typing for all components

## Current State - Production Ready ✅ 

**ListLotto**: Complete, production-ready list randomizer application with real authentication and database integration.

### Application Features ✅
- **Authentication**: Real Google OAuth + Guest mode fallback
- **List Management**: Create, edit, delete, archive, search, filter
- **Item Management**: Add, edit, remove, drag-and-drop reorder, bulk import
- **Theatrical Randomizer**: Multi-stage animations with confetti celebrations
- **Templates**: 8 pre-made lists across 5 categories
- **Responsive Design**: Mobile-first with dark/light theme support
- **Data Persistence**: Supabase database + localStorage fallback
- **Cross-Device Sync**: Real-time synchronization for authenticated users

### Technical Stack ✅
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Authentication + Real-time)
- **Styling**: Tailwind CSS with dark mode
- **Animations**: Framer Motion + Canvas Confetti  
- **Drag & Drop**: @dnd-kit/sortable
- **Routing**: React Router v6 with protected routes
- **State**: Context API (Auth, Lists, Theme)
- **Authentication**: Google OAuth via Supabase
- **Database**: Supabase PostgreSQL with Row Level Security

## Next Session Goals - Production Deployment 🚀

The application is fully functional with real authentication and database integration. The only remaining tasks are production deployment:

### Priority 1: Production Supabase Project
1. Create production Supabase project (`listlotto-prod`)
2. Run `database/schema.sql` in production SQL Editor
3. Configure Google OAuth with production domain URLs
4. Copy production URL and anon key for deployment

### Priority 2: Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=https://prod-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=prod-anon-key
   VITE_GOOGLE_CLIENT_ID=prod-google-client-id.apps.googleusercontent.com
   ```
3. Deploy and test production authentication flow
4. Verify cross-device sync works in production

### Priority 3: Production Testing
- [ ] Google OAuth works with production domain
- [ ] Database operations function correctly  
- [ ] Cross-device sync works in production
- [ ] Guest mode still functions as fallback
- [ ] Performance is acceptable on production

**That's it!** The application is feature-complete and ready for production use.

### Verification Commands (Still Working)
```bash
npm run dev        # Start dev server on localhost:5173
npm run typecheck  # ✅ Passes - no TypeScript errors  
npm run lint       # ✅ Passes - only minor React Fast Refresh warnings
npm run build      # ✅ Passes - production build (357KB)
```

**Ready for Phase 5a**: CRITICAL production readiness tasks. The UI/UX is complete and fully functional, but requires real authentication and database integration before production deployment.