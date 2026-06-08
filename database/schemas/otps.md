# OTPs Collection Schema

## Collection: `otps`

Stores one-time passwords for email verification, password resets, and login.

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB primary key |
| `user_id` | ObjectId | ✅ | Reference to `users._id` |
| `otp_code` | String | ✅ | 6-digit numeric OTP |
| `purpose` | Enum | ✅ | `email_verification` / `password_reset` / `login` / `phone_verification` |
| `expires_at` | Date | ✅ | Expiry timestamp (default: 10 min from creation) |
| `is_used` | Boolean | ❌ | Whether OTP was already consumed (default: false) |
| `attempts` | Number | ❌ | Failed verification attempts (max: 5) |
| `created_at` | Date | Auto | Timestamp |

## Indexes
- **TTL Index**: `expires_at` with `expireAfterSeconds: 0` — MongoDB auto-deletes expired OTPs
- **Compound Index**: `user_id + purpose + is_used` — fast lookup for verification

## OTP Lifecycle
1. User requests OTP → previous unused OTPs for same purpose are deleted
2. New 6-digit OTP generated and stored
3. OTP sent via email using Nodemailer
4. User submits OTP → verified against DB
5. On success: `is_used = true`
6. After 10 minutes: MongoDB TTL index auto-deletes the document

## Security
- Max 5 verification attempts per OTP
- Previous OTPs invalidated on new request
- Auto-deleted after expiry via TTL index
