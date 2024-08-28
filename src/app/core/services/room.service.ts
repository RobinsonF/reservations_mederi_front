import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseL, IResponseO } from '../models/response.model';
import { ICreateRoom, IFindAllRomm, IFindOneRomm, IRoom } from '../models/room.model';
import { environment } from '../../../environments/environment';
import { checkToken } from '../interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<IResponseL<IFindAllRomm>> {
    const url = `${environment.API_URL}/api/v1/rooms`;
    return this.http.get<IResponseL<IFindAllRomm>>(url, { context: checkToken() });
  }

  getById(id: number): Observable<IResponseO<IFindOneRomm>> {
    const url = `${environment.API_URL}/api/v1/rooms/${id}`;
    return this.http.get<IResponseO<IFindOneRomm>>(url, { context: checkToken() });
  }

  create(room: ICreateRoom): Observable<IResponseO<IRoom>> {
    const url = `${environment.API_URL}/api/v1/rooms`;
    return this.http.post<IResponseO<IRoom>>(url, room, { context: checkToken() });
  }

  update(id: number, room: any): Observable<IResponseO<IRoom>> {
    const url = `${environment.API_URL}/api/v1/rooms/${id}`;
    return this.http.put<IResponseO<IRoom>>(url, room, { context: checkToken() });
  }

  delete(id: number): Observable<IResponseO<IRoom>> {
    const url = `${environment.API_URL}/api/v1/rooms/${id}`;
    return this.http.delete<IResponseO<IRoom>>(url, { context: checkToken() });
  }
}
