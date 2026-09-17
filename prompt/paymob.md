# Paymob Pixel Embedded Payment Provider Integration

## Role

You are a senior full-stack engineer responsible for integrating Paymob Pixel Embedded as the first payment provider in the existing application.

Do not assume a specific AI model, framework version, or project structure.

Your first responsibility is to inspect and understand the existing codebase before making changes.

The goal is to integrate Paymob Pixel Embedded cleanly while keeping the application's core order and payment logic provider-agnostic enough that another payment provider can be introduced later without rewriting the order system.

---

# 1. Official Paymob Documentation

Use the official Paymob documentation as the primary source of truth:

https://developers.paymob.com/paymob-docs/developers/checkout-experiences/pixel-embedded

Also consult the official Intention API documentation:

https://developers.paymob.com/paymob-docs/intention-apis/create-intention

And the official API integration overview:

https://developers.paymob.com/paymob-docs/integration-paths/apis

Do not rely on outdated third-party tutorials when the official documentation provides the relevant behavior.

---

# 2. Architectural Decision

We are intentionally using Paymob Pixel Embedded as the first payment provider integration because it provides a pre-built payment UI and reduces the amount of payment-specific frontend implementation required.

The architecture must therefore distinguish between:

1. Core application/business logic.
2. Generic payment concepts.
3. Paymob-specific implementation.
4. Paymob Pixel-specific frontend UI.

The application must NOT become tightly coupled to Paymob throughout the codebase.

Paymob should be treated as a payment-provider implementation, not as the application's payment domain itself.

---

# 3. Important Concept

Paymob Pixel is NOT a replacement for the backend payment flow.

The intended flow is:

User
→ Checkout
→ Application Backend
→ Create Order
→ Create Paymob Payment Intention
→ Receive Paymob client_secret
→ Return client_secret to frontend
→ Initialize Paymob Pixel
→ Customer completes payment through Pixel
→ Paymob processes payment
→ Paymob sends callback/webhook to backend
→ Backend verifies callback
→ Backend updates payment/order state

The backend callback/webhook is the source of truth for the final payment state.

Frontend Pixel callbacks must NOT be treated as the authoritative confirmation that an order has been paid.

---

# 4. Responsibilities

## Application Backend owns

The backend remains responsible for:

* Cart validation
* Product validation
* Inventory validation
* Price calculation
* Discount calculation
* Shipping calculation
* Final order amount
* Order creation
* Payment record creation
* Payment provider selection
* Creating the Paymob intention
* Storing provider references
* Receiving Paymob callbacks/webhooks
* HMAC verification
* Updating payment status
* Updating order status
* Idempotent webhook processing
* Preventing duplicate order fulfillment
* Logging payment events
* Handling provider errors

Never trust the frontend for the final order amount.

Never mark an order as paid solely because the frontend reports success.

---

# 5. Paymob-Specific Responsibilities

Paymob-specific code should handle:

* Paymob authentication
* Paymob API requests
* Intention creation
* Mapping application payment data to Paymob request data
* Extracting the client_secret
* Mapping Paymob responses to internal payment models
* Paymob webhook parsing
* Paymob HMAC verification
* Mapping Paymob transaction statuses to internal payment statuses
* Paymob-specific errors

Keep these details isolated from the rest of the application.

---

# 6. Frontend Responsibilities

The application's frontend remains responsible for:

* Checkout page
* Customer information
* Address
* Cart summary
* Shipping information
* Order summary
* Loading states
* General checkout errors
* Order creation flow
* Rendering the payment section

Paymob Pixel is responsible for the payment UI itself, including the supported Paymob payment methods.

The current Pixel integration supports:

* Card
* Google Pay
* Apple Pay

Do not rebuild these payment fields manually if the Pixel already provides them.

---

# 7. Payment Provider Abstraction

Before implementing Paymob-specific logic, inspect the existing architecture.

If a payment abstraction already exists, extend it rather than creating a parallel architecture.

If no suitable abstraction exists, introduce a minimal provider boundary.

For example:

