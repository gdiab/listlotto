# TODO - Maintenance & Feature Roadmap

This document tracks technical debt, maintenance tasks, and future feature ideas for ListLotto.

## 🔧 Technical Debt & Maintenance

### High Priority

#### Dependency Cleanup
- [ ] **Remove unused react-beautiful-dnd package** 
  - Remove `react-beautiful-dnd` from package.json
  - Remove `@types/react-beautiful-dnd` from devDependencies  
  - App uses @dnd-kit instead, which is better for accessibility

#### Code Quality
- [ ] **Fix ESLint warnings** (2 errors, 1 warning currently)
  - Fix `any` type usage in `AnimationEngine.tsx:107`
  - Fix `any` type usage in `ListsContext.tsx:206` 
  - Address React Fast Refresh warning in AuthContext.tsx
- [ ] **Clean up unused imports** across the codebase
- [ ] **Add missing TypeScript types** where `any` is currently used

#### CI/CD Pipeline Setup
- [ ] **Set up comprehensive GitHub Actions workflow**
  - Automated type checking on PRs
  - ESLint validation (after fixing current errors)
  - Build verification for all commits
  - Deployment previews for pull requests
  - Security scanning and dependency checks
- [ ] **Integration with Vercel**
  - Automated deployment from main branch
  - PR preview deployments
  - Build status reporting

### Medium Priority

#### Testing Infrastructure (Not Yet Implemented)
- [ ] **Set up Jest and React Testing Library**
  - Install testing dependencies
  - Configure Jest with Vite
  - Set up testing environment and globals
- [ ] **Write core component tests**
  - ListCard component tests
  - RandomizerView animation tests  
  - Context provider tests (Auth, Lists, Theme)
  - Integration tests for list CRUD operations
- [ ] **Add test coverage reporting**
  - Istanbul/nyc integration
  - Coverage thresholds in CI/CD
  - Badge for README

#### Performance & Bundle Optimization
- [ ] **Analyze and optimize bundle size**
  - Review webpack-bundle-analyzer output
  - Code splitting for routes  
  - Lazy loading of heavy components
- [ ] **Image optimization**
  - Optimize any images/assets
  - Consider WebP format for better compression
- [ ] **Performance monitoring setup**
  - Lighthouse CI integration
  - Core Web Vitals tracking

### Low Priority

#### Developer Experience
- [ ] **Prettier setup** for consistent code formatting
- [ ] **Husky pre-commit hooks** for automated linting/testing
- [ ] **VS Code workspace settings** for consistent development environment
- [ ] **API documentation** for Supabase schema and operations

## 🚀 Feature Roadmap

### Phase 2: Enhanced User Experience

#### Randomization Improvements
- [ ] **Multiple randomization themes**
  - Slot machine animation style
  - Card shuffle animation
  - Wheel of fortune style
  - Custom animation speed controls
- [ ] **Randomization options**
  - Exclude recently selected items
  - Weighted randomization (assign weights to items)
  - Multi-pick mode (select multiple items at once)
- [ ] **Selection history and analytics**
  - Track selection frequency per item
  - Visual charts of selection patterns
  - Export selection history

#### List Management Enhancements
- [ ] **Advanced list organization**
  - Folders/categories for organizing lists
  - Tags and labels system
  - Favorite lists pinning
- [ ] **List templates expansion**
  - User-created custom templates
  - Community template sharing
  - Template categories and discovery
- [ ] **Bulk operations**
  - Import lists from CSV/text files
  - Bulk edit multiple items
  - Duplicate lists with modifications

### Phase 3: Collaboration & Sharing

#### Sharing Features
- [ ] **Public list sharing**
  - Generate shareable links for lists
  - View-only mode for shared lists  
  - QR codes for easy mobile sharing
- [ ] **Real-time collaboration**
  - Multiple users editing same list
  - Live cursor positions
  - Change history and conflict resolution
- [ ] **Social features**
  - User profiles and list galleries
  - Follow other users' public lists
  - Like and comment on shared lists

### Phase 4: Advanced Features

#### Data & Analytics
- [ ] **Data export/import**
  - Export all user data (JSON, CSV formats)
  - Import from other randomizer apps
  - Backup and restore functionality
- [ ] **Advanced analytics dashboard**
  - Usage statistics and insights
  - List popularity metrics
  - Randomization pattern analysis

#### Integrations
- [ ] **API for developers**
  - Public API for accessing user lists
  - Webhook support for external integrations
  - Third-party app connections
- [ ] **Mobile app consideration**
  - React Native implementation
  - Native mobile features (notifications, widgets)
  - Offline functionality

#### Accessibility & Internationalization
- [ ] **Enhanced accessibility**
  - Screen reader optimization
  - High contrast mode
  - Keyboard shortcut customization
- [ ] **Internationalization (i18n)**
  - Multi-language support
  - Right-to-left language support
  - Localized number and date formatting

## 🔍 Performance & Monitoring

### Infrastructure Improvements
- [ ] **Error tracking and monitoring**
  - Sentry integration for error reporting
  - Performance monitoring and alerting
  - User feedback collection system
- [ ] **Advanced CI/CD pipeline**
  - Automated testing on multiple browsers
  - Visual regression testing
  - Deployment previews for pull requests
- [ ] **SEO and discoverability**
  - Meta tags optimization
  - Structured data markup
  - Sitemap generation

## 💡 Innovation Ideas

### Experimental Features
- [ ] **AI-powered suggestions**
  - Smart list item suggestions based on list context
  - Auto-categorization of list items
  - Duplicate detection and removal
- [ ] **Voice integration**
  - Voice commands for list operations
  - Text-to-speech for randomization results
  - Voice input for adding items
- [ ] **Gamification elements**
  - Achievement system for active users
  - Streak counters for daily usage
  - Social challenges and competitions

---

## 📋 How to Contribute

When working on items from this TODO list:

1. **Create an issue** for the task if one doesn't exist
2. **Branch naming**: Use `feature/` or `fix/` prefixes
3. **Testing**: Add tests for new functionality  
4. **Documentation**: Update relevant docs
5. **Performance**: Consider impact on bundle size and load times
6. **Accessibility**: Ensure WCAG compliance

## 📝 Status Legend

- [ ] **Not started** - Ready to be picked up
- [🔄] **In progress** - Currently being worked on  
- [✅] **Completed** - Done and deployed
- [⏸️] **On hold** - Waiting for dependencies or decisions
- [❌] **Cancelled** - Decided not to implement

---

*Last updated: August 27, 2025*  
*Next review: Monthly or when priorities change*