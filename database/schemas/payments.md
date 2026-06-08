# Payments Collection Schema

## Collection: `payments`

Stores payment transactions, primarily via Razorpay.

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB primary key |
| `order_id` | ObjectId | ✅ | Reference to `orders._id` |
| `user_id` | ObjectId | ✅ | Reference to `users._id` |
| `amount` | Number | ✅ | Amount in INR |
| `currency` | String | ❌ | Currency code (default: INR) |
| `method` | Enum | ✅ | `razorpay` / `upi` / `card` / `netbanking` / `wallet` / `cod` |
| `status` | Enum | ❌ | `pending` / `completed` / `failed` / `refunded` |
| `transaction_id` | String | ❌ | Unique transaction ID (sparse unique index) |
| `razorpay_order_id` | String | ❌ | Razorpay order ID |
| `razorpay_payment_id` | String | ❌ | Razorpay payment ID |
| `razorpay_signature` | String | ❌ | HMAC-SHA256 signature for verification |
| `paid_at` | Date | ❌ | Timestamp when payment succeeded |
| `failure_reason` | String | ❌ | Reason if payment failed |
| `created_at` | Date | Auto | Timestamp |
| `updated_at` | Date | Auto | Timestamp |

## Indexes
- `order_id` — index
- `user_id` — index
- `status` — index
- `transaction_id` — sparse unique index

## Razorpay Flow
1. `POST /api/payments/create-order` → creates Razorpay order + pending Payment doc
2. Frontend completes payment via Razorpay SDK
3. `POST /api/payments/verify` → verifies HMAC signature → marks payment completed
