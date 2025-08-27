# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ListLotto is a React-based list randomizer web application that allows users to create, manage, and randomly select items from lists with engaging animations. The project is **production-ready and deployed** at [listlotto.com](https://listlotto.com) with full authentication, database integration, and all core features implemented.

## Architecture

### Tech Stack (Production)
- **Frontend**: React 18+ with TypeScript, Tailwind CSS, Framer Motion
- **State Management**: Context API (AuthContext, ListsContext, ThemeContext)  
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with dark/light theme support
- **Authentication**: Real Google OAuth via Supabase
- **Database**: Supabase PostgreSQL with Row Level Security
- **Deployment**: Vercel (frontend) + Supabase (backend)
- **Drag & Drop**: @dnd-kit for accessible item reordering

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

✅ **All commands are working and verified:**

```bash
# Install dependencies
npm install

# Development server  
npm run dev        # Starts dev server on localhost:5173

# Build for production
npm run build      # TypeScript compilation + Vite build

# Linting
npm run lint       # ESLint validation (has 2 minor warnings to fix)

# Type checking
npm run typecheck  # ✅ Passes - no TypeScript errors

# Preview production build
npm run preview    # Preview the built app locally
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

## Current State - Production Deployed ✅ 

**ListLotto**: Complete production application deployed at [listlotto.com](https://listlotto.com) with real authentication, database integration, and all core features working.

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
- **Deployment**: Vercel with production environment

## Next Session Goals - Maintenance & Enhancements 🔧

The application is production-ready and deployed. Future work focuses on maintenance and feature enhancements:

### Priority 1: Code Quality
- Clean up unused dependencies (react-beautiful-dnd)
- Fix minor ESLint warnings (2 `any` types, 1 fast refresh warning)
- Set up comprehensive testing with Jest and React Testing Library

### Priority 2: CI/CD Pipeline
- Add GitHub Actions for automated testing and linting
- Implement deployment previews for pull requests
- Set up monitoring and error tracking

### Priority 3: Feature Enhancements
- Additional randomization themes and animations  
- List sharing and collaboration features
- Data export/import functionality
- Performance optimizations and bundle size reduction

### Verification Commands ✅
```bash
npm run dev        # Start dev server on localhost:5173
npm run typecheck  # ✅ Passes - no TypeScript errors  
npm run lint       # ⚠️  Has 2 minor warnings to fix
npm run build      # ✅ Passes - production build ready
```

**Status**: Production application with room for continuous improvement and feature additions.