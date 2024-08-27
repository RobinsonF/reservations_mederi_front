import { Routes } from "@angular/router";
import { AdminComponent } from "./pages/admin/admin.component";
import { CalendarComponent } from "./pages/calendar/calendar.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'calendar',
        component: CalendarComponent
      },
      {
        path: 'users',
        loadChildren: () => import('../user/user.routes').then(m => m.USER_ROUTES),
      },
      {
        path: 'rooms',
        loadChildren: () => import('../room/room.routes').then(m => m.ROOM_ROUTES),
      },
      {
        path: 'reservations',
        loadChildren: () => import('../reservation/reservation.routes').then(m => m.RESERVATION_ROUTES),
      },
      {
        path: 'reports',
        loadChildren: () => import('../report/report.routes').then(m => m.REPORT_ROUTES),
      },
      {
        path: '',
        redirectTo: 'calendar',
        pathMatch: 'full',
      }
    ]
  }
]
