# Environment Configuration Guide

## Overview
This document explains the environment variable configuration for both backend and frontend applications.

---

## Backend Configuration

### Location
`server/.env`

### Variables

#### MongoDB Connection
```bash
MONGODB_URL=mongodb+srv://emote_123:emote123@emote.i9ntqfv.mongodb.net/?appName=Emote
```
- Production: Use MongoDB Atlas connection string
- Development: Can use local MongoDB (`mongodb://localhost:27017/emotetechnology`) or Atlas

#### Server Settings
```bash
PORT=5000
NODE_ENV=development
```
- `PORT`: Server listening port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)

#### CORS Configuration
```bash
FRONTEND_URL=http://localhost:5173
```
- Specifies allowed frontend origin for CORS
- Update in production to your actual frontend domain

#### JWT Authentication
```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=7d
```
- `JWT_SECRET`: Secret key for signing tokens (**CHANGE IN PRODUCTION**)
- `JWT_EXPIRES_IN`: Token expiration time (7d = 7 days)

**Generate a Secure JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Frontend Configuration

### Location
`client/.env`

### Variables

#### Backend API URL
```bash
VITE_API_URL=http://localhost:5000/api
```
- Points to the backend API endpoint
- **Note**: Vite requires `VITE_` prefix for environment variables

#### App Settings
```bash
VITE_APP_NAME=EmoteTechnology
VITE_APP_ENV=development
```

---

## Usage in Code

### Backend
Environment variables are accessed using `process.env`:
```javascript
const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET;
```

### Frontend
Vite environment variables use `import.meta.env`:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

---

## Production Deployment

### Backend
1. **Generate a secure JWT_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Update environment variables**:
   - Set `NODE_ENV=production`
   - Use production MongoDB URL
   - Set `FRONTEND_URL` to your deployed frontend domain

3. **Example Production .env**:
   ```bash
   MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://yourdomain.com
   JWT_SECRET=<generated-secure-secret>
   JWT_EXPIRES_IN=7d
   ```

### Frontend
1. **Update API URL**:
   ```bash
   VITE_API_URL=https://api.yourdomain.com/api
   VITE_APP_ENV=production
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

---

## Security Best Practices

✅ **DO**:
- Keep `.env` files out of version control (already in `.gitignore`)
- Use different secrets for development and production
- Generate strong, random JWT secrets
- Use HTTPS in production
- Limit CORS origins to specific domains

❌ **DON'T**:
- Commit `.env` files to Git
- Use the same JWT_SECRET across environments
- Use weak or predictable secrets
- Allow CORS from all origins (`*`) in production

---

## Troubleshooting

### Frontend can't connect to backend
1. Check `VITE_API_URL` matches backend URL
2. Verify backend server is running
3. Check CORS configuration in backend
4. Restart Vite dev server after changing `.env`

### JWT token errors
1. Verify `JWT_SECRET` is set in backend `.env`
2. Check token hasn't expired
3. Ensure frontend is sending token in Authorization header

### CORS errors
1. Verify `FRONTEND_URL` matches your frontend origin
2. Check `credentials: true` is set in CORS config
3. Ensure frontend is running on the specified port

---

## Files Reference

- `server/.env` - Backend environment variables (gitignored)
- `server/.env.example` - Backend template (committed to Git)
- `client/.env` - Frontend environment variables (gitignored)
- `client/.env.example` - Frontend template (committed to Git)
