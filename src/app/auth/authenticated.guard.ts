import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { map, of, switchMap } from "rxjs";
import { hasRole } from "./auth-utils";

export const isAuthenticatedGuard: CanActivateFn = () => {
  const oidcSecurityService = inject(OidcSecurityService);
  const router = inject(Router);
  return oidcSecurityService.checkAuth().pipe(
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(["/"]);
        return of(false);
      }
      return oidcSecurityService.getAccessToken().pipe(
        map((accessToken) => {
          if (!accessToken) {
            router.navigate(["/"]);
            return false;
          }
          if (!hasRole(accessToken, "user")) {
            router.navigate(["/"]);
            return false;
          }
          return true;
        }),
      );
    }),
  );
};
