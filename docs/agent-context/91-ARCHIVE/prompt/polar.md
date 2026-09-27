# MISSION

You are the senior software architect and implementation planner for this project.

The project currently uses Paymob as its payment gateway.

We have made a product/architecture decision to migrate from Paymob to Polar.

Your responsibility in this task is NOT to immediately implement the migration.

Your responsibility is to:

1. Analyze the existing repository deeply.
2. Discover every Paymob dependency and every business flow connected to payments/subscriptions.
3. Study the current Polar integration requirements using the official Polar documentation.
4. Identify architectural differences between Paymob and Polar.
5. Produce one complete migration EPIC.
6. Break that EPIC into clear, independently executable MISSIONS.
7. Define dependencies, acceptance criteria, risks, testing requirements, environment changes, migration concerns, and rollback considerations.
8. Make the plan specific to THIS repository, not a generic Paymob-to-Polar tutorial.

The final output must be an implementation-ready migration plan that another coding agent can execute mission by mission.

---

# IMPORTANT RULES

## Rule 1 — Analyze Before Planning

Do NOT assume how Paymob is integrated.

Inspect the repository first.

Search for:

* Paymob package dependencies
* Paymob environment variables
* Paymob API URLs
* Paymob configuration
* payment services
* payment repositories
* payment models
* subscription models
* checkout routes
* checkout UI
* payment callbacks
* webhook endpoints
* webhook signature/HMAC verification
* payment status handling
* order creation/update
* subscription activation
* subscription cancellation
* trial handling
* payment failure handling
* redirect URLs
* success/failure pages
* background jobs
* cron jobs
* admin billing pages
* customer billing pages
* invoices
* payment logs
* transaction IDs
* provider IDs
* metadata
* any Paymob-specific types/interfaces
* tests
* documentation
* environment examples

Use repository-wide search.

Do not rely only on filenames.

Trace the complete payment flow from:

Customer action
→ frontend
→ backend
→ payment provider
→ callback/webhook
→ database
→ subscription/access state
→ UI.

---

# Rule 2 — Preserve Business Logic

The objective is:

"Replace the payment provider, not accidentally redesign the product."

Existing business rules must be preserved unless the analysis proves that a Polar-native approach is required.

The migration must preserve:

* customer identity
* application user identity
* subscription/access relationship
* trial/business rules
* paid/unpaid states
* site activation/deactivation behavior
* billing-related database records
* authorization logic
* existing protected routes
* existing dashboard behavior
* existing customer experience where reasonably possible

Do not introduce unrelated refactors.

Do not change authentication architecture.

Do not change MongoDB/Mongoose architecture.

Do not change the application's overall architecture unless required by Polar.

---

# Rule 3 — Polar Is Not Paymob

Do NOT perform a mechanical rename such as:

Paymob → Polar

Instead, identify conceptual differences.

Paymob may expose concepts such as:

* integration IDs
* payment keys
* intention/payment APIs
* callback URLs
* response callbacks
* HMAC
* transaction IDs
* payment status

Polar has its own concepts around:

* organizations
* products
* prices
* checkout
* checkout sessions/links
* customers
* subscriptions
* orders
* webhooks
* customer state
* sandbox
* access tokens
* external customer identifiers
* subscription lifecycle

Map these concepts explicitly.

Create a migration mapping table:

| Existing Concept | Current Paymob Implementation | Polar Equivalent | Required Application Change |
| ---------------- | ----------------------------- | ---------------- | --------------------------- |
| Customer         | ...                           | ...              | ...                         |
| Checkout         | ...                           | ...              | ...                         |
| Payment          | ...                           | ...              | ...                         |
| Subscription     | ...                           | ...              | ...                         |
| Trial            | ...                           | ...              | ...                         |
| Payment success  | ...                           | ...              | ...                         |
| Payment failure  | ...                           | ...              | ...                         |
| Webhook          | ...                           | ...              | ...                         |
| Provider ID      | ...                           | ...              | ...                         |
| Customer ID      | ...                           | ...              | ...                         |
| Product/Plan     | ...                           | ...              | ...                         |

Populate the table from the actual repository and official Polar documentation.

---

# Rule 4 — Official Polar Documentation Is the Source of Truth

Use the official Polar documentation as the source of truth for the new integration.

Primary reference:

