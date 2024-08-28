import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { IUser } from '../../../core/models/user.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  user!: IUser;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(data => {
      if (data) {
        this.user = data;
      }
    })
  }

}
