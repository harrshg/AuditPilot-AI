import type { Page } from 'playwright';

import { Credential } from '@auditpilot/shared';

const USERNAME_SELECTORS = [
  'input[type="email"]',
  'input[name="email"]',
  'input[name="username"]',
  'input#username',
  'input#email',
];

const PASSWORD_SELECTORS = ['input[type="password"]', 'input[name="password"]', 'input#password'];

const SUBMIT_SELECTORS = [
  'button[type="submit"]',
  'input[type="submit"]',
  'button:has-text("Log in")',
  'button:has-text("Sign in")',
];

export type LoginResult = {
  success: boolean;
  message: string;
};

export async function performLogin(page: Page, credential: Credential): Promise<LoginResult> {
  if (!credential.loginUrl) {
    return { success: false, message: 'No loginUrl was provided for this credential.' };
  }

  await page.goto(credential.loginUrl, { waitUntil: 'domcontentloaded' });

  const usernameField = await findFirstVisible(page, USERNAME_SELECTORS);
  const passwordField = await findFirstVisible(page, PASSWORD_SELECTORS);

  if (!usernameField || !passwordField) {
    return { success: false, message: 'Could not locate username/password fields on the login page.' };
  }

  await usernameField.fill(credential.username);
  await passwordField.fill(credential.password);

  const submitButton = await findFirstVisible(page, SUBMIT_SELECTORS);

  if (submitButton) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => undefined),
      submitButton.click(),
    ]);
  } else {
    await passwordField.press('Enter');
    await page.waitForLoadState('domcontentloaded').catch(() => undefined);
  }

  if (credential.mfaRequired) {
    return {
      success: false,
      message: 'Login form was submitted, but MFA is required and cannot be completed automatically.',
    };
  }

  return { success: true, message: 'Login form submitted successfully.' };
}

async function findFirstVisible(page: Page, selectors: string[]) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.count().then((count: number) => count > 0).catch(() => false)) {
      return locator;
    }
  }

  return undefined;
}
