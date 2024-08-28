import { Component, OnInit, signal } from '@angular/core';
import { ReservationUserComponent } from '../../components/reservation-user/reservation-user.component';
import { ReservationAdminComponent } from '../../components/reservation-admin/reservation-admin.component';
import { AuthService } from '../../../core/services/auth.service';
import { IUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [ReservationUserComponent, ReservationAdminComponent],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit {

  user = signal<IUser | null>(null);

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(data => {
      this.user.set(data);
    }
    )
  }

}
