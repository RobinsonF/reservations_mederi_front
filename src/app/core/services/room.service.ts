import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseL, IResponseO } from '../models/response.model';
import { IFindAllRomm, IFindOneRomm } from '../models/room.model';
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
}
