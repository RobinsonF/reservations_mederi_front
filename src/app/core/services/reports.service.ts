import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponseL } from '../models/response.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { checkToken } from '../interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private http: HttpClient
  ) { }

  getFrequencyReport(): Observable<IResponseL<any>> {
    const url = `${environment.API_URL}/api/v1/reports/frequencyReport`;
    return this.http.get<IResponseL<any>>(url, { context: checkToken() });
  }

  hoursReport(): Observable<IResponseL<any>> {
    const url = `${environment.API_URL}/api/v1/reports/hoursReport`;
    return this.http.get<IResponseL<any>>(url, { context: checkToken() });
  }
}
