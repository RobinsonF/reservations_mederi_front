import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faBell, faWindowClose, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { IUser } from '../../../core/models/user.model';
import { Colors } from '../../../core/models/colors.model';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NgClass } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FontAwesomeModule, ButtonComponent, NgClass, OverlayModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  faBell = faBell;
  faInfoCircle = faInfoCircle;
  faClose = faWindowClose;
  faAngleDown = faAngleDown;

  isOpenOverlayAvatar = false;
  isOpenOverlayBoards = false;
  isOpenOverlayCreateBoard = false;

  user: IUser | null = null;
  backgroundColor: Colors = 'success';

  allOptions: any[] = [];
  userRole: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.user$.
      subscribe(user => {
        this.user = user;
        this.allOptions = [
          { name: 'Calendario', route: 'calendar', roles: ['admin', 'user'] },
          { name: 'Usuarios', route: 'users', roles: ['admin'] },
          { name: 'Salas', route: 'rooms', roles: ['admin'] },
          { name: 'Reservaciones', route: 'reservations', roles: ['admin', 'user'] },
          { name: 'Reportes', route: 'reports', roles: ['admin'] }
        ];
        this.allOptions = this.filterOptions();
      });
  }

  filterOptions() {
    return this.allOptions.filter(option => option.roles.includes(this.user?.role));
  }

  truncateText(text: string | undefined, limit: number = 20): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  close(event: boolean) {
    this.isOpenOverlayCreateBoard = event;
  }

}
