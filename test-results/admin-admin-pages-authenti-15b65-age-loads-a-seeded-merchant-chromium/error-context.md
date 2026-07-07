# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> admin pages (authenticated as admin) >> merchant detail page loads a seeded merchant
- Location: e2e/admin.spec.ts:64:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /^view$/i }).first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e4]:
      - list [ref=e5]:
        - listitem [ref=e6]:
          - img [ref=e7]
          - generic [ref=e9]: +381 61 123 321
        - listitem [ref=e10]:
          - img [ref=e11]
          - generic [ref=e13]: test@email.com
      - list [ref=e14]:
        - generic [ref=e15]: admin@test.com
        - listitem [ref=e16]:
          - button "Log out" [ref=e17] [cursor=pointer]:
            - img [ref=e18]
            - generic [ref=e20]: Log out
    - generic [ref=e21]:
      - link "singitronic logo" [ref=e22] [cursor=pointer]:
        - /url: /
        - img "singitronic logo" [ref=e23]
      - generic [ref=e24]:
        - textbox "Type here" [ref=e25]
        - button "Search" [ref=e26] [cursor=pointer]
      - generic [ref=e27]:
        - button "Notifications" [ref=e29] [cursor=pointer]:
          - img [ref=e30]
        - link "0" [ref=e33] [cursor=pointer]:
          - /url: /wishlist
          - img [ref=e34]
          - generic [ref=e36]: "0"
        - link "0" [ref=e38] [cursor=pointer]:
          - /url: /cart
          - img [ref=e39]
          - generic [ref=e41]: "0"
  - generic [ref=e42]:
    - generic [ref=e43]:
      - heading "Login" [level=1] [ref=e44]
      - paragraph [ref=e45]: Home | Login
    - generic [ref=e46]:
      - heading "Sign in to your account" [level=2] [ref=e48]
      - generic [ref=e50]:
        - generic [ref=e51]:
          - generic [ref=e52]:
            - generic [ref=e53]: Email address
            - textbox "Email address" [ref=e55]
          - generic [ref=e56]:
            - generic [ref=e57]: Password
            - textbox "Password" [ref=e59]
          - link "Forgot password?" [ref=e62] [cursor=pointer]:
            - /url: "#"
          - button "Sign in" [ref=e64] [cursor=pointer]
        - paragraph
  - contentinfo "Footer" [ref=e65]:
    - generic [ref=e66]:
      - heading "Footer" [level=2] [ref=e67]
      - generic [ref=e69]:
        - img "Singitronic logo" [ref=e70]
        - generic [ref=e71]:
          - generic [ref=e72]:
            - generic [ref=e73]:
              - heading "Sale" [level=3] [ref=e74]
              - list [ref=e75]:
                - listitem [ref=e76]:
                  - link "Discounts" [ref=e77] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e78]:
                  - link "News" [ref=e79] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e80]:
                  - link "Register Discounts" [ref=e81] [cursor=pointer]:
                    - /url: "#"
            - generic [ref=e82]:
              - heading "About Us" [level=3] [ref=e83]
              - list [ref=e84]:
                - listitem [ref=e85]:
                  - link "About Singitronic" [ref=e86] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e87]:
                  - link "Work With Us" [ref=e88] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e89]:
                  - link "Company Profile" [ref=e90] [cursor=pointer]:
                    - /url: "#"
          - generic [ref=e91]:
            - generic [ref=e92]:
              - heading "Buying" [level=3] [ref=e93]
              - list [ref=e94]:
                - listitem [ref=e95]:
                  - link "Singitronic Loyalty Card" [ref=e96] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e97]:
                  - link "Terms Of Use" [ref=e98] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e99]:
                  - link "Privacy Policy" [ref=e100] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e101]:
                  - link "Complaints" [ref=e102] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e103]:
                  - link "Partners" [ref=e104] [cursor=pointer]:
                    - /url: "#"
            - generic [ref=e105]:
              - heading "Support" [level=3] [ref=e106]
              - list [ref=e107]:
                - listitem [ref=e108]:
                  - link "Contact" [ref=e109] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e110]:
                  - link "How to Buy at Singitronic" [ref=e111] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e112]:
                  - link "FAQ" [ref=e113] [cursor=pointer]:
                    - /url: "#"
  - button "Open Next.js Dev Tools" [ref=e119] [cursor=pointer]:
    - img [ref=e120]
  - alert [ref=e123]
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
  39 |     await expect(page.getByText(/iPhone 15 Pro/i).first()).toBeVisible();
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
> 66 |     await page.getByRole("link", { name: /^view$/i }).first().click();
     |                                                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
  67 |     await expect(
  68 |       page.getByRole("heading", { name: /merchant details/i })
  69 |     ).toBeVisible();
  70 |   });
  71 | });
  72 | 
```