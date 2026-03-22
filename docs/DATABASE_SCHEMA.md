# Database Schema

The system uses a PostgreSQL database. Below is the entity relationship overview.

## 1. User Entity (`users`)
- **id**: Primary Key (BigInt)
- **email**: Unique String (used for login)
- **passwordHash**: BCrypt hashed password
- **firstName / lastName**: User's name
- **role**: Enum (`ADMIN`, `CUSTOMER`)
- **tableau_user_id**: String (maps user to Tableau identity)

## 2. Product Entity (`products`)
- **id**: Primary Key (BigInt)
- **name**: Product name
- **description**: Detailed description
- **price**: Numeric (BigDecimal)
- **imageUrl**: URL to product image
- **category**: Product category (e.g., T-Shirts, Hoodies)

## 3. Custom Design Entity (`custom_designs`)
- **id**: Primary Key (BigInt)
- **user_id**: Foreign Key (User)
- **designFileUrl**: URL to uploaded design file
- **specifications**: Text (user's design notes)
- **status**: Enum (`PENDING_REVIEW`, `APPROVED`, `REJECTED`, `IN_PRODUCTION`, `COMPLETED`)
- **created_at**: LocalDateTime

## 4. Order Entity (`orders`)
- **id**: Primary Key (BigInt)
- **user_id**: Foreign Key (User)
- **total_amount**: Numeric (BigDecimal)
- **status**: Enum (`PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
- **shipping_address**: Text
- **created_at**: LocalDateTime

## 5. Order Item Entity (`order_items`)
- **id**: Primary Key (BigInt)
- **order_id**: Foreign Key (Order)
- **product_id**: Foreign Key (Product)
- **quantity**: Integer
- **unit_price**: Numeric (BigDecimal)
- **custom_design_id**: Foreign Key (CustomDesign, optional)
