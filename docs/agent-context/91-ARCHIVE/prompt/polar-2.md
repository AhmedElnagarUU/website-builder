# IMPORTANT: CORRECT YOUR UNDERSTANDING OF THE POLAR INTEGRATION

You are currently misunderstanding Polar's Product ID / Price ID model.

Before making any implementation changes, read the current official Polar documentation and correct your implementation plan according to the current API.

Primary official documentation:

https://polar.sh/docs/integrate/sdk/typescript

Also read the current official documentation for:

* Checkout
* Create Checkout Session
* Confirm Checkout Session
* Products
* Prices
* Subscriptions
* Webhooks
* Authentication
* Next.js integration
* Better Auth integration

Do NOT rely on old Stripe-like assumptions.

---

# 1. THE MOST IMPORTANT CORRECTION

Polar is NOT Stripe.

Do not assume:

Product
→ Price ID
→ Checkout

in the same way Stripe commonly exposes Price IDs.

For the current Polar Checkout API, the checkout creation request accepts:

```ts
products: [PRODUCT_ID]
```

The `products` field is a required array of Polar Product IDs.

Example:

```ts
const checkout = await polar.checkouts.create({
  products: [process.env.POLAR_PRODUCT_ID!],
});
```

The current official API documentation confirms that:

* `products` is required.
* `products` contains Product IDs.
* The first product is selected by default.
* The Product contains its pricing/catalog information.
* `product_price_id` exists in the API model/response but is currently marked as DEPRECATED.
* `prices` exists for more advanced/ad-hoc pricing scenarios.

Therefore:

DO NOT require `POLAR_PRICE_ID` merely because a Product has a price.

For the normal catalog-based checkout flow, the application should use:

```env
POLAR_PRODUCT_ID=...
```

not:

```env
POLAR_PRICE_ID=...
```

unless the actual implementation has a specific documented reason to operate at the price level.

Official reference:

https://polar.sh/docs/api-reference/checkouts/create-session

---

# 2. UNDERSTAND THE POLAR DATA MODEL

The correct mental model is:

```text
Polar Organization
       │
       ├── Product
       │      │
       │      ├── Product ID
       │      │
       │      └── Catalog Price
       │
       ├── Customers
       │
       ├── Checkout Sessions
       │
       └── Subscriptions
```

For our SaaS product, imagine:

```text
Product:
    Website Builder

Product ID:
    <UUID>

Catalog pricing:
    $5 / month
```

The application does not need to manually construct:

```text
Product ID + Price ID
```

for a standard checkout.

Instead:

```text
Application
    │
    │ products: [PRODUCT_ID]
    ▼
Polar Checkout
    │
    ▼
Polar determines the applicable catalog pricing
    │
    ▼
Customer completes checkout
```

The Product is the catalog object we sell.

The Product's pricing configuration belongs to the Polar catalog.

---

# 3. WHY DOES PRICE ID EXIST THEN?

Do not incorrectly conclude:

"Polar has no Price ID."

That statement is also wrong.

Price objects DO exist in Polar.

The API can return Product objects containing:

```json
{
  "id": "PRODUCT_ID",
  "prices": [
    {
      "id": "PRICE_ID",
      "product_id": "PRODUCT_ID",
      "price_amount": 500,
      "price_currency": "usd"
    }
  ]
}
```

So:

```text
Price ID EXISTS
```

but:

```text
Price ID IS NOT REQUIRED FOR OUR STANDARD CHECKOUT CONFIGURATION
```

These are two different statements.

Do not confuse them.

The current Checkout API response can contain:

```text
product_id
product_price_id
product
product_price
prices
```

but the current checkout creation request is centered around:

```text
products: ProductID[]
```

and `product_price_id` is marked deprecated in the current API model.

Therefore, do not ask the developer for a Price ID just because you see a price in the Polar Dashboard.

---

# 4. STANDARD CHECKOUT VS ADVANCED PRICING

There are two concepts that you must distinguish.

## A. Standard catalog checkout

This is what our application should use unless repository analysis proves otherwise.

We create/configure the Product and its catalog pricing in Polar.

Then:

```ts
const checkout = await polar.checkouts.create({
  products: [PRODUCT_ID],
});
```

The application references the Product.

Example:

```env
POLAR_PRODUCT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

This is the normal approach for our fixed SaaS plan.

---

## B. Ad-hoc / custom pricing

Polar also supports more advanced pricing through the checkout API.

The API has a `prices` object that can define ad-hoc pricing for products.

This is different from saying:

"Every normal checkout needs a Price ID."

It does not.

Only use this advanced mechanism if the business requirement actually needs dynamic/custom pricing.

Our current business model is a fixed SaaS subscription.

Therefore, do NOT introduce dynamic pricing or Price-ID-based configuration unnecessarily.

---

# 5. OUR PRODUCT

Our current product is a SaaS website builder.

The intended commercial model is approximately:

```text
Website Builder
    ↓
Fixed subscription
    ↓
$5/month
```

Therefore the expected architecture is:

```text
Polar Dashboard
        │
        ▼
Create Product
"Website Builder"
        │
        ▼
Configure catalog pricing
"$5 / month"
        │
        ▼
Copy Product ID
        │
        ▼
Application ENV
POLAR_PRODUCT_ID
```

Then our backend creates checkout:

```ts
const checkout = await polar.checkouts.create({
  products: [process.env.POLAR_PRODUCT_ID!],
});
```

Do NOT create:

```env
POLAR_PRICE_ID=
```

unless you can point to a specific current Polar API operation in our implementation that actually requires it.

---

# 6. POLAR AUTHENTICATION

Our server needs to authenticate against Polar.

Use the current Polar authentication mechanism.

The TypeScript SDK uses an Organization Access Token.

Example:

```ts
const polar = createPolar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
});
```

Therefore the relevant server-side configuration is:

```env
POLAR_ACCESS_TOKEN=...
```

Do not invent Stripe-style configuration such as:

```env
POLAR_PUBLIC_KEY=
POLAR_SECRET_KEY=
POLAR_INTEGRATION_ID=
```

unless the current official Polar documentation explicitly requires it.

---

# 7. SANDBOX

We need to distinguish Sandbox from Production.

For development/testing, use the Polar Sandbox environment according to the current SDK documentation.

Do not invent a `POLAR_BASE_URL` variable just because another payment provider uses one.

The SDK handles the Polar API endpoint.

Do not introduce:

```env
POLAR_BASE_URL=
POLAR_API_URL=
```

unless the official SDK/API documentation explicitly requires such configuration.

Likewise, do not introduce:

```env
POLAR_ENVIRONMENT=
```

just because it seems convenient.

If the SDK accepts:

```ts
environment: "sandbox"
```

use the SDK's documented mechanism.

Do not invent configuration.

---

# 8. WEBHOOKS

Webhooks are a separate concern from checkout creation.

The architecture is:

```text
Our Server
    │
    │ Create Checkout
    │
    │ POLAR_ACCESS_TOKEN
    ▼
Polar
    │
    │ Customer completes checkout
    │
    │ Subscription/order/payment state changes
    ▼
Polar Webhook
    │
    ▼
Our Backend
    │
    ▼
Database
    │
    ▼
Application Access
```

The frontend redirect must NOT be treated as authoritative payment confirmation.

The webhook/provider state must drive our application billing state.

The implementation must verify webhook authenticity using the documented Polar webhook mechanism.

The implementation must also be idempotent.

---

# 9. IMPORTANT: CHECKOUT SUCCESS DOES NOT EQUAL BUSINESS AUTHORIZATION

The current Polar Checkout API documentation distinguishes checkout states.

For example, the API has states such as:

```text
open
expired
confirmed
succeeded
failed
```

The documentation explicitly indicates that `confirmed` does not itself mean that payment succeeded.

Therefore do NOT implement:

```text
User returned to success URL
        ↓
Mark subscription active
```

Instead:

```text
User completes checkout
        ↓
Polar processes payment/subscription
        ↓
Polar emits authoritative event
        ↓
Our webhook verifies event
        ↓
Our database updates subscription state
        ↓