https://polar.sh/docs/integrate/sdk/typescript

Also investigate the official documentation for:

* TypeScript SDK
* Next.js integration
* Better Auth integration if relevant to the existing application
* Checkout
* Products
* Prices
* Subscriptions
* Trials
* Customers
* Customer State
* Webhooks
* Webhook verification
* Sandbox
* Orders
* Refunds
* Customer Portal
* authentication/access tokens

Do not invent Polar APIs, method names, event names, payload shapes, environment variables, or SDK behavior.

If the documentation is ambiguous, mark the item as:

DOCUMENTATION VERIFICATION REQUIRED

instead of guessing.

---

# Rule 5 — Existing Trial Requirement

The current product has a business requirement around a 15-day trial.

Analyze exactly how the current application implements this requirement.

Determine whether the existing trial is:

* application-controlled
* provider-controlled
* hybrid

Then determine how Polar's subscription/trial capabilities should interact with the existing application.

Important:

Do not automatically move the entire trial logic into Polar.

First determine whether the application's business rule requires:

User signs up
→ 15-day trial starts
→ user can use the product
→ trial expires
→ site becomes disabled if unpaid

or:

User signs up
→ Polar subscription with 15-day trial
→ Polar controls trial lifecycle
→ webhook updates application access

or another architecture.

The migration plan must explicitly document the chosen model and why.

---

# Rule 6 — Webhook Is the Source of Truth for Provider State

Design the migration around asynchronous payment events.

Do not treat:

* frontend redirect
* success page
* browser callback
* client-side state

as proof that payment succeeded.

The application must derive authoritative payment/subscription state from verified provider events/API state.

Analyze the existing webhook implementation and redesign it for Polar.

The plan must cover:

* webhook endpoint
* authentication/signature verification
* raw request body requirements if applicable
* event parsing
* event validation
* idempotency
* duplicate delivery
* event ordering
* retry behavior
* failure responses
* database updates
* logging
* observability
* security

Explicitly define:

"What happens if Polar sends the same webhook twice?"

"What happens if events arrive out of order?"

"What happens if our webhook returns 500?"

"What happens if the payment succeeds but our application temporarily fails to process the webhook?"

"What happens if the webhook is delayed?"

"What happens if the user closes the checkout page?"

"What happens if the browser redirect succeeds but the webhook has not arrived yet?"

---

# Rule 7 — Provider Abstraction

Determine whether the current Paymob implementation is tightly coupled to the business logic.

If it is tightly coupled, plan the minimum safe abstraction necessary.

Prefer a provider-oriented architecture such as:

Payment Provider
↓
Payment Service
↓
Application Billing/Subscription Domain
↓
User/Site Access

The business domain should not depend directly on Paymob-specific concepts.

After migration, avoid creating the same problem with Polar-specific concepts everywhere in the application.

However:

Do NOT over-engineer a generic multi-provider system unless the repository already follows such an architecture or there is a concrete requirement for it.

Build only the abstraction needed for maintainability and correctness.

---

# Rule 8 — Database Analysis

Inspect all billing/payment/subscription-related models.

Determine whether existing fields are provider-specific.

For example, identify fields conceptually equivalent to:

* provider
* providerCustomerId
* providerPaymentId
* providerSubscriptionId
* transactionId
* integrationId
* paymentStatus
* subscriptionStatus
* amount
* currency
* checkoutSessionId
* metadata
* paidAt
* expiresAt

Decide whether fields should:

1. remain generic,
2. be renamed,
3. be replaced,
4. be expanded,
5. receive a migration/default value.

Do not blindly delete existing Paymob fields.

Determine whether existing production records require preservation.

The migration plan must distinguish:

* schema changes
* code changes
* data migration
* new records
* backward compatibility

---

# Rule 9 — Environment Variables

Find all existing Paymob environment variables.

Create a migration table:

| Current Variable | Purpose | Action         |
| ---------------- | ------- | -------------- |
| PAYMOB_*         | ...     | Remove/replace |
| ...              | ...     | ...            |

Then define the required Polar configuration based only on official documentation.

Likely categories to investigate:

* Polar access token
* Polar environment
* Polar organization/product identifiers
* webhook secret/configuration
* public checkout configuration if required

Do not invent variable names that are not confirmed.

Also determine:

