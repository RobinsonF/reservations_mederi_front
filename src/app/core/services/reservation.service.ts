import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IResponseL, IResponseO } from '../models/response.model';
import { checkToken } from '../interceptors/token.interceptor';
import { ICreateReservation, IFindAllReservation, IReservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<IResponseL<IFindAllReservation>> {
    const url = `${environment.API_URL}/api/v1/reservations`;
    return this.http.get<IResponseL<IFindAllReservation>>(url, { context: checkToken() });
  }

  getById(id: number): Observable<IResponseO<IFindAllReservation>> {
    const url = `${environment.API_URL}/api/v1/reservations/${id}`;
    return this.http.get<IResponseO<IFindAllReservation>>(url, { context: checkToken() });
  }

  create(reservation: ICreateReservation): Observable<IResponseO<IFindAllReservation>> {
    const url = `${environment.API_URL}/api/v1/reservations`;
    return this.http.post<IResponseO<IFindAllReservation>>(url, reservation, { context: checkToken() });
  }

  update(id: number, reservation: any): Observable<IResponseO<IFindAllReservation>> {
    const url = `${environment.API_URL}/api/v1/reservations/${id}`;
    return this.http.put<IResponseO<IFindAllReservation>>(url, reservation, { context: checkToken() });
  }

  delete(id: number): Observable<IResponseO<IFindAllReservation>> {
    const url = `${environment.API_URL}/api/v1/reservations/${id}`;
    return this.http.delete<IResponseO<IFindAllReservation>>(url, { context: checkToken() });
  }
}