Application grants access
```

This distinction is critical.

---

# 10. NEXT.JS VS BETTER AUTH

You are also mixing two different concepts.

They are NOT competing payment integrations.

They solve different problems.

## Next.js

Next.js is our application framework.

It provides things such as:

```text
React UI
Server Components
Server Actions
Route Handlers
Middleware
Server-side execution
API endpoints
```

For example, we can have:

```text
app/api/billing/checkout/route.ts
```

which creates a Polar Checkout Session on the server.

Next.js is responsible for the application/runtime layer.

---

# 11. BETTER AUTH

Better Auth is our authentication system.

It is responsible for:

```text
User signup
User login
Sessions
Authentication
OAuth
User identity
```

It is NOT the payment provider.

Polar does not replace Better Auth.

Polar handles:

```text
Products
Checkout
Billing
Subscriptions
Orders
Payments
```

Better Auth handles:

```text
Who is the user?
Is the user authenticated?
What is the user's application account?
```

Therefore:

```text
                 Our Application

        ┌──────────────────────────┐
        │        Next.js           │
        │                          │
        │  UI / Server / Routes    │
        │                          │
        │   ┌──────────────────┐   │
        │   │   Better Auth    │   │
        │   │                  │   │
        │   │ User identity    │   │
        │   │ Sessions         │   │
        │   │ OAuth            │   │
        │   └──────────────────┘   │
        │                          │
        │   ┌──────────────────┐   │
        │   │      Polar       │   │
        │   │                  │   │
        │   │ Checkout         │   │
        │   │ Products         │   │
        │   │ Subscriptions    │   │
        │   │ Billing          │   │
        │   └──────────────────┘   │
        └──────────────────────────┘
```

---

# 12. HOW BETTER AUTH AND POLAR WORK TOGETHER

The flow should be:

```text
User
  │
  ▼
Next.js
  │
  ▼
Better Auth
  │
  ▼
Authenticated Application User
  │
  │ user.id
  ▼
Polar Checkout
```

The user's Better Auth identity should be associated with the Polar customer.

Polar's Checkout API supports:

```text
external_customer_id
```

which represents the customer ID in our own system.

This is extremely useful for our application.

Example:

```ts
const checkout = await polar.checkouts.create({
  products: [process.env.POLAR_PRODUCT_ID!],
  externalCustomerId: user.id,
});
```

Use the exact SDK field name according to the installed/current SDK version.

The conceptual mapping is:

```text
Better Auth user.id
        │
        ▼
Polar external_customer_id
        │
        ▼
Polar Customer
        │
        ▼
Polar Subscription
```

This allows us to connect:

```text
Application User
        ↕
Polar Customer
        ↕
Polar Subscription
```

without making Polar responsible for application authentication.

---

# 13. DO NOT CONFUSE BETTER AUTH WITH THE POLAR BETTER AUTH ADAPTER

If Polar provides a Better Auth integration/adapter, understand what it actually does before using it.

Do not automatically install a Polar Better Auth plugin just because we use Better Auth.

First determine whether the adapter solves a requirement we actually have.

Our basic architecture can already be:

```text
Better Auth
    ↓
Application User
    ↓
Polar Checkout
    ↓
Polar Customer
    ↓
Polar Subscription
```

The Polar integration must be selected based on the actual current official documentation and our repository architecture.

Do not add an adapter merely for the sake of using one.

---

# 14. WHICH ONE SHOULD CREATE THE CHECKOUT?

The checkout session must be created server-side.

Do NOT expose:

```text
POLAR_ACCESS_TOKEN
```

to the browser.

The expected architecture is:

```text
Browser
   │
   │ "Subscribe"
   ▼
Next.js Server Route / Server Action
   │
   │ Polar SDK
   │ POLAR_ACCESS_TOKEN
   ▼
Polar
   │
   ▼
Checkout URL
   │
   ▼
Browser
```

The browser then navigates to the Polar Checkout URL.

---

# 15. EXPECTED ENVIRONMENT CONFIGURATION

For the standard implementation, start with:

```env
POLAR_ACCESS_TOKEN=
POLAR_PRODUCT_ID=
```

Add webhook configuration only according to the actual documented webhook implementation.

Do NOT automatically add:

```env
POLAR_PRICE_ID=
POLAR_PUBLIC_KEY=
POLAR_SECRET_KEY=
POLAR_BASE_URL=
POLAR_API_URL=
POLAR_INTEGRATION_ID=
```

unless the current official Polar documentation and our actual implementation prove that a particular variable is required.

---

# 16. DO NOT ASK FOR PRICE ID AGAIN

This is the specific correction you must follow:

If your implementation requires:

```text
Product ID
Price ID
```

STOP.

Determine why the Price ID is required.

Ask:

1. Is this a current Polar Checkout API requirement?
2. Is it actually required by the installed SDK version?
3. Is the code using an old/deprecated API model?
4. Is the code confusing Polar with Stripe?
5. Is this an advanced ad-hoc pricing use case?
6. Is the field merely present in the API response but not required for checkout creation?

Do not ask the developer to find a Price ID from the dashboard if the current standard Checkout API does not require one.

---

# 17. IMPLEMENTATION TARGET

For our fixed SaaS subscription, the target should conceptually look like:

```text
User
 │
 │ authenticated by Better Auth
 ▼
