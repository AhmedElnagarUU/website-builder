# OpenCode Implementation Mission

## Architecture Modernization — MongoDB → Mongoose + Raw AI APIs → LangChain

You are the implementation engineer for this project.

Your responsibility is to inspect the existing codebase, understand its current architecture, and implement the following two architectural migrations:

1. **MongoDB native driver/package → Mongoose**
2. **Direct/raw AI model API integrations → LangChain**

Do not treat this as a simple dependency replacement.

The goal is to improve the project's architectural boundaries while preserving existing functionality and behavior.

---

# 1. Core Operating Rules

## 1.1 Inspect Before Changing

Before modifying any code:

* Inspect the repository structure.
* Identify the current application architecture.
* Identify the existing data-access layer.
* Identify every MongoDB integration.
* Identify every AI/model integration.
* Identify existing repositories/services/lib modules related to both areas.
* Understand how data flows through the application.
* Understand existing environment/configuration handling.
* Understand existing tests and validation mechanisms.

Do not assume file paths, naming conventions, or architecture.

Follow the conventions already established by the project unless there is a strong architectural reason to change them.

---

# 2. Migration A — MongoDB Native Driver → Mongoose

## Objective

Migrate the project's MongoDB access from the native MongoDB package/driver to **Mongoose**.

The purpose is not merely to replace APIs.

The architectural objective is to establish explicit, centralized **data models and schemas** so application data has predictable structure, types, validation rules, defaults, indexes, and relationships where appropriate.

The migration must preserve existing application behavior and existing valid data.

---

# 3. MongoDB Investigation

First identify:

### Database connection

Find:

* MongoDB connection initialization
* MongoDB client creation
* connection pooling
* database selection
* environment variables
* connection lifecycle
* connection reuse/caching
* development vs production behavior

### Collections

Create an inventory of every collection currently used.

For each collection identify:

* collection name
* document shape
* required fields
* optional fields
* field types
* nested objects
* arrays
* references
* timestamps
* indexes
* unique constraints
* existing validation
* current CRUD operations
* aggregation pipelines
* transactions/session usage
* pagination
* sorting
* filtering
* projections
* raw MongoDB operators
* special MongoDB types such as ObjectId

### Data-access architecture

Identify whether the project currently uses:

* repositories
* services
* database utilities
* direct collection access
* helper functions
* feature-specific database access

Document where MongoDB logic currently lives.

---

# 4. Mongoose Architecture

Design the Mongoose architecture based on the actual repository.

Do not blindly create a generic `models` folder if the project's existing architecture suggests another appropriate location.

Establish clear ownership for:

**Application → Repository/Service → Mongoose Model → MongoDB**

The application should not need to know MongoDB implementation details unnecessarily.

---

# 5. Mongoose Schemas

For each relevant collection, create an appropriate Mongoose schema/model.

Schemas should reflect the **actual domain requirements discovered in the existing codebase**, not invented requirements.

Evaluate where appropriate:

* field types
* required fields
* optional fields
* defaults
* enums
* min/max constraints
* string constraints
* nested schemas
* arrays
* references
* timestamps
* indexes
* unique constraints
* immutable fields
* schema strictness
* serialization behavior

Use Mongoose features only when they provide real architectural value.

Do not over-engineer schemas.

---

# 6. Important Schema-Safety Requirement

The purpose of this migration is to reduce errors caused by arbitrary document shapes.

Therefore, carefully evaluate Mongoose's schema strictness and validation behavior.

Determine:

* which fields must exist
* which fields may be optional
* which unknown fields should be rejected or ignored
* which existing documents may contain legacy fields
* whether existing malformed documents exist
* whether a migration/backfill is required

Do not simply make every field `required`.

Requirements must come from the actual application's domain and existing behavior.

---

# 7. Existing Data Compatibility

This migration must be **non-destructive**.

Before changing schemas:

