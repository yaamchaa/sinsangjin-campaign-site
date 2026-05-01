export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const getAdminLoginUrl = () => "/admin-login";

export const getCitizenLoginUrl = (returnTo?: string) => {
  const fallbackPath = `/user-login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;

  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrl || !appId) {
    return fallbackPath;
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const statePayload = JSON.stringify({
    returnTo: returnTo || "/voice",
    role: "citizen",
  });
  const state = btoa(statePayload);

  const url = new URL("/app-auth", oauthPortalUrl);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};