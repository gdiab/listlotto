# ListLotto 🎲

[![Production](https://img.shields.io/badge/status-live-green?style=flat-square)](https://listlotto.com)
[![Built with React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)](https://supabase.com/)

A modern, responsive web application that transforms decision-making into an engaging experience. Create and manage lists, then let ListLotto randomly select items with delightful theatrical animations.

**🌐 Live at: [listlotto.com](https://listlotto.com)**

## ✨ Features

### 🎯 Core Functionality
- **List Management** - Create, edit, delete, and organize lists with intuitive UI
- **Smart Item Management** - Add, edit, remove, and reorder items with drag-and-drop
- **Theatrical Randomization** - Multi-stage animated selection with confetti celebrations
- **Cross-Device Sync** - Real-time synchronization for authenticated users
- **Guest Mode** - Full functionality with localStorage for anonymous users

### 🔧 User Experience
- **Google OAuth Integration** - Secure authentication with fallback to guest mode
- **Dark/Light Theme** - Automatic system preference detection with manual toggle
- **Responsive Design** - Mobile-first approach, works seamlessly on all devices
- **List Templates** - 8 pre-made lists across 5 categories to get started quickly
- **Search & Filter** - Find lists quickly with built-in search functionality
- **Bulk Operations** - Import multiple items at once, archive/restore lists

### 🎨 Technical Highlights
- **Modern React Architecture** - React 18 with TypeScript and Context API
- **Smooth Animations** - Framer Motion for transitions, Canvas Confetti for celebrations
- **Real Database** - Supabase PostgreSQL with Row Level Security
- **Production Ready** - Deployed on Vercel with proper CI/CD pipeline
- **Accessibility First** - WCAG compliant interface with keyboard navigation

## 🚀 Quick Start

### For Users
Visit [listlotto.com](https://listlotto.com) and start creating lists immediately!

### For Developers

```bash
# Clone the repository
git clone https://github.com/yourusername/listlotto.git
cd listlotto

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Development Commands

```bash
# Development
npm run dev        # Start dev server on localhost:5173

# Production
npm run build      # Build for production
npm run preview    # Preview production build

# Code Quality
npm run typecheck  # TypeScript type checking
npm run lint       # ESLint validation
```

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | Component-based UI with type safety |
| **Styling** | Tailwind CSS | Utility-first styling with dark mode |
| **Animation** | Framer Motion + Canvas Confetti | Smooth transitions and celebrations |
| **State** | Context API | Global state management |
| **Drag & Drop** | @dnd-kit | Accessible drag-and-drop for reordering |
| **Backend** | Supabase | PostgreSQL database + authentication |
| **Auth** | Google OAuth | Secure user authentication |
| **Deployment** | Vercel | Fast, reliable hosting with CI/CD |
| **Build** | Vite | Lightning-fast development and builds |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components  
│   ├── lists/          # List management (ListCard, ItemsList, etc.)
│   ├── randomizer/     # Animation engine and result display
│   ├── common/         # Shared layout components (Header, EmptyState)
│   └── ui/             # Basic UI primitives (Button, Card, Input)
├── context/            # React context providers (Auth, Lists, Theme)
├── pages/              # Route components (Dashboard, ListDetail, etc.)
├── lib/                # Utilities and Supabase client
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

## 🎯 How It Works

1. **Create Lists** - Start with templates or build from scratch
2. **Manage Items** - Add items, edit them inline, reorder with drag-and-drop
3. **Randomize** - Hit "Choose For Me" for theatrical animated selection
4. **Sync Everywhere** - Sign in to access your lists on any device

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for backend)
- Google Cloud Console (for OAuth)

### Environment Setup
Create `.env.local`:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key  
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### Database Schema
The app uses Supabase with these main tables:
- `users` - User profiles and preferences
- `lists` - User's list data with metadata
- See `database/schema.sql` for complete schema

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Run type checking: `npm run typecheck`
5. Run linting: `npm run lint`
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙋‍♂️ Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/listlotto/issues)
- **Discussions**: Feature requests and general questions
- **Email**: Contact for urgent issues

---

Built with ❤️ using React, TypeScript, and Supabase. Making decisions fun, one randomization at a time! 🎲