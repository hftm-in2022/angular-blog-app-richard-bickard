import { provideAuth } from "angular-auth-oidc-client";
import { AuthInterceptor } from "angular-auth-oidc-client";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { BLOG_AUHTORITY_URL, BLOG_SERVICE_BASE_URL } from "../core/constants";
export const authProviders = [
  provideAuth({
    config: {
      authority: BLOG_AUHTORITY_URL,
      redirectUrl: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
      clientId: "spa-blog",
      scope: "openid profile email offline_access blogs",
      responseType: "code",
      silentRenew: true,
      silentRenewUrl: window.location.origin + "/silent-renew.html",
      renewTimeBeforeTokenExpiresInSeconds: 10,
      secureRoutes: [BLOG_SERVICE_BASE_URL],
    },
  }),
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
