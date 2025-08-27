# Production Deployment Guide for ListLotto

## Overview
This guide covers deploying ListLotto to production on `listlotto.com` using Vercel + Supabase while maintaining separate development and production environments.

## Prerequisites
- GitHub repository with ListLotto code
- Vercel account
- Supabase account
- Google Cloud Console access
- Domain `listlotto.com` (purchased)

## Phase 1: Production Supabase Setup

### 1.1 Create Production Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Name: `listlotto-prod`
4. Choose a region (ideally close to your users)
5. Generate a strong database password
6. Click "Create new project"
7. **Save the following for later:**
   - Project URL: `https://[project-id].supabase.co`
   - Project API Key (anon, public): `eyJ...`

### 1.2 Setup Production Database
1. In Supabase dashboard, go to SQL Editor
2. Copy contents of `database/schema.sql` from your repository
3. Run the SQL script in the SQL Editor
4. Verify tables are created:
   - `public.users`
   - `public.lists`
5. Confirm Row Level Security (RLS) is enabled on both tables

### 1.3 Configure Production Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create new one for production)
3. Navigate to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Under "Authorized JavaScript origins", add:
   - `https://listlotto.com`
   - `https://www.listlotto.com`
6. Under "Authorized redirect URIs", add:
   - `https://listlotto.com/auth/callback`
   - `https://www.listlotto.com/auth/callback`
7. Save changes
8. **Save the Client ID for later:** `[client-id].apps.googleusercontent.com`

## Phase 2: Vercel Deployment

### 2.1 Connect GitHub Repository to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your `listlotto` GitHub repository
4. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm ci`

### 2.2 Configure Production Environment Variables
In the Vercel project settings, add these environment variables:

```bash
VITE_SUPABASE_URL=https://[your-prod-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[your-prod-anon-key]
VITE_GOOGLE_CLIENT_ID=[your-prod-google-client-id].apps.googleusercontent.com
```

**Important:** Replace the bracketed values with your actual production credentials from Steps 1.1 and 1.3.

### 2.3 Setup Custom Domain
1. In Vercel project settings, go to "Domains"
2. Add custom domain: `listlotto.com`
3. Add redirect: `www.listlotto.com` → `listlotto.com`
4. Follow Vercel's DNS configuration instructions:
   - Point your domain's DNS to Vercel's nameservers, OR
   - Add the provided CNAME/A records to your domain provider
5. Wait for DNS propagation (can take up to 48 hours)

### 2.4 Deploy to Production
1. Click "Deploy" in Vercel
2. Monitor build logs for any errors
3. Once deployed, visit your deployment URL to test

## Phase 3: Production Testing & Verification

### 3.1 Authentication Testing
1. Visit `https://listlotto.com` (✅ DEPLOYED)
2. Test Google OAuth login:
   - Click "Sign in with Google"
   - Complete OAuth flow
   - Verify you're redirected back to the app
   - Check that user profile is created in Supabase
3. Test Guest Mode:
   - Use app without signing in
   - Create lists and verify they work with localStorage
   - Confirm no errors in browser console

### 3.2 Core Functionality Testing
1. **List Management:**
   - Create new lists
   - Add/edit/delete items
   - Test drag-and-drop reordering
   - Archive/unarchive lists
2. **Randomizer:**
   - Test "Choose For Me" functionality
   - Verify animations work smoothly
   - Confirm confetti celebrations trigger
3. **Cross-Device Sync (for authenticated users):**
   - Login on multiple devices/browsers
   - Create/modify lists on one device
   - Verify changes appear on other devices

### 3.3 Performance & UX Testing
1. **Mobile Responsiveness:**
   - Test on various screen sizes
   - Verify touch interactions work
   - Check that animations perform well on mobile
2. **Theme Support:**
   - Toggle between light/dark mode
   - Verify theme persists across sessions
3. **Performance:**
   - Check page load times
   - Verify bundle size is reasonable (`npm run build` locally)
   - Test with throttled network conditions

## Environment Summary

After deployment, you'll have two completely isolated environments:

### Development Environment
- **URL:** `http://localhost:5173`
- **Database:** Your development Supabase project
- **Google OAuth:** Configured for localhost
- **Purpose:** Development and testing

### Production Environment ✅ LIVE
- **URL:** `https://listlotto.com` (✅ DEPLOYED)
- **Database:** Production Supabase project with RLS enabled
- **Google OAuth:** Configured for production domain  
- **Status:** Live application serving users
- **Performance:** Optimized for production workloads

## Maintenance Commands

### Local Development
```bash
npm run dev        # Start development server
npm run typecheck  # Check TypeScript errors
npm run lint       # Check linting
npm run build      # Test production build locally
```

### Monitoring Production
- **Vercel Dashboard:** Monitor deployments, analytics, and performance
- **Supabase Dashboard:** Monitor database usage, API calls, and user activity
- **Google Cloud Console:** Monitor OAuth usage and quotas

## Troubleshooting

### Common Issues
1. **OAuth not working in production:**
   - Verify redirect URIs are correctly configured in Google Cloud Console
   - Check that the production domain matches exactly
   - Ensure HTTPS is being used

2. **Database connection issues:**
   - Verify environment variables are set correctly in Vercel
   - Check that RLS policies allow user operations
   - Confirm Supabase project is active

3. **Build failures:**
   - Run `npm run build` locally to reproduce
   - Check TypeScript errors with `npm run typecheck`
   - Verify all dependencies are listed in package.json

4. **Domain not working:**
   - Check DNS propagation with tools like `dig` or online DNS checkers
   - Verify domain configuration in Vercel matches your DNS settings
   - Allow up to 48 hours for full DNS propagation

## Security Considerations

### Environment Variables
- Never commit production secrets to version control
- Rotate keys periodically
- Use different credentials for dev/staging/production

### Database Security
- Row Level Security (RLS) is enabled and configured
- Users can only access their own data
- All database operations go through Supabase's secure API

### Authentication
- OAuth tokens are handled securely by Supabase
- User sessions are managed with secure HTTP-only cookies
- Guest mode uses only localStorage (no sensitive data)

## Next Steps After Deployment

1. **Monitoring Setup:**
   - Consider adding error tracking (Sentry, LogRocket)
   - Set up uptime monitoring
   - Configure Vercel Analytics

2. **Performance Optimization:**
   - Monitor Core Web Vitals
   - Optimize images and assets
   - Consider implementing service worker for offline functionality

3. **User Feedback:**
   - Set up feedback collection mechanism
   - Monitor user behavior and usage patterns
   - Plan future feature releases

---

**Deployment Complete!** 🎉

ListLotto is now live and serving users at `https://listlotto.com` with full authentication, database integration, cross-device sync, and all core features operational in production.

**Next Steps:** See `docs/TODO.md` for maintenance tasks and future feature enhancements.