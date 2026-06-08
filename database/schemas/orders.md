# Orders Collection Schema

## Collection: `orders`

Stores customer orders. ORDER_ITEMS from the ERD are embedded as a subdocument array.

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB primary key |
| `buyer_id` | ObjectId | ✅ | Reference to `users._id` |
| `items` | [Object] | ✅ | Embedded order items (see below) |
| `total_amount` | Number | ✅ | Total price in INR |
| `status` | Enum | ❌ | `pending` / `confirmed` / `shipped` / `delivered` / `cancelled` |
| `shipping_address` | Object | ❌ | Delivery address snapshot |
| `payment_id` | ObjectId | ❌ | Reference to `payments._id` |
| `notes` | String | ❌ | Optional order notes (max 500 chars) |
| `created_at` | Date | Auto | Timestamp |
| `updated_at` | Date | Auto | Timestamp |

## Embedded: `items[]` (ORDER_ITEMS)

| Field | Type | Required | Description |
|---|---|---|---|
| `product_id` | ObjectId | ✅ | Reference to `products._id` |
| `title` | String | ✅ | Product title snapshot at time of order |
| `image` | String | ❌ | Product image URL snapshot |
| `quantity` | Number | ✅ | Quantity ordered (≥ 1) |
| `unit_price` | Number | ✅ | Price per unit at time of order |

> **Design Note**: ORDER_ITEMS are embedded (not a separate collection) because they are always accessed with their parent order and the data should be immutable snapshots.

## Indexes
- `buyer_id + status` — compound index
- `status` — index
- `created_at` — descending index (recent orders first)

## Relationships
- Many-to-One with **Users** (buyer_id)
- One-to-One with **Payment** (payment_id)