* development configuration
* sandbox configuration
* production configuration
* Vercel/deployment configuration
* `.env.example`
* secret management

---

# Rule 10 — Checkout Architecture

Analyze the current Paymob checkout flow.

Document:

1. How the user starts checkout.
2. Which server endpoint is called.
3. How the payment session is created.
4. What data is sent to the provider.
5. How the customer is identified.
6. How the user is redirected.
7. What happens after checkout.
8. How the application confirms payment.
9. How subscription/access is activated.

Then design the equivalent Polar flow.

Prefer the simplest Polar-native checkout architecture supported by the official SDK/framework integration.

Do not recreate Paymob's flow if Polar provides a simpler hosted checkout/subscription flow.

---

# Rule 11 — Subscription Lifecycle

Analyze every place where the application assumes a subscription state.

Map:

* trialing
* active
* canceled
* past_due
* unpaid
* expired
* failed
* revoked/disabled
* any custom application status

Do not assume Polar status names map one-to-one to current application statuses.

Create an explicit state mapping:

Polar Provider State
↓
Application Billing State
↓
Application Access State

For example:

Provider event
→ subscription state
→ billing record
→ site access decision

The application access layer should not blindly expose provider-specific statuses.

---

# Rule 12 — Site Access / 15-Day Trial

The application has a business rule where an unpaid/expired customer may eventually have their site disabled.

Trace the exact implementation.

Identify:

* where trial expiration is calculated
* where subscription state is stored
* where access is checked
* where the site is disabled
* whether access is checked synchronously
* whether a cron/background job exists
* whether webhook events trigger changes
* whether a user can bypass the restriction

The migration must ensure that changing payment providers does not break this business rule.

---

# Rule 13 — Idempotency

The migration must explicitly define idempotency.

Webhook processing must be safe if:

Event A arrives once.

Event A arrives twice.

Event A arrives five times.

Event A is retried after a timeout.

Event B arrives before Event A.

The database must not accidentally:

* create duplicate subscriptions
* create duplicate payment records
* extend trials multiple times
* activate access incorrectly
* disable access incorrectly
* duplicate invoices/orders
* overwrite newer state with stale state

If the current architecture has no event-id/idempotency mechanism, create a mission to introduce the minimum required mechanism.

---

# Rule 14 — Existing Paymob Data

Determine whether existing customers/subscriptions/payments exist in production.

If yes, define a migration strategy.

Important questions:

* Do existing Paymob customers remain active?
* Do they need to migrate to Polar?
* Do existing subscriptions need to be recreated?
* Can payment methods be migrated?
* Should existing customers continue under Paymob temporarily?
* Is a dual-provider period required?
* What happens when an existing Paymob subscription renews?
* When should Paymob be disabled?
* Can Polar become the provider only for new customers?

Do NOT assume that existing provider subscriptions can be migrated automatically.

If provider-side migration is impossible or requires manual action, explicitly document it.

---

# Rule 15 — No Premature Deletion

Do not immediately delete Paymob code.

First identify:

* what is safe to remove
* what must be migrated
* what must remain temporarily
* what can be archived
* what production data depends on it

Create a final cleanup mission after the Polar integration is proven.

---

# EXPECTED EPIC STRUCTURE

Create exactly one migration EPIC.

Suggested title:

EPIC: Migrate Billing & Payments from Paymob to Polar

The EPIC must contain:

## 1. Objective

Explain the migration goal.

## 2. Scope

What is included.

## 3. Out of Scope

What must not be changed.

## 4. Current Architecture

Describe the discovered Paymob flow from the repository.

## 5. Target Architecture

Describe the proposed Polar flow.

## 6. Provider Mapping

Paymob → Polar mapping.

## 7. Database Impact

Models, fields, indexes, migration requirements.

## 8. Environment Impact

Secrets, sandbox, production configuration.

## 9. Webhook Architecture

Event flow, verification, idempotency, failure handling.

## 10. Trial Architecture

Especially the 15-day trial requirement.

## 11. Subscription Lifecycle

State mapping.

## 12. Existing Customer Migration

Production migration strategy.

## 13. Testing Strategy

Unit, integration, webhook, checkout, subscription, failure and regression testing.

## 14. Rollback Strategy

How to safely revert if Polar integration fails.

## 15. Risks

Technical and business risks.

## 16. Missions

