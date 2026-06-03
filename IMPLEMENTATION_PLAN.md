# IMPLEMENTATION_PLAN.md
# CrowdMind — Production SaaS Transformation Plan
# Version: 1.1
# Date: 2026-06-03
# Status: PENDING REVIEW

## 1. Current State Analysis & Identified Issues

### Issue A: Avatar in Header is Non-Clickable and Doesn't Update
- **Root Cause**: In `web/src/components/StitchPage.tsx`, the `useEffect` that wires up the avatar click listener and sets `avatar.src` to a dynamic UI-avatar is missing `isLoaded` and `name` from its dependency array.
- **Result**: When the page first mounts, Clerk authentication is still loading (`isLoaded` is `false`). When Clerk finishes loading and `isLoaded` becomes `true`, the `useEffect` does not re-run, leaving the avatar static, un-clickable, and displaying the placeholder URL from the static HTML files.

### Issue B: Authentication Redirects and `/login` Behavior
- **Behavior**: Currently, after login/signup, the user is redirected by Clerk to the landing page (`/`) by default, rather than their dashboard or profile (`/home`). If they are logged in and navigate to `/login` again, the login page redirects them to `/home` (which is `ProfilePage`).
- **Gaps**: We need to ensure Clerk components explicitly redirect to `/home` post-authentication and that the navigation header updates dynamically to hide login/signup and show the user avatar once signed in.

### Issue C: Static/Hardcoded Avatar on Profile Page
- **Root Cause**: `ProfilePage.tsx` successfully fetches the logged-in user details from the backend and updates the text fields (name, email, role), but it does not update the large profile avatar image. It remains hardcoded as the template image of "Alex Rivera".

### Issue D: Missing Role-Aware Navigation Elements for Guests
- **Behavior**: The static HTML contains headers showing the avatar, settings, and notifications by default, even if the user is a guest. Guests should see "Sign In" and "Sign Up" buttons instead, and user-only links like "Ask Question" should be hidden.

---

## 2. Proposed Changes

### Component 1: `StitchPage.tsx`
- **Path**: [StitchPage.tsx](file:///c:/Users/siddh/Desktop/IIT_Ropar/CrowdMind/web/src/components/StitchPage.tsx)
- **Modifications**:
  1. Add `isLoaded`, `name`, and `role` to the `useEffect` dependency array.
  2. Implement dynamic DOM modifications in the header/nav based on the user's role:
     - **For Guest (`role === 'guest'`)**:
       - Hide the avatar container element.
       - Hide user-only links/buttons (e.g. "Ask Question", "notifications", "settings" in the top header).
       - Programmatically create and append "Sign In" and "Sign Up" buttons inside the header/nav matching the styling of the platform.
     - **For Registered User/Admin (`role === 'user' || role === 'admin'`)**:
       - Ensure the avatar container is visible, clickable, and navigates to `/home`.
       - Update the avatar source to `https://ui-avatars.com/api/?name=${name}...`.
       - Remove any temporary guest login buttons if they were appended.

### Component 2: `LoginPage.tsx` & `RegisterPage.tsx`
- **Paths**: [LoginPage.tsx](file:///c:/Users/siddh/Desktop/IIT_Ropar/CrowdMind/web/src/pages/user/LoginPage.tsx), [RegisterPage.tsx](file:///c:/Users/siddh/Desktop/IIT_Ropar/CrowdMind/web/src/pages/user/RegisterPage.tsx)
- **Modifications**:
  - Configure the `<SignIn />` and `<SignUp />` components with `fallbackRedirectUrl="/home"` and `forceRedirectUrl="/home"` props to guarantee they route straight to the user profile/dashboard after a successful login/signup.

### Component 3: `ProfilePage.tsx`
- **Path**: [ProfilePage.tsx](file:///c:/Users/siddh/Desktop/IIT_Ropar/CrowdMind/web/src/pages/user/ProfilePage.tsx)
- **Modifications**:
  - Locate the large avatar image (`img` inside the profile header section) and dynamically replace its `src` with the logged-in user's personalized UI-avatar.

---

## 3. Verification Plan

### Manual Verification
1. **Clear Session & Guest View**:
   - Log out or open an incognito window.
   - Go to `/` (Landing Page). Verify the avatar, settings, and notifications are hidden from the header.
   - Verify that "Sign In" and "Sign Up" buttons are present in the header.
   - Verify that "Ask Question" is hidden from the guest navbar.
2. **Sign In Redirect**:
   - Click "Sign In" in the header.
   - Sign in using test credentials.
   - Verify you are immediately redirected to `/home` (Profile Page).
3. **Profile Verification**:
   - On the profile page, verify that both the header avatar and the main profile page avatar display a personalized avatar based on your name.
   - Verify that clicking the header avatar successfully navigates back to `/home`.
4. **Already Logged In Redirect**:
   - While signed in, manually type `/login` in the address bar.
   - Verify that the app immediately redirects you back to `/home` without flashing the login form or the landing page.
