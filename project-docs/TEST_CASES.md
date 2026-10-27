# Automated Test Cases

| ID | Scenario | Preconditions | Expected Result | Automation |
|---|---|---|---|---|
| TC-AUTH-001 | Login with unregistered email and invalid password | Login page available | Login rejected and error toast displayed | `tests/ui/login.spec.ts` |
| TC-AUTH-002 | Login with registered credentials | Valid test account | User reaches product dashboard | `tests/ui/login.spec.ts` |
| TC-CAT-001 | View configured product in catalogue | Authenticated user | Target product is visible | `tests/ui/product-catalog.spec.ts` |
| TC-CART-001 | Add configured product to cart | Authenticated user; product exists | Product-added notification shown and item visible in cart | `tests/ui/cart.spec.ts` |
| TC-ORD-001 | Place order and verify order history | Authenticated user; product exists | Order confirmation displayed and order ID appears in order history | `tests/e2e/place-order.spec.ts` |
| TC-API-001 | Authenticate through login API | Valid test account | HTTP success and non-empty authentication token returned | `tests/api/auth.api.spec.ts` |
