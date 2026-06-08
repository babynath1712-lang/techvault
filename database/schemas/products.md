# Products Collection Schema

## Collection: `products`

Stores all tech products listed by sellers on TechVault.

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB primary key |
| `seller_id` | ObjectId | ✅ | Reference to `users._id` |
| `title` | String | ✅ | Product title (3–200 chars) |
| `description` | String | ✅ | Full description (max 5000 chars) |
| `price` | Number | ✅ | Price in INR (≥ 0) |
| `stock` | Number | ✅ | Available units (≥ 0, default: 0) |
| `category` | Enum | ✅ | One of: Laptops, Smartphones, Tablets, Accessories, Audio, Gaming, Cameras, Wearables, Components, Other |
| `images` | [String] | ❌ | Array of image URLs (max 10) |
| `status` | Enum | ❌ | `active` / `inactive` / `out_of_stock` / `pending_approval` |
| `rating.average` | Number | ❌ | Average rating (0–5) |
| `rating.count` | Number | ❌ | Number of ratings |
| `specifications` | Map | ❌ | Key-value product specs |
| `created_at` | Date | Auto | Timestamp |
| `updated_at` | Date | Auto | Timestamp |

## Indexes
- Full-text index on `title` + `description` (for search)
- `category` — index
- `price` — index (for range queries)
- `status` — index
- `seller_id + status` — compound index

## Relationships
- Many-to-One with **Users** (seller_id → users._id)
- Referenced in **Order.items** (product_id)
