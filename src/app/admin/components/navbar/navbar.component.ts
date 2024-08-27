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

  options = [
    {
      name: 'Calendario',
      route: 'calendar'
    },
    {
      name: 'Usuarios',
      route: 'users'
    },
    {
      name: 'Salas',
      route: 'rooms'
    },
    {
      name: 'Reservaciones',
      route: 'reservations'
    },
    {
      name: 'Reportes',
      route: 'reports'
    }
  ]

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authService.user$.
      subscribe(user => {
        this.user = user;
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  close(event: boolean) {
    this.isOpenOverlayCreateBoard = event;
  }

}