```ts
interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<PaymentSession>;

  handleWebhook(input: unknown): Promise<PaymentWebhookResult>;
}
```

The exact interface must be adapted to the existing codebase rather than blindly copying this example.

The application's order service should depend on the generic payment abstraction where appropriate, not directly on Paymob.

Avoid this pattern throughout business logic:

```ts
paymob.createIntention(...)
```

Prefer:

```ts
paymentProvider.createPayment(...)
```

with Paymob-specific implementation behind the provider boundary.

---

# 8. Payment Data Model

Inspect the existing database and payment/order models first.

If payment persistence does not already exist, introduce the minimum required model.

The internal payment record should be capable of storing concepts such as:

* Internal payment ID
* Internal order ID
* Provider
* Provider payment/reference ID
* Provider order/reference ID
* Amount
* Currency
* Status
* Payment method
* Provider metadata
* Created timestamp
* Updated timestamp

Do not make the internal model unnecessarily dependent on Paymob terminology.

For example, do not make the entire domain model depend on `intention_order_id`.

Store provider-specific identifiers in provider-related fields or metadata where appropriate.

---

# 9. Create Payment Flow

Implement the following logical sequence:

```text
Checkout
    ↓
Validate checkout request
    ↓
Calculate final order amount on backend
    ↓
Create internal order
    ↓
Create internal payment record
    ↓
Call PaymentProvider.createPayment()
    ↓
PaymobProvider creates Paymob Intention
    ↓
Receive client_secret
    ↓
Return safe payment session data to frontend
    ↓
Initialize Paymob Pixel
```

The client_secret is safe to return to the frontend for initializing the Pixel.

The Paymob Secret Key MUST NEVER be exposed to the browser.

---

# 10. Paymob Intention

Use Paymob's official Intention API.

The backend should create the intention using the server-side Paymob secret key.

The intention should contain the appropriate:

* Amount
* Currency
* Payment methods
* Items where appropriate
* Billing data where appropriate
* Internal order/reference identifier
* Notification/callback configuration where required

Use the Paymob documentation as the source of truth for the exact API request format.

Do not hardcode credentials.

Use environment variables for:

* Paymob secret key
* Paymob public key
* Paymob integration/payment method IDs
* Paymob base URL
* Any required HMAC secret/configuration

---

# 11. Paymob Pixel Frontend

The frontend should load Paymob Pixel according to the official documentation.

The Pixel must be initialized with:

* Public key
* Client secret
* Allowed payment methods
* Target element ID

Example concept:

```ts
new Pixel({
  publicKey,
  clientSecret,
  paymentMethods: [
    "card",
    "google-pay",
    "apple-pay",
  ],
  elementId: "paymob-elements",
});
```

Adapt the implementation to the application's framework and frontend architecture.

Do not blindly copy the vanilla HTML example if the application uses React/Next.js.

The implementation must correctly handle:

* Client-only execution
* Script loading
* Component lifecycle
* Cleanup where necessary
* Reinitialization prevention
* Loading state
* Initialization errors
* Payment completion UI
* Payment cancellation UI

---

# 12. Pixel Callbacks

Use Paymob Pixel callbacks only for frontend experience and provider-specific UI behavior.

Potential callbacks include:

* beforePaymentComplete
* afterPaymentComplete
* onPaymentCancel
* cardValidationChanged

Do not use:

```text
afterPaymentComplete
```

as the authoritative source for marking an order as paid.

The backend callback/webhook remains authoritative.

---

# 13. Webhook / Callback

Implement a dedicated backend endpoint for Paymob callbacks.

Logical flow:

```text
Paymob
   ↓
Webhook endpoint
   ↓
Parse callback
   ↓
Verify HMAC
   ↓
Validate payload
   ↓
Identify internal order/payment
   ↓
Check idempotency
   ↓
Map provider status to internal status
   ↓
Update payment
   ↓
Update order
   ↓
Trigger fulfillment/business actions
```

The callback endpoint must be idempotent.

If Paymob sends the same callback more than once, the application must not:

* Create duplicate orders
* Fulfill an order twice
* Increment inventory twice
* Send duplicate confirmation actions
* Create duplicate payment records

