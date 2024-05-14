import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {


  backEndAddress: string = "hhttps://reserv-service-nzaawxvneq-uc.a.run.app";

  constructor(private http: HttpClient) { }

  getReservationInfo(body: { "fecha":string }):Observable<any>
  {
    console.log({body})
    const head = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    });
    return this.http.post(this.backEndAddress + "get-reservations", body)
  }
}