List all implementation missions in dependency order.

---

# MISSION DESIGN

Each mission must have this structure:

### Mission ID

Example:

POLAR-M01

### Mission Title

Clear and action-oriented.

### Objective

What this mission accomplishes.

### Repository Areas

Specific files/directories discovered during analysis.

Do not invent paths.

### Dependencies

Which previous missions must be completed.

### Implementation Tasks

Concrete tasks.

### Technical Decisions

Decisions the implementation agent must follow.

### Acceptance Criteria

Specific conditions that prove the mission is complete.

### Tests

Tests that must pass.

### Risks

Known risks.

### Output

What files/code/configuration should exist after completion.

---

# REQUIRED MISSION BREAKDOWN

Create missions according to what the repository actually requires.

At minimum, investigate whether these missions are needed:

## POLAR-M01 — Repository & Paymob Dependency Audit

Find every Paymob dependency and document the complete current billing flow.

No code changes unless required for analysis tooling.

Output:

* Paymob dependency map
* current sequence flow
* affected files
* database dependencies
* environment variables
* production migration concerns

---

## POLAR-M02 — Polar Architecture & Provider Mapping

Study the official Polar integration model and map the existing application architecture to Polar.

Output:

* target architecture
* Paymob → Polar mapping
* checkout flow
* subscription flow
* webhook flow
* customer identity strategy
* trial strategy
* unresolved documentation questions

---

## POLAR-M03 — Billing Domain / Provider Boundary

If required after M01/M02, introduce or improve the smallest provider boundary necessary to prevent Polar-specific logic from leaking throughout the application.

Do not over-engineer.

---

## POLAR-M04 — Polar SDK & Configuration

Install/configure the official TypeScript SDK required by the target implementation.

Configure:

* server-side authentication
* sandbox
* production
* environment variables
* `.env.example`
* deployment secrets

Follow the current official Polar documentation.

---

## POLAR-M05 — Polar Customer & Product/Price Integration

Implement the provider-side customer/product/price mapping required by the application.

Define how the application's user ID is associated with Polar.

Prefer stable external identifiers/metadata where officially supported.

---

## POLAR-M06 — Polar Checkout

Replace the Paymob checkout creation flow with the appropriate Polar checkout/session flow.

Acceptance criteria must prove:

* correct customer
* correct product/price
* correct amount/currency
* correct application metadata
* correct return behavior
* no secret exposed to browser
* no false payment activation from redirect alone

---

## POLAR-M07 — Polar Webhooks

Implement the authoritative Polar webhook integration.

Must cover:

* verification
* event parsing
* relevant event types
* idempotency
* duplicate events
* retries
* failures
* logging
* database synchronization
* subscription synchronization

---

## POLAR-M08 — Subscription & Trial Synchronization

Synchronize Polar subscription lifecycle with the application's billing/access model.

Explicitly implement/test:

* trial
* active
* renewal
* failed payment
* past due/unpaid where relevant
* cancellation
* expiration
* access revocation
* restoration after successful payment

Preserve the application's 15-day trial business requirement unless the architecture analysis proves that Polar-native trials are a better exact match.

---

## POLAR-M09 — Site Access Enforcement

Verify that subscription/trial state correctly controls the application's site access.

Test:

Trial active
→ access allowed

Trial expired
→ unpaid
→ access disabled

Payment succeeds
→ webhook processed
→ access restored

Webhook delayed
→ no unsafe false activation

Duplicate webhook
→ no duplicate state transition

---

## POLAR-M10 — Payment Failure & Recovery

Implement and test failure scenarios.

Include:

* declined payment
* expired payment method
* renewal failure
* webhook failure
* duplicate webhook
* malformed webhook
* unauthorized webhook
* provider timeout
* API failure
* user closes checkout
* redirect without confirmed provider state

---

## POLAR-M11 — Existing Customer / Production Migration

Only create this mission if existing Paymob production customers exist.

Define:

* old customers
* active subscriptions
* trial users
* unpaid users
* canceled users
* historical payments
* migration eligibility
* dual-provider requirements
* manual customer migration
* customer communication implications
* rollback

Do not assume payment methods can be transferred from Paymob to Polar.

---

## POLAR-M12 — Testing & Verification

Create comprehensive tests for:

### Checkout

* checkout creation
* invalid user
* invalid product
* invalid amount
* provider failure

