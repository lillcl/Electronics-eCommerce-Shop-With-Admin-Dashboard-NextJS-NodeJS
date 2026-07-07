import { test, expect, Page } from "@playwright/test";

async function login(page: Page, email: string, password = "password123") {
  await page.goto("/login");
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
}

test.describe("auth & admin gating", () => {
  test("anonymous user is redirected from /admin to /login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("admin can log in and reach the dashboard", async ({ page }) => {
    await login(page, "admin@test.com");
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("non-admin user is redirected away from /admin to home", async ({
    page,
  }) => {
    await login(page, "user@test.com");
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/$|\/$/);
    await expect(page).not.toHaveURL(/\/admin/);
  });
});

test.describe("admin pages (authenticated as admin)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "admin@test.com");
  });

  test("products list renders seeded products", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.getByText(/iPhone 15 Pro/i).first()).toBeVisible();
  });

  test("merchants list renders seeded merchants", async ({ page }) => {
    await page.goto("/admin/merchant");
    await expect(page.getByText(/TechWorld/i).first()).toBeVisible();
  });

  test("categories list renders seeded categories", async ({ page }) => {
    await page.goto("/admin/categories");
    await expect(page.getByText(/Smartphones/i).first()).toBeVisible();
  });

  test("users list renders seeded users", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page.getByText(/admin@test.com/i).first()).toBeVisible();
  });

  test("orders page is reachable", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(
      page.getByRole("heading", { name: /orders/i }).first()
    ).toBeVisible();
  });

  test("merchant detail page loads a seeded merchant", async ({ page }) => {
    await page.goto("/admin/merchant");
    await page.getByRole("link", { name: /^view$/i }).first().click();
    await expect(
      page.getByRole("heading", { name: /merchant details/i })
    ).toBeVisible();
  });
});
