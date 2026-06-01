import { createHash } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "cross_border_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export function getAdminSessionValue(adminPassword = getAdminPassword()) {
  if (!adminPassword) {
    return "";
  }

  return createHash("sha256")
    .update(`cross-border-store-admin:${adminPassword}`)
    .digest("hex");
}

export function isValidAdminPassword(value: string) {
  const adminPassword = getAdminPassword();

  return Boolean(adminPassword) && value === adminPassword;
}

export async function hasValidAdminCookie() {
  const adminPassword = getAdminPassword();

  if (!adminPassword) {
    return false;
  }

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return sessionValue === getAdminSessionValue(adminPassword);
}

export async function isAdminAuthorized(inputKey?: string) {
  if (inputKey && isValidAdminPassword(inputKey)) {
    return true;
  }

  return hasValidAdminCookie();
}

export async function setAdminSessionCookie() {
  const adminPassword = getAdminPassword();

  if (!adminPassword) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, getAdminSessionValue(adminPassword), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
  });
}
