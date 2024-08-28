import { Routes } from "@angular/router";
import { LayoutComponent } from "./pages/layout/layout.component";
import { authGuard } from "../core/guards/auth.guard";
import { redirectGuard } from "../core/guards/redirect.guard";

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        canActivate: [redirectGuard],
        loadChildren: () => import('../auth/auth.routes').then(m => m.AUTH_ROUTES),
      },
      {
        path: 'app',
        canActivate: [authGuard],
        loadChildren: () => import('../admin/admin.routes').then(m => m.ADMIN_ROUTES),
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      }
    ]
  }
]
