import { Routes } from "@angular/router";
import { LayoutComponent } from "./pages/layout/layout.component";
import { authGuard } from "../core/guards/auth.guard";

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
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