### Webhooks

* valid event
* invalid signature
* duplicate event
* out-of-order event
* unknown event
* malformed payload
* processing failure

### Subscription

* trial
* activation
* renewal
* cancellation
* payment failure
* expiration
* restoration

### Access

* active subscription
* active trial
* expired trial
* unpaid subscription
* canceled subscription

### Regression

Verify unrelated application functionality remains unchanged.

---

## POLAR-M13 — Remove Paymob

Only after all Polar missions are complete and verified.

Remove:

* Paymob SDK/dependencies
* Paymob services
* Paymob routes
* Paymob environment variables
* Paymob-specific types
* unused database fields if safe
* Paymob documentation
* obsolete tests

Do NOT remove historical production data merely because Paymob is no longer active.

---

## POLAR-M14 — Production Cutover & Rollback

Define the production deployment strategy.

Include:

1. Sandbox verification.
2. Production Polar configuration.
3. Webhook deployment.
4. Secret configuration.
5. Product/price verification.
6. Checkout verification.
7. Monitoring.
8. Controlled cutover.
9. Post-deployment verification.
10. Rollback procedure.

---

# ACCEPTANCE CRITERIA FOR THE EPIC

The migration is complete only when:

* No production checkout depends on Paymob.
* New customers can successfully purchase through Polar.
* The application correctly identifies the Polar customer.
* Subscription state is synchronized from verified Polar events.
* Webhooks are idempotent.
* Duplicate webhook deliveries do not corrupt billing state.
* Failed webhook processing does not falsely mark payment as successful.
* The 15-day trial business rule is preserved.
* Trial expiration correctly affects site access.
* Successful payment/subscription activation correctly restores access.
* Subscription cancellation is correctly reflected.
* Payment renewal/failure behavior is correctly reflected.
* Sandbox testing passes.
* Production configuration is documented.
* Paymob secrets are no longer required after cutover.
* Paymob-specific code is removed only after successful verification.
* Existing customer data is preserved.
* Existing non-payment functionality remains unaffected.
* Tests pass.
* No provider secret is exposed to the browser.

---

# AGENT BEHAVIOR

You are a planning/architecture agent in this phase.

DO NOT start implementing the migration immediately.

First inspect the repository.

Then produce the EPIC and MISSIONS.

Every important decision must be based on either:

1. Evidence found in the repository, or
2. Official Polar documentation.

For assumptions, explicitly label them:

ASSUMPTION

For unresolved items:

OPEN QUESTION

For documentation-dependent items:

DOCUMENTATION VERIFICATION REQUIRED

Do not fabricate APIs, event names, fields, SDK methods, or file paths.

Do not rewrite unrelated architecture.

Do not introduce unnecessary abstractions.

The final plan must be detailed enough that another coding agent can execute each mission without rereading the entire project documentation.

---

# FINAL OUTPUT FORMAT

Return:

# EPIC

Title

Objective

Scope

Out of Scope

Current Architecture

Target Architecture

Paymob → Polar Mapping

Database Impact

Environment Impact

Webhook Strategy

Trial Strategy

Subscription Lifecycle

Production Migration Strategy

Risks

Rollback Strategy

---

# MISSIONS

POLAR-M01
Title
Objective
Dependencies
Repository Areas
Tasks
Acceptance Criteria
Tests
Risks
Output

POLAR-M02
...

Continue until the migration is fully covered.

---

# TRACEABILITY

At the end create:

| Requirement        | Current Implementation | Target Implementation | Mission   |
| ------------------ | ---------------------- | --------------------- | --------- |
| Checkout           | ...                    | ...                   | POLAR-Mxx |
| Customer           | ...                    | ...                   | POLAR-Mxx |
| Subscription       | ...                    | ...                   | POLAR-Mxx |
| 15-day trial       | ...                    | ...                   | POLAR-Mxx |
| Webhook            | ...                    | ...                   | POLAR-Mxx |
| Access control     | ...                    | ...                   | POLAR-Mxx |
| Payment failure    | ...                    | ...                   | POLAR-Mxx |
| Existing customers | ...                    | ...                   | POLAR-Mxx |
| Paymob removal     | ...                    | ...                   | POLAR-Mxx |

The goal is complete traceability from the current Paymob implementation to the final Polar implementation.