---

# 14. HMAC Verification

Follow the current official Paymob documentation for HMAC verification.

Never trust webhook payloads before verification.

Do not implement HMAC based on memory or an old tutorial.

Use the exact fields/order/calculation specified by the current Paymob documentation.

If the callback fails HMAC verification:

* Do not update payment state.
* Do not fulfill the order.
* Log the verification failure safely.
* Return an appropriate HTTP response according to the application's webhook conventions.

---

# 15. Security Rules

These rules are mandatory:

### NEVER expose

```text
PAYMOB_SECRET_KEY
```

to the frontend.

Never put it in:

* Client components
* Browser JavaScript
* Public environment variables
* NEXT_PUBLIC_* variables
* API responses
* Logs

The frontend may receive the Paymob client_secret required by the Pixel.

The backend must remain the only place that uses the Paymob secret key.

Do not log:

* Secret keys
* Full payment credentials
* Sensitive card information
* Sensitive authentication information

---

# 16. Environment Variables

Inspect the project's existing environment variable conventions first.

Use the existing naming conventions where possible.

Introduce only the variables actually required.

Example conceptual structure:

```env
PAYMOB_SECRET_KEY=
PAYMOB_PUBLIC_KEY=
PAYMOB_BASE_URL=
PAYMOB_CARD_INTEGRATION_ID=
PAYMOB_HMAC_SECRET=
```

Do not assume every variable above is required until verified against the current Paymob integration and project requirements.

Never commit real credentials.

---

# 17. Provider Replacement Strategy

The current provider is Paymob.

Future providers may use completely different:

* APIs
* SDKs
* embedded components
* hosted checkout
* webhooks
* authentication
* payment statuses

Therefore do NOT create an abstraction that pretends every provider is identical internally.

Instead, abstract the application's required payment capabilities.

For example:

```text
Application
    ↓
PaymentProvider
    ↓
PaymobProvider
```

Later:

```text
Application
    ↓
PaymentProvider
    ↓
StripeProvider
```

The goal is not zero code changes when changing providers.

The goal is to prevent provider-specific implementation from leaking into:

* Orders
* Cart
* Inventory
* Customers
* Checkout business rules

---

# 18. Frontend Provider Boundary

Keep Paymob Pixel-specific frontend code isolated.

For example:

```text
Payment UI
    ↓
PaymentProviderUI
    ↓
PaymobPixel
```

Do not spread Paymob Pixel initialization across unrelated checkout components.

This will allow a future provider to use:

```text
Stripe Elements
```

or:

```text
Hosted Checkout
```

or another provider-specific UI without rewriting the entire checkout.

---

# 19. Existing Codebase First

Before modifying anything:

1. Inspect the project structure.
2. Identify the existing checkout flow.
3. Identify the existing order creation flow.
4. Identify the existing payment/order models.
5. Identify existing API routes.
6. Identify authentication and authorization.
7. Identify existing environment variable conventions.
8. Identify existing frontend state management.
9. Identify existing error handling.
10. Identify existing logging conventions.
11. Identify whether a payment abstraction already exists.
12. Identify where business logic currently lives.

Do not create duplicate services or repositories if equivalent structures already exist.

Follow the project's established architecture unless there is a strong technical reason to change it.

---

# 20. Implementation Constraints

Do NOT:

* Rewrite unrelated code.
* Refactor the entire project.
* Introduce unnecessary libraries.
* Create a second architecture beside the existing architecture.
* Expose Paymob secrets.
* Trust frontend payment success as final payment confirmation.
* Hardcode production credentials.
* Put payment-provider code directly inside unrelated business logic.
* Over-engineer the provider abstraction.
* Build custom card fields when Paymob Pixel already provides them.

Prefer:

* Small changes
* Existing project conventions
* Type safety
* Clear boundaries
* Minimal dependencies
* Explicit error handling
* Idempotent webhook processing
* Testable provider logic

---

# 21. Required Implementation Phases

Execute the work in phases.

## Phase 1 — Discovery

Inspect the existing codebase and report:

