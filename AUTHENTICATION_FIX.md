# Authentication & Authorization Fixes

## 🎯 Issues Fixed

### **Problem 1: 401 Unauthorized Errors on API Calls**
**Error**: `Failed to load resource: the server responded with a status of 401 (Unauthorized)`

**Root Causes**:
- ❌ Token was NOT being stored in `localStorage` after login
- ❌ API interceptors couldn't find the token
- ❌ Main API instance (`/utils/api.js`) had NO token interceptor

### **Problem 2: AuthProvider Not Available**
**Error**: `useAuth must be used within an AuthProvider`

**Root Cause**:
- ❌ Job portal components were NOT wrapped with `AuthProvider`
- Job portal expects separate authentication context from main app

---

## ✅ Solutions Implemented

### **Fix 1: Added Token Interceptor to Main API** 
**File**: `/client/src/utils/api.js`

```javascript
// Add token interceptor to include auth headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
```

**Why**: Now ALL API requests automatically include the authorization token.

---

### **Fix 2: Store Token on Login & Signup**
**File**: `/client/src/redux/slices/authSlice.js`

**Login handler**:
```javascript
.addCase(login.fulfilled, (state, action) => {
    state.isLoggingIn = false;
    state.user = action.payload.user;
    state.isAuthenticated = true;
    // Store token in localStorage for API requests
    if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
    }
})
```

**Signup handler**:
```javascript
.addCase(signup.fulfilled, (state, action) => {
    state.isSigningUp = false;
    state.user = action.payload.user;
    state.isAuthenticated = true;
    // Store token in localStorage for API requests
    if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
    }
})
```

**Why**: Token is now persisted in localStorage immediately after authentication, making it available for all API calls.

---

### **Fix 3: Clear Token on Logout**
**File**: `/client/src/redux/slices/authSlice.js`

```javascript
.addCase(logout.fulfilled, (state) => {
    state.isLoggingOut = false;
    state.user = null;
    state.isAuthenticated = false;
    // Clear token from localStorage
    localStorage.removeItem('token');
})
.addCase(logout.rejected, (state, action) => {
    state.isLoggingOut = false;
    state.user = null;
    state.isAuthenticated = false;
    // Clear token from localStorage even on failure
    localStorage.removeItem('token');
})
```

**Why**: Ensures token is removed when user logs out, preventing unauthorized access.

---

### **Fix 4: Wrap Job Portal with AuthProvider**
**File**: `/client/src/pages/Jobs.jsx`

```javascript
import { AuthProvider } from '../components/Job-portal/context/AuthContext';

// Split into wrapper + content
const JobsContent = () => {
    // ... original Jobs component code
};

// Wrapper component with AuthProvider
const Jobs = () => {
    return (
        <AuthProvider>
            <JobsContent />
        </AuthProvider>
    );
};

export default Jobs;
```

**Why**: Job portal components can now use `useAuth()` hook without errors.

---

## 📊 Authentication Flow

### **Login Flow**
```
1. User enters email/password
   ↓
2. LoginForm calls: dispatch(login({ email, password }))
   ↓
3. Redux authSlice calls: authAPI.login(credentials)
   ↓
4. Backend validates and returns: { user, token }
   ↓
5. login.fulfilled handler:
   - Sets state.user = action.payload.user
   - Stores token in localStorage ✅ (FIXED)
   ↓
6. API interceptor automatically adds:
   - Authorization: Bearer <token> ✅ (FIXED)
   ↓
7. All API requests now work with authentication
```

### **API Request Flow**
```
1. Component makes API call
   ↓
2. Main API instance interceptor checks localStorage for token
   ↓
3. If token exists:
   - Adds Authorization header: Bearer <token>
   - Job portal API also has same interceptor
   ↓
4. Backend receives request with token
   ↓
5. Auth middleware validates token
   ↓
6. Request proceeds (200 OK) or returns (401 Unauthorized)
```

### **Logout Flow**
```
1. User clicks logout button
   ↓
2. Dispatch: logout()
   ↓
3. Backend call: authAPI.logout()
   ↓
4. logout.fulfilled handler:
   - Clears state.user = null
   - Removes token from localStorage ✅ (FIXED)
   ↓
5. Future API calls have no token
   ↓
6. Backend returns 401, user redirected to login
```

---

## 🔐 Token Storage Architecture

