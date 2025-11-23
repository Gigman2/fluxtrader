# Authentication Guide

This guide explains how authentication works in SignalFlux and how to use it in your endpoints.

## Overview

SignalFlux uses JWT (JSON Web Tokens) for authentication. When a user logs in or signs up, they receive a JWT token that must be included in subsequent API requests.

## How It Works

### 1. Token Generation

- Tokens are generated when users login (`/api/v1/login`) or signup (`/api/v1/accounts`)
- Tokens contain: `account_id`, `username`, `iat` (issued at), `exp` (expiration)
- Tokens expire after 24 hours (configurable via `JWT_EXPIRATION_HOURS`)

### 2. Token Storage (Frontend)

- Tokens are stored in the auth store (`@/store/auth`)
- The token is automatically included in API requests via the `Authorization` header
- Format: `Authorization: Bearer <token>`

### 3. Token Validation (Backend)

- The `@auth_required` decorator validates tokens
- Extracts token from `Authorization` header
- Verifies token signature and expiration
- Stores `account_id` in Flask's `g` object for use in route handlers

## Using Authentication in Your Endpoints

### Step 1: Import the decorator

```python
from utils.auth_utils import auth_required, get_current_account_id
from utils.database_utils import db_session_required
```

### Step 2: Protect your route

```python
@api_bp.route('/your-endpoint', methods=['GET'])
@auth_required  # Must be before @db_session_required
@db_session_required
def your_protected_route():
    # Get the authenticated account ID
    account_id = get_current_account_id()

    # Use account_id in your logic
    db = get_db()
    # ... your code ...

    return jsonify({'success': True, 'data': result}), 200
```

### Step 3: Access authenticated account

```python
# Get account_id from Flask's g object
account_id = get_current_account_id()

# Or access directly from g
account_id = g.account_id

# Access full token payload if needed
token_payload = g.token_payload  # Contains account_id, username, etc.
```

## Example: Risk Management Endpoint

See `api/routes/risk.py` for a complete example:

```python
@api_bp.route('/risk/settings', methods=['GET'])
@auth_required
@db_session_required
def get_risk_settings():
    account_id = get_current_account_id()
    db = get_db()
    # ... fetch risk settings for this account ...
```

## Frontend Usage

### Automatic Token Inclusion

The frontend automatically includes the token when `authenticate=true` (default):

```typescript
// Token is automatically included
const { data } = useGet("risk/settings");

// Explicitly set authenticate (default is true)
const { data } = useGet("risk/settings", {
  authenticate: true,
});

// For unauthenticated endpoints
const { data } = useGet("public-endpoint", {
  authenticate: false,
});
```

### Manual Token Access

If you need to access the token manually:

```typescript
import { authStore } from "@/store/auth";

const token = authStore.getState().authToken;
```

## Error Handling

### 401 Unauthorized

- Token missing: `"Authentication required. Please provide a valid token."`
- Token invalid/expired: `"Invalid or expired token. Please login again."`

### Frontend Handling

```typescript
const { mutate } = useMutationHandler("risk/settings", {
  onError: (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      navigate("/login");
    }
  },
});
```

## Security Best Practices

1. **Always use HTTPS in production** - Tokens are sent in headers, but HTTPS ensures encryption
2. **Set strong JWT_SECRET_KEY** - Use a secure random string in production
3. **Token expiration** - Tokens expire after 24 hours (configurable)
4. **Never expose tokens** - Don't log tokens or include them in error messages
5. **Validate on every request** - The `@auth_required` decorator validates tokens on every request

## Testing Protected Endpoints

### Using curl

```bash
# Get token from login
TOKEN=$(curl -X POST http://localhost:5000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}' \
  | jq -r '.data.token')

# Use token in protected endpoint
curl -X GET http://localhost:5000/api/v1/risk/settings \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Set `Authorization` header: `Bearer <your-token>`
2. Or use Postman's Bearer Token auth type

## Available Endpoints

### Risk Management (Protected)

- `GET /api/v1/risk/settings` - Get risk settings for authenticated account
- `PUT /api/v1/risk/settings` - Update risk settings
- `POST /api/v1/risk/calculate-position` - Calculate position size

### Account Management

- `POST /api/v1/login` - Login (returns token)
- `POST /api/v1/accounts` - Signup (returns token)
- `GET /api/v1/accounts` - List accounts (unprotected)
- `GET /api/v1/accounts/<id>` - Get account (unprotected)

## Troubleshooting

### "Authentication required" error

- Check that token is being sent in `Authorization` header
- Verify token format: `Bearer <token>` (note the space)
- Ensure `authenticate: true` is set in frontend API calls

### "Invalid or expired token" error

- Token may have expired (default 24 hours)
- User needs to login again to get a new token
- Check `JWT_SECRET_KEY` matches between token generation and validation

### Token not being sent

- Check auth store has token: `authStore.getState().authToken`
- Verify `generateHeaders()` is including token when `authenticate=true`
- Check browser network tab to see if `Authorization` header is present