* Current checkout architecture
* Order creation flow
* Payment-related code
* Relevant models
* Relevant API routes
* Frontend checkout components
* Existing environment variables
* Existing abstractions
* Integration risks

Do not modify code during this phase unless absolutely necessary.

---

## Phase 2 — Architecture Decision

Before implementation, produce a concise implementation plan.

The plan must identify:

* Where Paymob provider code will live
* Where the payment abstraction will live
* Where the Pixel component will live
* Where the create-payment endpoint will live
* Where the webhook endpoint will live
* How payment/order state will be persisted
* How secrets will be protected
* How idempotency will be handled

The plan must fit the existing project rather than imposing a generic architecture.

---

## Phase 3 — Backend Integration

Implement:

1. Paymob configuration.
2. Paymob client/service.
3. Payment provider implementation.
4. Intention creation.
5. Payment persistence.
6. Webhook endpoint.
7. HMAC verification.
8. Payment status mapping.
9. Order status updates.
10. Idempotency protection.
11. Error handling.

---

## Phase 4 — Frontend Integration

Implement:

1. Payment session creation.
2. Safe client_secret retrieval.
3. Paymob Pixel loading.
4. Pixel initialization.
5. Payment methods configuration.
6. Loading state.
7. Error state.
8. Payment completion UI.
9. Payment cancellation handling.
10. Proper component lifecycle behavior.

Keep Paymob Pixel-specific code isolated.

---

## Phase 5 — Testing

Test at minimum:

### Happy path

```text
Checkout
→ Order created
→ Intention created
→ Pixel rendered
→ Payment succeeds
→ Webhook received
→ HMAC verified
→ Payment marked paid
→ Order marked confirmed/paid
```

### Failed payment

```text
Payment fails
→ Webhook received
→ Payment marked failed
→ Order remains unpaid
```

### Cancelled payment

Test cancellation behavior, including Apple Pay cancellation if enabled.

### Duplicate webhook

Send/process the same callback multiple times.

Expected:

```text
No duplicate fulfillment
No duplicate inventory update
No duplicate payment
```

### Invalid HMAC

Expected:

```text
Reject callback
Do not update payment
Do not fulfill order
```

### Missing/invalid client secret

Expected:

```text
Graceful frontend error
No secret leakage
```

---

# 22. Verification

After implementation:

* Run type checking.
* Run linting.
* Run relevant unit/integration tests.
* Run the application.
* Verify the Pixel renders correctly.
* Verify the backend never exposes the secret key.
* Verify webhook verification.
* Verify order/payment state transitions.
* Inspect the final diff.
* Confirm unrelated files were not modified unnecessarily.

---

# 23. Final Report

At the end, provide a concise implementation report containing:

## Changed Files

List every created or modified file.

## Architecture

Explain where the payment provider boundary exists.

## Payment Flow

Explain:

```text
Checkout
→ Order
→ Intention
→ client_secret
→ Pixel
→ Paymob
→ Webhook
→ HMAC
→ Order update
```

## Security

Confirm:

* Secret key remains server-side.
* Client secret is used only for Pixel initialization.
* Webhooks are verified.
* Sensitive payment data is not logged.

## Testing

Report exactly what was tested and the result.

## Remaining Work

Clearly list anything that still requires:

* Paymob dashboard configuration
* Real credentials
* Test payment
* Webhook URL configuration
* Production configuration

Do not claim something was tested if it was not actually tested.

---

# 24. Important Decision

We are intentionally choosing:

```text
Paymob Pixel Embedded
```

for the first implementation because the primary goal is to get a reliable payment integration working with minimal custom payment UI.

We still want the architecture to preserve future provider replacement.

Therefore:

```text
Core Order Domain
        ↓
Payment Abstraction
        ↓
Paymob Provider
        ↓
Paymob API
        +
Paymob Pixel UI
```

Paymob-specific details must remain at the infrastructure/provider boundary as much as reasonably possible.

The goal is:

> Make Paymob easy to use now without making Paymob the architecture of the entire application.

Before coding, inspect the repository and adapt this plan to the actual codebase.
