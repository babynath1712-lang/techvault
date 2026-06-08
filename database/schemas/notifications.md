# Notifications Collection Schema

## Collection: `notifications`

Stores in-app notifications for users (order updates, payment alerts, system messages).

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB primary key |
| `user_id` | ObjectId | ✅ | Reference to `users._id` |
| `type` | Enum | ✅ | Notification type (see below) |
| `title` | String | ✅ | Short title (max 200 chars) |
| `message` | String | ✅ | Full message (max 1000 chars) |
| `is_read` | Boolean | ❌ | Read status (default: false) |
| `reference_id` | ObjectId | ❌ | ID of related entity (e.g., order_id) |
| `reference_type` | Enum | ❌ | Type of related entity: `Order` / `Product` / `Payment` / `User` |
| `created_at` | Date | Auto | Timestamp |

## Notification Types
| Type | Triggered By |
|---|---|
| `order_placed` | Order creation |
| `order_confirmed` | Admin/seller confirms order |
| `order_shipped` | Order marked shipped |
| `order_delivered` | Order marked delivered |
| `order_cancelled` | Order cancellation |
| `payment_success` | Razorpay payment verified |
| `payment_failed` | Payment failure |
| `product_approved` | Admin approves product |
| `product_rejected` | Admin rejects product |
| `system` | System-generated messages |

## Indexes
- `user_id + is_read` — compound index (for unread count)
- `user_id + created_at` — compound descending index
