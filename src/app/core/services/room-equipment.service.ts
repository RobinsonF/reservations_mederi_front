import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseL, IResponseO } from '../models/response.model';
import { ICreateRoomEquipment, IRoomEquipment } from '../models/room-equipment.model';
import { checkToken } from '../interceptors/token.interceptor';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomEquipmentService {

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<IResponseL<IRoomEquipment>> {
    const url = `${environment.API_URL}/api/v1/room-equipment`;
    return this.http.get<IResponseL<IRoomEquipment>>(url, { context: checkToken() });
  }

  getById(id: number): Observable<IResponseO<IRoomEquipment>> {
    const url = `${environment.API_URL}/api/v1/room-equipment/${id}`;
    return this.http.get<IResponseO<IRoomEquipment>>(url, { context: checkToken() });
  }

  create(roomEquipment: ICreateRoomEquipment): Observable<IResponseO<IRoomEquipment>> {
    const url = `${environment.API_URL}/api/v1/room-equipment`;
    return this.http.post<IResponseO<IRoomEquipment>>(url, roomEquipment, { context: checkToken() });
  }

  update(id: number, roomEquipment: any): Observable<IResponseO<IRoomEquipment>> {
    const url = `${environment.API_URL}/api/v1/room-equipment/${id}`;
    return this.http.put<IResponseO<IRoomEquipment>>(url, roomEquipment, { context: checkToken() });
  }

  delete(id: number): Observable<IResponseO<IRoomEquipment>> {
    const url = `${environment.API_URL}/api/v1/room-equipment/${id}`;
    return this.http.delete<IResponseO<IRoomEquipment>>(url, { context: checkToken() });
  }
}
