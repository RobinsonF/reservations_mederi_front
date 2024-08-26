import { Routes } from "@angular/router";
import { LayoutComponent } from "./pages/layout/layout.component";

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
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      }
    ]
  }
]