### **Before Fix**
```
Login Success
    ↓
Redux state updated
    ↓
Token ❌ NOT stored anywhere
    ↓
API calls fail with 401 (no token to send)
```

### **After Fix**
```
Login Success
    ↓
Redux state updated
    ↓
Token ✅ stored in localStorage
    ↓
API interceptor retrieves it
    ↓
All API calls include: Authorization: Bearer <token>
    ↓
API requests succeed (200 OK)
```

---

## 🔄 Multi-System Authentication Support

The app uses **two separate authentication systems**:

### **Main App (Redux Auth)**
- Used by: Course platform, faculty, students
- Token storage: localStorage (now via Redux)
- API instance: `/utils/api.js` (now has interceptor)
- Authentication context: Redux state

### **Job Portal (Context Auth)**
- Used by: Job seekers, employers
- Token storage: localStorage
- API instance: `/components/Job-portal/services/api.js` (has interceptor)
- Authentication context: `AuthProvider` (now wrapping components)

**Both systems now properly**:
- ✅ Store tokens in localStorage
- ✅ Include tokens in API headers
- ✅ Clear tokens on logout
- ✅ Support independent authentication flows

---

## 🧪 Testing Authentication

### **Test Login & Token Storage**
```javascript
// After login, check localStorage
console.log(localStorage.getItem('token')); // Should show: eyJhbGc...
console.log(localStorage.getItem('user'));  // Should show: {...user data}
```

### **Test API Calls**
```javascript
// Check browser DevTools Network tab
// All API requests should have header:
Authorization: Bearer eyJhbGc...
```

### **Test Job Portal Endpoints**
```
✅ GET /api/companies/jobs  - Should work with token
✅ GET /api/companies/me    - Should work with token
✅ GET /api/jobs            - Should work with token
✅ POST /api/applications   - Should work with token
```

### **Test Logout**
```javascript
// After logout, check localStorage
console.log(localStorage.getItem('token')); // Should be: null
// API calls should fail with 401
```

---

## 📋 Checklist: Authentication System

- ✅ Token stored on login
- ✅ Token stored on signup
- ✅ Token cleared on logout
- ✅ Main API has token interceptor
- ✅ Job portal API has token interceptor
- ✅ Job portal wrapped with AuthProvider
- ✅ Job portal components can use useAuth()
- ✅ All API requests include Authorization header
- ✅ 401 errors should no longer occur for authenticated users

---

## 🚀 Environment Setup

### **Required Environment Variables**
```env
# .env or .env.local
VITE_API_URL=http://localhost:5000/api
# OR
VITE_BACKEND_URL=http://localhost:5000/api
```

### **Server-Side Token Configuration**
Ensure your backend:
- ✅ Returns `token` in login response
- ✅ Has proper auth middleware on protected routes
- ✅ Validates Bearer tokens correctly
- ✅ Returns 401 for invalid/missing tokens

---

## 📝 Files Modified

1. **`/client/src/pages/Jobs.jsx`**
   - Added AuthProvider import
   - Wrapped JobsContent with AuthProvider

2. **`/client/src/utils/api.js`**
   - Added request interceptor for token

3. **`/client/src/redux/slices/authSlice.js`**
   - Login handler: store token
   - Signup handler: store token
   - Logout handlers: clear token

4. **`/client/src/components/Job-portal/context/AuthContext.jsx`**
   - Already had token storage support (no changes needed)

5. **`/client/src/components/Job-portal/services/api.js`**
   - Already had token interceptor (no changes needed)

---

## 🔧 Troubleshooting

### **Still getting 401 errors?**
1. Clear browser storage: `localStorage.clear()`
2. Log out and log in again
3. Check DevTools Network tab for Authorization header
4. Check browser console for errors

### **Token not persisting?**
1. Check if localStorage is enabled
2. Verify browser allows localStorage for this domain
3. Check Redux DevTools (if installed) for token in state

### **useAuth hook still errors?**
1. Verify Jobs.jsx is using AuthProvider wrapper
2. Check that component is child of AuthProvider
3. Confirm AuthProvider is imported correctly

---

## ✨ Result

All authentication issues are now resolved:
- ✅ Tokens are properly stored and transmitted
- ✅ 401 errors will no longer occur for authenticated users
- ✅ Job portal fully integrated with authentication
- ✅ Both main app and job portal work seamlessly
