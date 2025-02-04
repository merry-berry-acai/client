# Merry Berry Smoothie & Açaí Shop - Client

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-18.2-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

The frontend client for Merry Berry's online ordering system. Built with React to deliver a seamless user experience for health-conscious customers.

## Features

- 🍓 Browse mouth-watering menu items with high-quality images
- 🥤 Customize orders with sizes, toppings, and add-ins
- 🔒 Secure payment processing
- 📱 Responsive design for all screen sizes
- 📊 Real-time order tracking
- 🛒 Persistent shopping cart

## Installation

1. Clone the repository:
```bash
git clone https://github.com/merry-berry/client.git
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:

```bash
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_KEY=your_stripe_key
```

1. Start development server:
```bash
npm start
```

## Technologies

- React
- React Router
- Axios
- Tailwind CSS
- BoxIcons
- Formik & Yup for forms
- Stripe Integration

## Screenshots

[Screenshots Go Here]

## Contributing

1. Create a feature branch:

```bash
git checkout -b feat/your-feature
```

2. Follow our coding standards:
   - Use functional components with hooks
   - Prefer Tailwind utility classes
   - Maintain 80%+ test coverage

3. Submit a pull request

## Testing

Run test suite:
```bash
npm test
```

## Deployment

Deployed using Cloudflare:  
[Live Demo](https://merry-berry.pages.dev)

---

[Server Repository](https://github.com/merry-berry/server) | [Project Documentation](/docs)



Based on the sources and our conversation history, here's how you can use MongoDB to structure your data for the Smoothie & Açaí Shop application:

**Key Concepts**

*   **Documents:** In MongoDB, data is stored in **documents**, which are similar to JSON objects.
*   **Collections:** Documents are grouped into **collections**, which are analogous to tables in relational databases.
*   **NoSQL:** MongoDB is a NoSQL database, meaning it does not use a traditional relational schema. This allows for flexibility in data structures.

**MongoDB Collections**

Here are the MongoDB collections you'll need, based on the models we discussed, along with examples of the documents they would store:

*   **Users Collection**
    *   Purpose: Stores information about app users.
    *   Fields:
        *   `_id` (ObjectId): Unique identifier for the user.
        *   `name` (String): User's full name.
        *   `email` (String): User's email address.
        *   `password` (String): Hashed password.
        *  `orderHistory` (Array of ObjectIds): Array referencing order documents in the Orders Collection.
        *   `deliveryAddress` (Object): User's delivery address details, including street, city, state and postal code.
        *   `paymentInfo` (Object):  Securely stored payment information.
        *   `userRole` (String): Role of the user, such as "customer" or "shop owner."
        *   `loyaltyInfo` (Object): Loyalty program details.
        *   `pushNotificationPreferences` (Object): Push notification preferences.
    *   Example Document:

    ```json
    {
      "_id": ObjectId("656c7404489b102d318d4e25"),
      "name": "Alice Smith",
      "email": "alice@example.com",
      "password": "hashed_password_here",
       "orderHistory": [ObjectId("656c7404489b102d318d4e26"), ObjectId("656c7404489b102d318d4e27")],
      "deliveryAddress": {
          "street": "123 Main St",
          "city": "Anytown",
          "state": "CA",
          "postalCode": "12345"
      },
      "paymentInfo": {
      "cardType": "Visa",
      "cardNumber": "xxxxxxxxxxxxx1234",
          "expiryDate": "12/25",
      },
      "userRole": "customer",
      "loyaltyInfo": {
            "points": 150
       },
      "pushNotificationPreferences": {
        "orderUpdates": true,
        "promotions": false
        }
    }
    ```
*  **Items Collection**
    * Purpose: Stores information about menu items.
    * Fields:
        *   `_id` (ObjectId): Unique identifier for the item.
        *   `name` (String): Item name.
        *   `description` (String): Detailed description.
        *   `imageURL` (String): URL of the item's image.
        *   `basePrice` (Number): Base price of the item.
        *   `category` (ObjectId): Reference to Category document in the Categories collection.
        *   `availability` (Boolean): Indicates if the item is currently available.
    * Example Document:

     ```json
        {
            "_id": ObjectId("656c7404489b102d318d4e2a"),
            "name": "Açaí Bowl",
            "description": "A refreshing açaí bowl with granola, berries, and honey.",
             "imageURL": "/images/acai-bowl.jpg",
             "basePrice": 9.99,
            "category": ObjectId("656c7404489b102d318d4e2b"),
            "availability": true
         }
     ```
*   **Toppings Collection**
    *   Purpose: Stores information about available toppings.
    *  Fields:
        *   `_id` (ObjectId): Unique identifier for the topping.
        *   `name` (String): Topping name.
        *   `price` (Number): Price of the topping (if applicable).
        *   `availability` (Boolean): Indicates if the topping is currently available.
        *   `category` (ObjectId): Reference to Category document in the Categories collection (if applicable).
    *   Example Document:
     ```json
       {
           "_id": ObjectId("656c7404489b102d318d4e2c"),
            "name": "Granola",
            "price": 0.5,
            "availability": true,
             "category": ObjectId("656c7404489b102d318d4e2b")
         }
    ```
*  **Orders Collection**
    *   Purpose: Stores all details related to customer orders.
    *   Fields:
        *   `_id` (ObjectId): Unique identifier for the order.
        *   `userId` (ObjectId): Reference to the user who placed the order in the Users collection.
        *   `orderDate` (Date): Date and time the order was placed.
        *   `orderStatus` (ObjectId): Reference to an order status in the Order Status collection.
        *    `items` (Array of Objects): An array of objects representing the items in the order and their quantities, each containing:
            *   `itemId` (ObjectId): Reference to the item in the Items collection.
            *  `quantity` (Number): Quantity of the item ordered.
        *   `toppings` (Array of ObjectIds): Array of ObjectIds referencing toppings in the Toppings collection.
        *    `totalAmount` (Number): Total amount of the order.
        *   `paymentMethod` (String): The payment method used.
         *  `deliveryInfo` (Object): Delivery information such as address, and time.
        *   `specialInstructions` (String): Any special instructions from the customer.
    *   Example Document:
      ```json
      {
        "_id": ObjectId("656c7404489b102d318d4e26"),
        "userId": ObjectId("656c7404489b102d318d4e25"),
        "orderDate": ISODate("2024-12-07T10:00:00Z"),
        "orderStatus": ObjectId("656c7404489b102d318d4e2d"),
        "items": [
            {
                "itemId": ObjectId("656c7404489b102d318d4e2a"),
                "quantity": 2
            },
           {
                "itemId": ObjectId("656c7404489b102d318d4e2e"),
                 "quantity": 1
           }
         ],
         "toppings": [ObjectId("656c7404489b102d318d4e2c"), ObjectId("656c7404489b102d318d4e2f")],
         "totalAmount": 25.50,
         "paymentMethod": "Visa",
         "deliveryInfo": {
             "address": "123 Main St",
             "time": "12:30pm"
          },
         "specialInstructions": "Extra honey on açaí bowl"
       }
      ```
*   **PromoCodes Collection**
    *   Purpose: Stores information about promotional codes.
    *  Fields:
        *   `_id` (ObjectId): Unique identifier for the promo code.
        *   `code` (String): Promo code (e.g., "SUMMER20").
        *   `discount` (Number or String): Discount amount or percentage.
        *   `startDate` (Date): Start date of the promo code.
        *  `endDate` (Date): End date of the promo code.
        *  `minOrderAmount` (Number): Minimum order amount.
        *   `applicableProducts` (Array of ObjectIds): Array of ObjectIds referencing applicable items in the items collection
    *   Example Document:
    ```json
        {
            "_id": ObjectId("656c7404489b102d318d4e30"),
           "code": "SUMMER20",
           "discount": 0.20,
          "startDate": ISODate("2024-06-01T00:00:00Z"),
           "endDate": ISODate("2024-08-31T23:59:59Z"),
            "minOrderAmount": 20,
            "applicableProducts": [ObjectId("656c7404489b102d318d4e2a"), ObjectId("656c7404489b102d318d4e2e")]
        }
    ```
*   **Categories Collection**
    *   Purpose: Stores information about the various categories of menu items.
    *   Fields:
        *   `_id` (ObjectId): Unique identifier for the category.
        *   `name` (String): Category name (e.g., "Smoothies," "Açaí Bowls").
    *   Example Document:
    ```json
    {
        "_id": ObjectId("656c7404489b102d318d4e2b"),
        "name": "Açaí Bowls"
    }
    ```
*  **PaymentMethods Collection**
     * Purpose: Stores information about payment methods.
     * Fields:
          * `_id` (ObjectId): Unique identifier for the payment method.
          * `name` (String): Name of the payment method (e.g. Visa, Mastercard).
    * Example Document:
      ```json
          {
           "_id": ObjectId("656c7404489b102d318d4e31"),
              "name": "Visa"
          }
      ```

*   **Settings Collection**
     * Purpose: Stores application wide settings.
    *   Fields:
         * `_id` (ObjectId): Unique identifier for the setting.
         * `key` (String): Key of the setting.
         * `value` (String): Value of the setting.
    * Example Document:
     ```json
          {
                "_id": ObjectId("656c7404489b102d318d4e32"),
                "key": "taxRate",
               "value": "0.08"
           }
    ```

*   **Reviews Collection**
    *   Purpose: Stores user reviews for the shop or individual menu items.
    *   Fields:
        *   `_id` (ObjectId): Unique identifier for the review.
        *   `userId` (ObjectId): Reference to the user who posted the review from the Users collection.
        *   `itemId` (ObjectId): Reference to the item being reviewed in the Items collection.
        *    `rating` (Number): Rating given by the user (e.g. 1-5 stars).
        *    `comment` (String): Review text.
         * `date` (Date): Date and Time that the review was posted.
    * Example Document:
         ```json
           {
              "_id": ObjectId("656c7404489b102d318d4e33"),
              "userId": ObjectId("656c7404489b102d318d4e25"),
             "itemId": ObjectId("656c7404489b102d318d4e2a"),
             "rating": 5,
             "comment": "This açaí bowl was amazing!",
              "date": ISODate("2024-12-07T11:00:00Z")
          }
        ```

* **OrderStatus Collection**
     * Purpose: Stores information about the various statuses an order could have
     * Fields:
          * `_id` (ObjectId): Unique identifier for the order status.
          *  `name` (String): Name of the status (e.g. Pending, Processing, etc)
     * Example Document:
          ```json
               {
                  "_id": ObjectId("656c7404489b102d318d4e2d"),
                  "name": "Pending"
               }
          ```
**Key Points**

*   **ObjectIds:** MongoDB uses `ObjectId` for unique identifiers, which are automatically generated.
*   **Relationships:** Relationships between collections are established using references via `ObjectId` fields. For instance, an `Order` document references a `User` document using the `userId` field.
*   **Flexibility:** MongoDB's schema-less nature allows you to add or modify fields in documents without having to modify the schema.
*   **Data Types:** Pay attention to the different data types, such as String, Number, Date, Boolean, and Object.
*   **Arrays and Objects:** MongoDB supports nested arrays and objects, which is useful for complex data structures like `deliveryAddress` in the `Users` collection and the `items` array in the `Orders` collection.
* **Indexing:** Create indexes on frequently queried fields like `userId` in the `Orders` collection to improve performance.

By structuring your data in this way, you can efficiently manage the information for your Smoothie & Açaí Shop application using MongoDB.
