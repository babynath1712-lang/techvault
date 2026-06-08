# Users Collection Schema

## Collection: `users`

Stores all registered users — buyers, sellers, and admins.

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB primary key |
| `name` | String | ✅ | Full name (2–100 chars) |
| `email` | String | ✅ | Unique email address |
| `password_hash` | String | ✅ | bcrypt hashed password (never returned in queries) |
| `role` | Enum | ✅ | `admin` / `buyer` / `seller` |
| `phone` | String | ❌ | Phone number with validation |
| `address.street` | String | ❌ | Street address |
| `address.city` | String | ❌ | City |
| `address.state` | String | ❌ | State |
| `address.pincode` | String | ❌ | PIN/ZIP code |
| `address.country` | String | ❌ | Country (default: India) |
| `isVerified` | Boolean | ❌ | Email verified via OTP (default: false) |
| `isActive` | Boolean | ❌ | Account active status (default: true) |
| `profileImage` | String | ❌ | URL to profile image |
| `created_at` | Date | Auto | Timestamp |
| `updated_at` | Date | Auto | Timestamp |

## Indexes
- `email` — unique index
- `role` — index for role-based queries

## Relationships
- One-to-Many with **Products** (seller_id)
- One-to-Many with **Orders** (buyer_id)
- One-to-Many with **Notifications** (user_id)
- One-to-Many with **OTPs** (user_id)
- One-to-Many with **Payments** (user_id)

## Security
- `password_hash` is excluded from all queries by default (`select: false`)
- Passwords are hashed with bcrypt (salt rounds: 12)
- `toJSON()` method strips password from serialized output