* inspect existing document shapes
* identify legacy documents
* identify incompatible documents
* identify fields that may currently be missing
* identify fields with inconsistent types
* determine whether existing documents can safely be read by the new models

If data migration or backfilling is necessary:

* document why
* create a safe migration strategy
* make the migration deterministic
* avoid destructive transformations
* preserve existing information
* ensure the migration can be validated

Do not delete or rewrite production data simply to make it conform to the new schema.

---

# 8. MongoDB Driver Removal

After the migration is complete, search the entire project for direct MongoDB driver usage.

Identify remaining usage of:

* `MongoClient`
* native collections
* native `find`
* native `findOne`
* native `insertOne`
* native `updateOne`
* native `deleteOne`
* native aggregation
* other direct MongoDB APIs

The objective is to eliminate native MongoDB access from normal application data access.

However, do **not** force a Mongoose rewrite where a low-level MongoDB operation is genuinely required.

If any native MongoDB usage remains:

1. identify it
2. determine why it is necessary
3. document the reason
4. keep it isolated behind an appropriate boundary

Do not leave accidental native-driver usage simply because it was inconvenient to migrate.

---

# 9. Mongoose-Specific Concerns

Evaluate the project's architecture for:

### Connection caching

If the project uses a framework with development hot reload/serverless execution, ensure Mongoose connections are not unnecessarily recreated.

### Model compilation

Avoid model recompilation problems such as:

`OverwriteModelError`

when modules are reloaded.

### Query behavior

Evaluate whether queries should use:

* `.lean()`
* projections
* pagination
* population
* aggregation

Only use these when appropriate.

### DTO / serialization behavior

Check whether moving from plain MongoDB documents to Mongoose documents changes:

* JSON serialization
* `_id`
* `id`
* timestamps
* API response shape
* server/client boundaries

Preserve existing external API contracts unless the migration explicitly requires otherwise.

---

# 10. Migration B — Raw AI API Calls → LangChain

## Objective

Migrate the project's direct AI/model API integrations toward **LangChain**.

The purpose is to reduce provider-specific coupling and create a cleaner AI integration boundary.

The application should not be tightly coupled to one specific AI provider's API format.

The resulting architecture should make it substantially easier to change:

* provider
* model
* API implementation
* model configuration

without rewriting application/business logic.

---

# 11. AI Integration Investigation

Before modifying AI code, inventory every AI integration.

Identify:

* AI providers
* model names
* SDKs
* raw HTTP requests
* provider-specific APIs
* API clients
* prompts
* system messages
* user messages
* structured output
* JSON responses
* streaming
* retries
* timeouts
* error handling
* rate-limit handling
* token usage
* cost tracking
* embeddings
* vector stores
* tool calls
* function calling
* multimodal inputs
* model configuration
* environment variables

Search the entire project rather than assuming there is only one AI integration.

---

# 12. AI Architecture

Establish a clean boundary between application logic and AI infrastructure.

Prefer an architecture conceptually similar to:

**Application / Feature Logic**
↓
**Internal AI Service / AI Abstraction**
↓
**LangChain**
↓
**Provider Integration**
↓
**AI Model**

The exact implementation should follow the project's architecture.

Do not blindly create abstractions that duplicate functionality already provided by the existing architecture.

---

# 13. LangChain Integration

Use LangChain where it provides meaningful abstraction.

Evaluate the appropriate LangChain components based on the existing AI functionality.

Potentially relevant components include:

* chat model abstractions
* prompt templates
* structured output
* streaming
* model configuration
* provider integrations
* embeddings
* retrievers
* tools

Do not introduce chains, agents, memory systems, or other LangChain abstractions merely because they exist.

**Use the minimum LangChain architecture necessary to achieve the project's goals.**

This is an architectural migration, not a reason to introduce unnecessary complexity.

---

# 14. Provider Independence

The application should avoid depending directly on provider-specific concepts wherever possible.

