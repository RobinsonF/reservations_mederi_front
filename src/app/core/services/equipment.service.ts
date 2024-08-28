import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreateEquipment, IEquipment } from '../models/equipment.mode';
import { IResponseL, IResponseO } from '../models/response.model';
import { Observable } from 'rxjs';
import { checkToken } from '../interceptors/token.interceptor';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<IResponseL<IEquipment>> {
    const url = `${environment.API_URL}/api/v1/equipment`;
    return this.http.get<IResponseL<IEquipment>>(url, { context: checkToken() });
  }

  getById(id: number): Observable<IResponseO<IEquipment>> {
    const url = `${environment.API_URL}/api/v1/equipment/${id}`;
    return this.http.get<IResponseO<IEquipment>>(url, { context: checkToken() });
  }

  create(equipment: ICreateEquipment): Observable<IResponseO<IEquipment>> {
    const url = `${environment.API_URL}/api/v1/equipment`;
    return this.http.post<IResponseO<IEquipment>>(url, equipment, { context: checkToken() });
  }

  update(id: number, equipment: any): Observable<IResponseO<IEquipment>> {
    const url = `${environment.API_URL}/api/v1/equipment/${id}`;
    return this.http.put<IResponseO<IEquipment>>(url, equipment, { context: checkToken() });
  }

  delete(id: number): Observable<IResponseO<IEquipment>> {
    const url = `${environment.API_URL}/api/v1/equipment/${id}`;
    return this.http.delete<IResponseO<IEquipment>>(url, { context: checkToken() });
  }
}
