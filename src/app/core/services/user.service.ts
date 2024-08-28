import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseL, IResponseO } from '../models/response.model';
import { ICreateUser, IFindOneUser, IUser } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { checkToken } from '../interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<IResponseL<IUser>> {
    const url = `${environment.API_URL}/api/v1/users`;
    return this.http.get<IResponseL<IUser>>(url, { context: checkToken() });
  }

  getById(id: number): Observable<IResponseO<IFindOneUser>> {
    const url = `${environment.API_URL}/api/v1/users/${id}`;
    return this.http.get<IResponseO<IFindOneUser>>(url, { context: checkToken() });
  }

  create(user: ICreateUser): Observable<IResponseO<IUser>> {
    const url = `${environment.API_URL}/api/v1/users`;
    return this.http.post<IResponseO<IUser>>(url, user, { context: checkToken() });
  }

  update(id: number, user: any): Observable<IResponseO<IUser>> {
    const url = `${environment.API_URL}/api/v1/users/${id}`;
    return this.http.put<IResponseO<IUser>>(url, user, { context: checkToken() });
  }

  delete(id: number): Observable<IResponseO<IUser>> {
    const url = `${environment.API_URL}/api/v1/users/${id}`;
    return this.http.delete<IResponseO<IUser>>(url, { context: checkToken() });
  }
}
