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

## Current State - Phase 4 Complete ✅ 

**Full-Featured Application**: ListLotto is now a complete, production-ready application with:

### ✅ Phase 1: Foundation (Complete)
- Vite + React 18 + TypeScript build system
- Tailwind CSS with dark mode support configured  
- All core dependencies installed and working
- Complete project structure created
- Comprehensive TypeScript definitions
- ESLint and development tools configured

### ✅ Phase 2: Core Infrastructure (Complete)
- Complete context providers (Theme, Auth, Lists)
- Basic UI components (Button, Input, Modal, Card)
- React Router setup with protected routes
- App structure with provider hierarchy
- Header with navigation and theme toggle
- Core pages (Login, Dashboard, Settings)

### ✅ Phase 3: List Management Features (Complete)
- Enhanced ListCard with actions and improved styling
- Comprehensive ListDetail with full list editing
- Drag & Drop System using @dnd-kit for item reordering
- ItemsList Component with sortable, inline editing
- AddItemForm Component for adding new items
- EmptyState Component for consistent messaging
- Enhanced Dashboard with search, filtering, archive management
- Mobile-first responsive design with touch-friendly drag handles

### ✅ Phase 4: Polish & Advanced Features (Complete)
- **Theatrical Animation System**: Complete RandomizerView with multi-stage animations
- **Framer Motion Integration**: Smooth transitions, scaling, rotation, particle effects
- **Canvas Confetti**: Multi-burst celebration sequences with custom colors
- **Advanced Animation Components**:
  - SpinnerAnimation: Progressive slowdown with visual effects
  - ResultDisplay: Celebration with shimmer effects and floating particles
  - AnimationEngine: Complete orchestration of randomization stages
- **Bulk Operations**: Import multiple items via line/comma separation
- **List Templates**: 8 curated templates across 5 categories (food, entertainment, activities, places, education)
- **Enhanced Dashboard**: Dropdown menu with advanced creation options

## Handoff for Next Session 🔄

### Current Session Summary (Phase 4 Complete ✅)
- **What was accomplished**: Complete Phase 4 advanced features with theatrical animations, bulk operations, and templates
- **Status**: All Phase 1-4 tasks completed successfully - fully functional application
- **Verification**: TypeScript ✅, Build ✅ (357KB), All routes working ✅
- **Files created**: 25+ files across 4 phases of development
- **Functionality**: Complete list management with theatrical randomizer, bulk import, templates, drag-and-drop editing

### Key Application Features Working ✅
1. **Authentication**: Mock Google OAuth + Guest mode
2. **List Management**: Create, edit, delete, archive, search, filter
3. **Item Management**: Add, edit, remove, drag-and-drop reorder, bulk import
4. **Theatrical Randomizer**: Multi-stage animations with confetti celebrations
5. **Templates**: 8 pre-made lists across 5 categories
6. **Responsive Design**: Mobile-first with dark/light theme support
7. **Data Persistence**: Local storage with user/guest separation

### Technical Stack Complete ✅
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with dark mode
- **Animations**: Framer Motion + Canvas Confetti  
- **Drag & Drop**: @dnd-kit/sortable
- **Routing**: React Router v6 with protected routes
- **State**: Context API (Auth, Lists, Theme)

### Next Session Goals (Phase 5a: Production Authentication & Database)

⚠️ **CRITICAL**: Current app is NOT production-ready due to mock auth and localStorage-only data persistence.

**Priority 1: Real Authentication System**
```bash
# Backend setup options:
# Option A: Supabase (recommended for speed)
npm install @supabase/supabase-js

# Option B: Custom backend with Prisma
npm install @prisma/client prisma
npm install express cors helmet
npm install passport passport-google-oauth20
```

**Priority 2: Database & Data Migration**
- Set up PostgreSQL database (Supabase or custom)
- Create user and lists schema with proper relationships
- Implement real Google OAuth 2.0 flow with API keys
- Migrate from localStorage to database storage
- Add proper user session management

**Priority 3: Production Infrastructure**
- Environment configuration (dev/staging/prod)
- API endpoints for secure CRUD operations  
- Error handling and data validation
- CORS and security middleware
- User data association and cross-device sync

### Implementation Notes
1. **Authentication**: Replace mock Google OAuth with real OAuth 2.0 flow
2. **Database Schema**: Users table linked to Lists table with foreign keys
3. **Security**: Proper JWT tokens, rate limiting, input validation
4. **Migration Path**: Export localStorage data → import to database
5. **Backward Compatibility**: Maintain guest mode for anonymous users

### Phase 5b: PWA & Performance (After Production Core)

**Priority 1: Progressive Web App**
- PWA manifest and service worker
- Offline functionality with cache strategies
- Install prompts and splash screens

**Priority 2: Performance Optimization**
- Bundle analysis and code splitting
- Virtual scrolling for large lists
- Image optimization and lazy loading

**Priority 3: Advanced Features**
- Export/import lists (JSON/CSV)
- List sharing via URLs/QR codes
- Usage analytics and statistics

### Implementation Notes
1. **PWA Setup**: Use Vite PWA plugin for automatic service worker generation
2. **Offline Support**: Cache essential pages and data for offline use
3. **Performance**: Target <100ms interactions, <1s initial load
4. **Mobile Experience**: Add install prompts, splash screens
5. **Accessibility**: Full keyboard navigation, screen reader support

### Verification Commands (Still Working)
```bash
npm run dev        # Start dev server on localhost:5173
npm run typecheck  # ✅ Passes - no TypeScript errors  
npm run lint       # ✅ Passes - only minor React Fast Refresh warnings
npm run build      # ✅ Passes - production build (357KB)
```

**Ready for Phase 5a**: CRITICAL production readiness tasks. The UI/UX is complete and fully functional, but requires real authentication and database integration before production deployment.