For example, avoid application code being tightly coupled to:

* provider-specific request payloads
* provider-specific response parsing
* provider-specific SDK methods
* provider-specific error structures
* provider-specific configuration

Provider-specific logic should remain inside the AI infrastructure boundary.

The desired result is that changing from:

`Provider A → Provider B`

or:

`Model A → Model B`

requires minimal application-level changes.

---

# 15. Preserve Existing AI Behavior

The migration must preserve existing functionality.

Pay particular attention to:

### Prompts

Do not casually rewrite prompts.

Preserve:

* system instructions
* user prompts
* prompt variables
* formatting
* expected outputs

unless a change is required by the new abstraction.

### Structured output

If the current application expects JSON or structured data:

* preserve the output contract
* validate the result
* ensure malformed responses are handled appropriately

### Streaming

If the existing application streams model responses:

* preserve streaming behavior
* preserve incremental response handling
* preserve frontend/API behavior

Do not accidentally convert a streaming workflow into a blocking request.

### Errors

Preserve appropriate handling for:

* rate limits
* timeouts
* provider errors
* invalid responses
* network failures
* malformed structured output

### Configuration

Keep provider/model configuration centralized.

Avoid scattering API keys and model configuration across features.

---

# 16. Environment Variables

Inspect the existing environment configuration.

Separate:

* provider credentials
* model configuration
* application configuration

Do not expose secrets to client-side code.

Do not print:

* API keys
* tokens
* secrets
* private credentials

in logs or reports.

---

# 17. Testing the AI Abstraction

Create or update tests where appropriate.

The tests should demonstrate that:

1. The application can call the internal AI abstraction.
2. The AI abstraction correctly invokes LangChain.
3. Expected output contracts remain intact.
4. Errors are handled correctly.
5. Streaming behavior remains intact where applicable.
6. Provider-specific implementation details do not leak into business logic.
7. Switching provider/model configuration does not require rewriting feature logic.

Where real API calls would be expensive or unreliable, use mocks/fakes at the appropriate boundary.

Do not require real API credentials for ordinary unit tests.

---

# 18. Relationship Between the Two Migrations

Treat these as two architectural migrations:

## Epic A

**MongoDB Native Driver → Mongoose**

Primary goal:

> Explicit and reliable application data models.

## Epic B

**Raw AI API Integrations → LangChain**

Primary goal:

> A maintainable AI integration boundary with reduced provider coupling.

Determine from the actual repository whether there is any dependency between them.

Do not assume one migration must happen before the other.

If they are independent, keep their implementation and commits logically separated.

---

# 19. Scope Control

Do NOT use this migration as an excuse to:

* rewrite the entire application
* redesign unrelated features
* change UI unnecessarily
* replace unrelated libraries
* introduce unrelated architecture patterns
* rename large numbers of files without need
* rewrite working business logic
* change API contracts without justification
* perform speculative optimization

Only change what is necessary to achieve the migration safely.

If you discover unrelated technical debt:

* document it
* do not automatically fix it

unless it directly blocks the migration.

---

# 20. Implementation Process

Follow this sequence.

### Phase 1 — Discovery

Inspect the project thoroughly.

Produce a concise internal map of:

* MongoDB architecture
* collection inventory
* current data access
* AI architecture
* provider inventory
* current integration points
* relevant tests
* configuration

### Phase 2 — Design

Determine:

* Mongoose model architecture
* schema boundaries
* repository/data-access migration strategy
* legacy data compatibility strategy
* LangChain integration boundary
* provider abstraction
* migration order
* testing strategy

### Phase 3 — Implementation

Implement the Mongoose migration.

Then implement the LangChain migration.

Keep the changes logically separated.

### Phase 4 — Validation

Run appropriate:

* type checking
* linting
* unit tests
* integration tests
* build
* targeted runtime checks

Also search for obsolete integrations.

### Phase 5 — Regression Check

Verify that existing functionality still works.

