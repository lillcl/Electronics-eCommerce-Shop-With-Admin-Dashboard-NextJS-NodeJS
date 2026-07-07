# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> admin pages (authenticated as admin) >> products list renders seeded products
- Location: e2e/admin.spec.ts:37:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/iPhone 15 Pro/i).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/iPhone 15 Pro/i).first()

```

```yaml
- banner:
  - list:
    - listitem:
      - img
      - text: +381 61 123 321
    - listitem:
      - img
      - text: test@email.com
  - list:
    - text: admin@test.com
    - listitem:
      - button "Log out":
        - img
        - text: Log out
  - link "singitronic logo":
    - /url: /
    - img "singitronic logo"
  - textbox "Type here"
  - button "Search"
  - button "Notifications":
    - img
  - link "0":
    - /url: /wishlist
    - img
    - text: "0"
  - link "0":
    - /url: /cart
    - img
    - text: "0"
- heading "Login" [level=1]
- paragraph: Home | Login
- heading "Sign in to your account" [level=2]
- text: Email address
- textbox "Email address"
- text: Password
- textbox "Password"
- link "Forgot password?":
  - /url: "#"
- button "Sign in"
- paragraph
- contentinfo "Footer":
  - heading "Footer" [level=2]
  - img "Singitronic logo"
  - heading "Sale" [level=3]
  - list:
    - listitem:
      - link "Discounts":
        - /url: "#"
    - listitem:
      - link "News":
        - /url: "#"
    - listitem:
      - link "Register Discounts":
        - /url: "#"
  - heading "About Us" [level=3]
  - list:
    - listitem:
      - link "About Singitronic":
        - /url: "#"
    - listitem:
      - link "Work With Us":
        - /url: "#"
    - listitem:
      - link "Company Profile":
        - /url: "#"
  - heading "Buying" [level=3]
  - list:
    - listitem:
      - link "Singitronic Loyalty Card":
        - /url: "#"
    - listitem:
      - link "Terms Of Use":
        - /url: "#"
    - listitem:
      - link "Privacy Policy":
        - /url: "#"
    - listitem:
      - link "Complaints":
        - /url: "#"
    - listitem:
      - link "Partners":
        - /url: "#"
  - heading "Support" [level=3]
  - list:
    - listitem:
      - link "Contact":
        - /url: "#"
    - listitem:
      - link "How to Buy at Singitronic":
        - /url: "#"
    - listitem:
      - link "FAQ":
        - /url: "#"
- alert
```

# Test source

```ts
  1  | import { test, expect, Page } from "@playwright/test";
  2  | 
  3  | async function login(page: Page, email: string, password = "password123") {
  4  |   await page.goto("/login");
  5  |   await page.locator("#email").fill(email);
  6  |   await page.locator("#password").fill(password);
  7  |   await page.getByRole("button", { name: /sign in/i }).click();
  8  | }
  9  | 
  10 | test.describe("auth & admin gating", () => {
  11 |   test("anonymous user is redirected from /admin to /login", async ({ page }) => {
  12 |     await page.goto("/admin");
  13 |     await expect(page).toHaveURL(/\/login/);
  14 |   });
  15 | 
  16 |   test("admin can log in and reach the dashboard", async ({ page }) => {
  17 |     await login(page, "admin@test.com");
  18 |     await page.goto("/admin");
  19 |     await expect(page).toHaveURL(/\/admin$/);
  20 |   });
  21 | 
  22 |   test("non-admin user is redirected away from /admin to home", async ({
  23 |     page,
  24 |   }) => {
  25 |     await login(page, "user@test.com");
  26 |     await page.goto("/admin");
  27 |     await expect(page).toHaveURL(/\/$|\/$/);
  28 |     await expect(page).not.toHaveURL(/\/admin/);
  29 |   });
  30 | });
  31 | 
  32 | test.describe("admin pages (authenticated as admin)", () => {
  33 |   test.beforeEach(async ({ page }) => {
  34 |     await login(page, "admin@test.com");
  35 |   });
  36 | 
  37 |   test("products list renders seeded products", async ({ page }) => {
  38 |     await page.goto("/admin/products");
> 39 |     await expect(page.getByText(/iPhone 15 Pro/i).first()).toBeVisible();
     |                                                            ^ Error: expect(locator).toBeVisible() failed
  40 |   });
  41 | 
  42 |   test("merchants list renders seeded merchants", async ({ page }) => {
  43 |     await page.goto("/admin/merchant");
  44 |     await expect(page.getByText(/TechWorld/i).first()).toBeVisible();
  45 |   });
  46 | 
  47 |   test("categories list renders seeded categories", async ({ page }) => {
  48 |     await page.goto("/admin/categories");
  49 |     await expect(page.getByText(/Smartphones/i).first()).toBeVisible();
  50 |   });
  51 | 
  52 |   test("users list renders seeded users", async ({ page }) => {
  53 |     await page.goto("/admin/users");
  54 |     await expect(page.getByText(/admin@test.com/i).first()).toBeVisible();
  55 |   });
  56 | 
  57 |   test("orders page is reachable", async ({ page }) => {
  58 |     await page.goto("/admin/orders");
  59 |     await expect(
  60 |       page.getByRole("heading", { name: /orders/i }).first()
  61 |     ).toBeVisible();
  62 |   });
  63 | 
  64 |   test("merchant detail page loads a seeded merchant", async ({ page }) => {
  65 |     await page.goto("/admin/merchant");
  66 |     await page.getByRole("link", { name: /^view$/i }).first().click();
  67 |     await expect(
  68 |       page.getByRole("heading", { name: /merchant details/i })
  69 |     ).toBeVisible();
  70 |   });
  71 | });
  72 | 
```