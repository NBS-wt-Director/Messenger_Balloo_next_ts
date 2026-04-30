# Security Recommendations for Balloo Messenger

## 🔐 Critical Security Fixes Required Before Production

### 1. Environment Variables

**DO NOT COMMIT `.env.local` TO GIT!**

```bash
# Add to .gitignore
.env.local
.env.production
*.db
prisma/dev.db
```

### 2. Generate Secure Secrets

```bash
# JWT Secret (minimum 32 characters)
openssl rand -base64 32

# Encryption Key (minimum 32 characters)  
openssl rand -base64 32

# NextAuth Secret
openssl rand -base64 32
```

### 3. Current Issues

#### ⚠️ Hardcoded Secrets in .env
```
CURRENT: JWT_SECRET="RnTytYjfV1Np5dEi4J8vroMHG2uPFKUCZx9DQ3eqbLOX0hSI6zWkgscmAlBa7w"
ISSUE: This is a test/weak secret
FIX: Generate new secret with openssl command above
```

### 4. API Security

#### Rate Limiting
```typescript
// Already implemented in middleware-rate-limit.ts
// Ensure it's active on all API routes
```

#### Input Validation
```typescript
// All API routes should validate input with Zod
// Example from shared/src/api.ts - ensure all inputs are validated
```

### 5. Database Security

#### SQL Injection Prevention
```typescript
// ✅ GOOD: Using Prisma parameterized queries
where: { email: userInput }

// ❌ BAD: Never use raw SQL with string interpolation
// Prisma protects against this by default
```

### 6. Authentication Security

#### JWT Token Expiry
```typescript
// Recommended settings:
// Access token: 15 minutes
// Refresh token: 7 days
// In shared/src/auth.ts:
generateToken(payload, '15m') // access token
generateToken(payload, '7d')  // refresh token
```

#### Password Hashing
```typescript
// Currently using bcryptjs with cost factor 10
// ✅ GOOD for most applications
// Consider cost factor 12 for higher security (slower but more secure)
```

### 7. File Upload Security

#### Validation Required
```typescript
// In api/attachments and api/yandex-disk routes:
// - Validate file type (MIME type + extension)
// - Validate file size limit
// - Scan for malware (optional but recommended)
// - Store files outside web root
```

### 8. CORS Configuration

```typescript
// Ensure proper CORS in next.config.js or middleware
// Only allow trusted origins
```

### 9. Content Security Policy

```typescript
// Already configured in next.config.js for images
// Consider adding CSP headers for broader protection
```

### 10. Dependencies Audit

```bash
# Run regularly
npm audit
npm audit fix

# Check for outdated packages
npm outdated
```

### 11. HTTPS Only

```typescript
// In production:
// - Force HTTPS redirect
// - Set secure cookies
// - Use HSTS headers
```

### 12. Admin Panel Security

```typescript
// Ensure admin routes check for admin roles
// In middleware.ts or route handlers:
if (!user.isAdmin) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
```

## 🚨 Immediate Actions Required

1. **Change all secrets** before deploying to production
2. **Add .env.local to .gitignore** if not already
3. **Run npm audit** and fix vulnerabilities
4. **Enable HTTPS** in production
5. **Set up monitoring** for suspicious activity
6. **Implement rate limiting** on authentication endpoints
7. **Add input validation** to all API endpoints
8. **Review admin access** controls

## 📋 Security Checklist

- [ ] All secrets generated and rotated
- [ ] .env files excluded from git
- [ ] HTTPS enforced in production
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Admin routes protected
- [ ] CORS properly configured
- [ ] Dependencies audited
- [ ] Database backups enabled
- [ ] Error messages don't leak sensitive info
- [ ] File uploads validated and sanitized
- [ ] JWT tokens have short expiry
- [ ] Password hashing cost factor >= 10
- [ ] SQL injection prevention verified
- [ ] XSS protection headers set

---
*This is a security guide. Review regularly and update as needed.*
