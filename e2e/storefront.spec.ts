import { test, expect } from "@playwright/test";

test.describe("storefront", () => {
  test("home page renders featured products", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Singitronic/);
    // At least one product from the seeded data should be visible.
    await expect(
      page.getByRole("link", { name: /iPhone 15 Pro/i }).first()
    ).toBeVisible();
  });

  test("shop lists all products", async ({ page }) => {
    await page.goto("/shop");
    await expect(
      page.getByRole("heading", { name: /All products/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /MacBook Pro/i }).first()
    ).toBeVisible();
  });

  test("shop category filter narrows the list", async ({ page }) => {
    await page.goto("/shop/laptops");
    // MacBook is a laptop and should show; iPhone (smartphone) should not.
    await expect(
      page.getByRole("link", { name: /MacBook Pro/i }).first()
    ).toBeVisible();
  });

  test("product detail page renders real data", async ({ page }) => {
    await page.goto("/product/iphone-15-pro");
    await expect(
      page.getByRole("heading", { name: /iPhone 15 Pro/i })
    ).toBeVisible();
    await expect(page.getByText("$999")).toBeVisible();
  });

  test("search returns matching products", async ({ page }) => {
    await page.goto("/search?search=MacBook");
    await expect(
      page.getByRole("link", { name: /MacBook Pro/i }).first()
    ).toBeVisible();
  });

  test("cart page is reachable", async ({ page }) => {
    await page.goto("/cart");
    await expect(
      page.getByRole("heading", { name: /shopping cart/i })
    ).toBeVisible();
  });

  test("wishlist page is reachable", async ({ page }) => {
    await page.goto("/wishlist");
    await expect(page.getByText(/wishlist/i).first()).toBeVisible();
  });

  test("add to cart from product page updates the cart", async ({ page }) => {
    await page.goto("/product/airpods-pro-2");
    await expect(
      page.getByRole("heading", { name: /AirPods Pro 2/i })
    ).toBeVisible();
    const addToCart = page.getByRole("button", { name: /add to cart/i });
    await addToCart.click();
    await page.goto("/cart");
    await expect(page.getByText(/AirPods Pro 2/i).first()).toBeVisible();
  });
});