Pay particular attention to:

* authentication
* user/site/account data
* CRUD operations
* API responses
* database writes
* database reads
* AI generation
* AI streaming
* structured AI responses
* error handling

Use the actual project functionality discovered during inspection.

---

# 21. Definition of Done — Mongoose

The Mongoose migration is complete only when:

* [ ] MongoDB access has been fully inventoried.
* [ ] Relevant collections have explicit Mongoose schemas/models.
* [ ] Schemas reflect actual domain requirements.
* [ ] Validation is meaningful and not artificially restrictive.
* [ ] Data-access logic uses Mongoose models appropriately.
* [ ] Existing valid data remains compatible.
* [ ] No destructive data migration occurred.
* [ ] Legacy/inconsistent data has been identified.
* [ ] Any required migration/backfill is documented and validated.
* [ ] Connection management is correct.
* [ ] Model compilation/reload issues are prevented.
* [ ] API response contracts are preserved.
* [ ] Normal application code no longer directly uses the native MongoDB driver.
* [ ] Any remaining low-level MongoDB access is justified and isolated.
* [ ] Tests/typecheck/lint/build pass as applicable.

---

# 22. Definition of Done — LangChain

The LangChain migration is complete only when:

* [ ] All AI integrations have been inventoried.
* [ ] Provider-specific coupling has been identified.
* [ ] LangChain is integrated at the appropriate infrastructure boundary.
* [ ] Application/business logic is separated from provider-specific APIs.
* [ ] Existing prompts are preserved unless change is necessary.
* [ ] Structured output behavior is preserved.
* [ ] Streaming behavior is preserved where applicable.
* [ ] Error handling remains correct.
* [ ] Retry/timeout behavior is preserved or intentionally improved.
* [ ] Model/provider configuration is centralized.
* [ ] Secrets remain server-side.
* [ ] AI functionality remains operational.
* [ ] Tests cover the new abstraction appropriately.
* [ ] Provider/model switching can be performed without unnecessary application rewrites.
* [ ] No unnecessary LangChain complexity has been introduced.

---

# 23. Final Architecture Verification

After implementation, inspect the resulting architecture from a clean perspective.

Answer:

### MongoDB

Before:

`Application → Native MongoDB Driver → MongoDB`

After:

`Application → Repository/Service → Mongoose Model/Schema → MongoDB`

Explain what architectural guarantees were gained.

### AI

Before:

`Application → Provider-specific API/SDK → AI Provider`

After:

`Application → AI Boundary → LangChain → Provider Integration → AI Model`

Explain what coupling was removed.

Also identify anything that still violates these boundaries.

---

# 24. Final Report

When implementation is complete, provide a concise but evidence-based report containing:

## Summary

What was migrated.

## MongoDB → Mongoose

* collections migrated
* models/schemas created
* repositories/services changed
* validation introduced
* legacy data findings
* remaining native MongoDB usage, if any
* reason for any exceptions

## AI → LangChain

* providers discovered
* integrations migrated
* LangChain components introduced
* abstraction created
* streaming/structured-output status
* provider-specific coupling removed
* remaining provider-specific code, if any

## Files Changed

List the important files/directories changed and why.

## Validation

Report:

* tests
* typecheck
* lint
* build
* targeted checks

Include actual results.

Do not claim a check passed if it was not actually run.

## Risks / Follow-up

List any remaining:

* migration risks
* legacy data issues
* technical debt
* provider limitations
* future improvements

## Final Status

Use exactly one:

`COMPLETED`

`COMPLETED_WITH_FOLLOW_UP`

`BLOCKED`

---

# 25. Important Final Rule

Do not optimize for "I changed the dependencies."

Optimize for:

**architectural correctness + preserved behavior + explicit data contracts + provider independence + validated migration.**

Inspect first.

Understand second.

Design third.

Implement fourth.

Validate fifth.

Report evidence last.
