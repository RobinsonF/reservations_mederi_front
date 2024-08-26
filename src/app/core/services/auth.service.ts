import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { ICreateAuthUser, IUser } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { IResponseLogin } from '../models/response.model';
import { checkToken } from '../interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new BehaviorSubject<IUser | null>(null);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(email: string, password: string) {
    const url = `${environment.API_URL}/api/v1/auth/login`;
    return this.http.post<IResponseLogin>(url, {
      email,
      password
    }).
      pipe(
        tap(response => {
          if (response.token) {
            this.tokenService.saveToken(response.token);
          }
        })
      );
  }

  register(user: ICreateAuthUser) {
    const url = `${environment.API_URL}/api/v1/auth/register`;
    return this.http.post(url, user);
  }


  recovery(email: string) {
    const url = `${environment.API_URL}/api/v1/auth/recovery`;
    return this.http.post(url, {
      email
    });
  }

  changePassword(token: string, newPassword: string) {
    const url = `${environment.API_URL}/api/v1/auth/change-password`;
    return this.http.post(url, {
      token,
      newPassword
    });
  }

  profile() {
    const url = `${environment.API_URL}/api/v1/auth/profile`;
    return this.http.get<IUser>(url, { context: checkToken() }).
      pipe(
        tap(user => {
          this.user$.next(user);
        })
      );
  }

  getDataUser() {
    return this.user$.getValue();
  }

  logout() {
    this.tokenService.removeToken();
  }
}
