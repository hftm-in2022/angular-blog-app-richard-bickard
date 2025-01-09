import { Component, inject, OnInit, signal } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { AsyncPipe } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { RouterLink, RouterOutlet } from "@angular/router";
import { LoginResponse, OidcSecurityService } from "angular-auth-oidc-client";
import { hasRole } from "../../auth/auth-utils";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
  ],
})
export class SidebarComponent implements OnInit {
  oidcSecurityService = inject(OidcSecurityService);
  username = signal<string | undefined>(undefined);
  isUserRole = signal(false);
  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit() {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((loginResponse: LoginResponse) => {
        const { isAuthenticated, userData, accessToken } = loginResponse;

        if (isAuthenticated) {
          const username = userData?.preferred_username;

          this.username.set(username ?? "unknown");
          this.isUserRole.set(hasRole(accessToken, "user"));
        } else {
          this.username.set(undefined);
          this.isUserRole.set(false);
        }
      });
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  public logout() {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
  }

  public login() {
    this.oidcSecurityService.authorize();
  }
}
