# Product Requirements Document
## List Randomizer App (v2.0) aka ListLotto

### Executive Summary
✅ **LAUNCHED**: A modern, responsive web application deployed at [listlotto.com](https://listlotto.com) that allows users to create, manage, and save lists of items, with a unique feature that randomly selects items from lists with an engaging, theatrical presentation.

### Product Overview

#### Vision
Transform decision-making from a mundane task into an entertaining experience by combining practical list management with delightful randomization animations.

#### Target Users
- Individuals struggling with decision fatigue
- Groups needing fair, random selections (restaurants, activities, etc.)
- Anyone who wants to add fun to everyday choices
- Users seeking a simple, visually appealing list management tool

#### Key Differentiators
- Theatrical, engaging randomization experience
- Clean, modern interface
- Cross-device compatibility
- Simple yet powerful list management

### Core Features

#### 1. List Management ✅ COMPLETE
**Create Lists**
- ✅ Add new lists with custom titles
- ✅ Add/edit/delete items within lists
- ✅ Reorder items via drag-and-drop (@dnd-kit implementation)
- ✅ List templates (8 pre-made lists across 5 categories)

**List Organization**
- ✅ Search across all lists
- ✅ Sort lists by: creation date, last modified, alphabetical
- ✅ Archive/unarchive lists
- ✅ Bulk operations and list management

#### 2. Randomization Engine ✅ COMPLETE
**The "Choose For Me" Experience**
- ✅ Animated selection process with theatrical build-up
- ✅ Smooth animations powered by Framer Motion
- ✅ Confetti celebration effects (canvas-confetti)
- ✅ Engaging visual presentation with multiple stages
- 🔄 History of recent selections (future enhancement)

**Randomization Options**
- ✅ True random selection algorithm
- 🔄 Weighted randomization (see docs/TODO.md)
- 🔄 Exclude recent selections option (see docs/TODO.md)
- 🔄 Multi-pick mode (see docs/TODO.md)

#### 3. User Accounts & Authentication ✅ COMPLETE
**Account Creation**
- ✅ Google OAuth integration via Supabase (primary)
- ✅ Guest mode with localStorage (full functionality)
- ❌ Email/password option (not implemented - OAuth preferred)

**Account Features**
- ✅ Real-time sync across devices for authenticated users
- ✅ User profiles with Google account integration
- ✅ Theme preference persistence (dark/light mode)
- 🔄 Data export functionality (see docs/TODO.md)

#### 4. User Interface ✅ COMPLETE
**Design Principles**
- ✅ Mobile-first responsive design with Tailwind CSS
- ✅ Dark/light mode toggle with system preference detection
- ✅ Smooth animations and transitions (Framer Motion)
- ✅ Accessibility compliant interface with keyboard navigation

**Key Screens**
- ✅ Dashboard (list overview with search and filters)
- ✅ List detail/edit view with inline editing
- ✅ Randomization screen with theatrical animations
- ✅ Settings page with theme controls
- 🔄 Onboarding flow (basic version implemented)

### User Stories

#### New User Flow
1. User lands on homepage
2. Can try demo without account
3. Creates account via Google
4. Guided through creating first list
5. Shown randomization feature

#### Core User Journey
1. User opens app
2. Views dashboard with all lists
3. Selects or creates a list
4. Adds/edits items
5. Clicks "Choose For Me"
6. Watches animation sequence
7. Sees selected result
8. Can re-roll or accept choice

## Production Status Summary

### ✅ Completed Features
- **Full List Management**: Create, edit, delete, archive, search, reorder
- **Drag & Drop Reordering**: Accessible implementation with @dnd-kit
- **Theatrical Randomization**: Multi-stage animations with confetti
- **Google OAuth Authentication**: Real authentication via Supabase
- **Guest Mode**: Full functionality with localStorage
- **Cross-Device Sync**: Real-time synchronization for authenticated users
- **Responsive Design**: Mobile-first with dark/light theme support
- **List Templates**: 8 pre-made lists to get users started
- **Production Deployment**: Live at [listlotto.com](https://listlotto.com)

### 🔄 Future Enhancements (see docs/TODO.md)
- Additional randomization themes and options
- Data export/import functionality
- Enhanced analytics and selection history
- Collaboration and sharing features
- Performance optimizations and testing infrastructure

### Technical Requirements ✅ IMPLEMENTED

#### Performance
- Page load < 2 seconds
- Smooth 60fps animations
- Offline capability for viewing lists
- Optimistic UI updates

#### Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS/Android)
- PWA capabilities for app-like experience

#### Security
- Secure authentication
- Encrypted data transmission
- GDPR compliant
- Regular security audits

### Success Metrics
- User retention (30-day)
- Daily active users
- Lists created per user
- Randomization usage rate
- Time to first list creation

### Future Enhancements
- Collaborative lists
- Weighted randomization
- Custom animation themes
- Native mobile apps
- AI-powered list suggestions
- Integration with other services
- List templates marketplace

### MVP Scope
1. Google authentication
2. Create/edit/delete lists
3. Basic randomization with one animation style
4. Responsive design
5. Dark/light mode
6. Basic user settings

### Post-MVP Features
1. Multiple animation styles
2. Sound effects
3. List sharing
4. Templates
5. Weighted randomization
6. Multi-selection
7. History tracking