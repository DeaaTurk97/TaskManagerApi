
import { Injectable } from '@angular/core';
import { endPoint } from '../../env';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http: HttpClient) { }

  getUser = (req: Object) => this.http.post<any>(`${endPoint}Auth/login`, req);

}
