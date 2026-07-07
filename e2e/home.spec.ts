import { test, expect } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Singitronic/);
});

test("login page is reachable and shows the form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});

test("register page is reachable and shows the form", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Lastname")).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible();
});

test("admin route redirects anonymous users to /login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);
});