Next.js
 │
 │ user.id
 │
 │ Polar SDK
 │ POLAR_ACCESS_TOKEN
 ▼
Polar Checkout
 │
 │ products: [POLAR_PRODUCT_ID]
 │
 ▼
Polar Hosted Checkout
 │
 ▼
Customer Payment
 │
 ▼
Polar Subscription / Order
 │
 ▼
Polar Webhook
 │
 ▼
Next.js Webhook Route
 │
 ▼
Verify Webhook
 │
 ▼
Update MongoDB
 │
 ▼
Subscription / Billing State
 │
 ▼
Site Access
```

---

# 18. REQUIRED IMPLEMENTATION BEHAVIOR

Before changing code:

1. Inspect the current repository.
2. Identify the existing Paymob checkout flow.
3. Identify the existing authentication flow.
4. Confirm that Better Auth is currently responsible for application identity.
5. Identify the current user ID.
6. Identify the current subscription/billing model.
7. Identify the current trial implementation.
8. Identify the existing webhook architecture.
9. Read the current Polar documentation.
10. Map the existing application architecture to Polar.

Then implement the smallest correct integration.

---

# 19. DO NOT REWRITE AUTHENTICATION

The payment migration must NOT replace Better Auth.

Keep:

```text
Better Auth → authentication
```

Add:

```text
Polar → billing/payment/subscriptions
```

Next.js remains the application framework connecting the two.

---

# 20. FINAL ARCHITECTURE

The desired separation is:

```text
                 ┌──────────────────────┐
                 │       Next.js        │
                 │                      │
                 │ UI                   │
                 │ Server Routes        │
                 │ Server Components    │
                 │ Server Actions       │
                 └──────────┬───────────┘
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
       ┌───────────────┐        ┌────────────────┐
       │  Better Auth  │        │     Polar      │
       │               │        │                │
       │ Authentication│        │ Checkout       │
       │ Sessions      │        │ Products       │
       │ OAuth         │        │ Subscriptions  │
       │ User identity │        │ Orders         │
       └───────┬───────┘        └───────┬────────┘
               │                        │
               │ user.id                │ webhooks
               │                        │
               └──────────┬─────────────┘
                          ▼
                    ┌─────────────┐
                    │  MongoDB    │
                    │             │
                    │ User        │
                    │ Billing     │
                    │ Subscription│
                    │ Site Access │
                    └─────────────┘
```

---

# 21. FINAL REQUIREMENT

Before implementing anything, provide a short written explanation confirming that you understand these points:

1. Product ID is the primary identifier used by our standard Polar Checkout configuration.
2. Price ID exists in Polar's data model but is not something we should require for our standard checkout.
3. `product_price_id` is currently marked deprecated in the current Checkout API model.
4. The Product's catalog pricing is configured in Polar.
5. `POLAR_PRODUCT_ID` is therefore the important product configuration for our fixed SaaS plan.
6. `POLAR_ACCESS_TOKEN` authenticates our server with Polar.
7. Better Auth remains responsible for application authentication.
8. Next.js is the application framework/server layer.
9. Polar is the billing/payment/subscription layer.
10. Better Auth user identity should be mapped to Polar using the documented customer/external-customer mechanism where appropriate.
11. The checkout must be created server-side.
12. Webhooks, not frontend redirects alone, must drive authoritative billing state.
13. Do not invent Stripe-style configuration for Polar.
14. Do not ask for a Price ID unless a specific documented advanced operation actually requires it.

If any of these statements conflict with the current official Polar documentation, stop and explain the conflict before implementing.

Use the current official Polar documentation as the source of truth, not assumptions from Stripe, Paymob, older Polar examples, or third-party tutorials.
