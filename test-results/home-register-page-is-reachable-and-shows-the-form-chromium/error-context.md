# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> register page is reachable and shows the form
- Location: e2e/home.spec.ts:15:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByLabel('Name')
Expected: visible
Error: strict mode violation: getByLabel('Name') resolved to 2 elements:
    1) <input id="name" type="text" required="" name="name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/> aka getByRole('textbox', { name: 'Name', exact: true })
    2) <input type="text" required="" id="lastname" name="lastname" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/> aka getByRole('textbox', { name: 'Lastname' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByLabel('Name')

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
        - listitem [ref=e15]:
          - link "Login" [ref=e16] [cursor=pointer]:
            - /url: /login
            - img [ref=e17]
            - generic [ref=e19]: Login
        - listitem [ref=e20]:
          - link "Register" [ref=e21] [cursor=pointer]:
            - /url: /register
            - img [ref=e22]
            - generic [ref=e24]: Register
    - generic [ref=e25]:
      - link "singitronic logo" [ref=e26] [cursor=pointer]:
        - /url: /
        - img "singitronic logo" [ref=e27]
      - generic [ref=e28]:
        - textbox "Type here" [ref=e29]
        - button "Search" [ref=e30] [cursor=pointer]
      - generic [ref=e31]:
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
      - heading "Register" [level=1] [ref=e44]
      - paragraph [ref=e45]: Home | Register
    - generic [ref=e46]:
      - heading "Sign up on our website" [level=2] [ref=e48]
      - generic [ref=e51]:
        - generic [ref=e52]:
          - generic [ref=e53]: Name
          - textbox "Name" [ref=e55]
        - generic [ref=e56]:
          - generic [ref=e57]: Lastname
          - textbox "Lastname" [ref=e59]
        - generic [ref=e60]:
          - generic [ref=e61]: Email address
          - textbox "Email address" [ref=e63]
        - generic [ref=e64]:
          - generic [ref=e65]: Password
          - textbox "Password" [ref=e67]
        - generic [ref=e68]:
          - generic [ref=e69]: Confirm password
          - textbox "Confirm password" [ref=e71]
        - generic [ref=e72]:
          - button "Sign up" [ref=e73] [cursor=pointer]
          - paragraph
  - contentinfo "Footer" [ref=e74]:
    - generic [ref=e75]:
      - heading "Footer" [level=2] [ref=e76]
      - generic [ref=e78]:
        - img "Singitronic logo" [ref=e79]
        - generic [ref=e80]:
          - generic [ref=e81]:
            - generic [ref=e82]:
              - heading "Sale" [level=3] [ref=e83]
              - list [ref=e84]:
                - listitem [ref=e85]:
                  - link "Discounts" [ref=e86] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e87]:
                  - link "News" [ref=e88] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e89]:
                  - link "Register Discounts" [ref=e90] [cursor=pointer]:
                    - /url: "#"
            - generic [ref=e91]:
              - heading "About Us" [level=3] [ref=e92]
              - list [ref=e93]:
                - listitem [ref=e94]:
                  - link "About Singitronic" [ref=e95] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e96]:
                  - link "Work With Us" [ref=e97] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e98]:
                  - link "Company Profile" [ref=e99] [cursor=pointer]:
                    - /url: "#"
          - generic [ref=e100]:
            - generic [ref=e101]:
              - heading "Buying" [level=3] [ref=e102]
              - list [ref=e103]:
                - listitem [ref=e104]:
                  - link "Singitronic Loyalty Card" [ref=e105] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e106]:
                  - link "Terms Of Use" [ref=e107] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e108]:
                  - link "Privacy Policy" [ref=e109] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e110]:
                  - link "Complaints" [ref=e111] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e112]:
                  - link "Partners" [ref=e113] [cursor=pointer]:
                    - /url: "#"
            - generic [ref=e114]:
              - heading "Support" [level=3] [ref=e115]
              - list [ref=e116]:
                - listitem [ref=e117]:
                  - link "Contact" [ref=e118] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e119]:
                  - link "How to Buy at Singitronic" [ref=e120] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e121]:
                  - link "FAQ" [ref=e122] [cursor=pointer]:
                    - /url: "#"
  - button "Open Next.js Dev Tools" [ref=e128] [cursor=pointer]:
    - img [ref=e129]
  - alert [ref=e132]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("home page renders", async ({ page }) => {
  4  |   await page.goto("/");
  5  |   await expect(page).toHaveTitle(/Singitronic/);
  6  | });
  7  | 
  8  | test("login page is reachable and shows the form", async ({ page }) => {
  9  |   await page.goto("/login");
  10 |   await expect(page.getByLabel("Email address")).toBeVisible();
  11 |   await expect(page.getByLabel("Password")).toBeVisible();
  12 |   await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  13 | });
  14 | 
  15 | test("register page is reachable and shows the form", async ({ page }) => {
  16 |   await page.goto("/register");
> 17 |   await expect(page.getByLabel("Name")).toBeVisible();
     |                                         ^ Error: expect(locator).toBeVisible() failed
  18 |   await expect(page.getByLabel("Lastname")).toBeVisible();
  19 |   await expect(page.getByLabel("Email address")).toBeVisible();
  20 |   await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible();
  21 | });
  22 | 
  23 | test("admin route redirects anonymous users to /login", async ({ page }) => {
  24 |   await page.goto("/admin");
  25 |   await expect(page).toHaveURL(/\/login/);
  26 | });
  27 | 
```