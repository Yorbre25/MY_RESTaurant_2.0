import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Reservation } from '../models/reservation'; 
import { map } from 'rxjs/operators';

interface ApiReservation {
  Date: string;
  ID: number;
  Number_of_people: number;
  Time: string;
  USER_ID: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  backEndAddress: string = "https://us-central1-my-rest-raurant-2.cloudfunctions.net";

  constructor(private http: HttpClient) { }

  // Obtener información de la reserva
  getReservationInfo(body: { fecha: string }): Observable<any> {
    console.log({ body })
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    });
    return this.http.post(`${this.backEndAddress}/get-reservations`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener las horas disponibles basadas en una fecha
  getHoursFromDate(date: string): Observable<any> {
    return this.http.get(`${this.backEndAddress}/get-hours`, {
      params: { date }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch reservations for a specific user
  getReservationsFromUser(userId: string): Observable<Reservation[]> {
    return this.http.get<ApiReservation[]>(`${this.backEndAddress}/extract_reservations`, {
      params: { User_id: userId }
    }).pipe(
      map((reservations: ApiReservation[]) => reservations.map((res: ApiReservation): Reservation => ({
        id: res.ID.toString(),  // Convert number ID to string if necessary
        userid: res.USER_ID,
        date: res.Date,
        time: res.Time,
        numberOfPeople: res.Number_of_people
      }))),
      catchError(this.handleError)
    );
  }

  // Eliminar una reservación
  deleteReservation(reservationId: string): Observable<any> {
    return this.http.delete(`${this.backEndAddress}/delete-reservation`, {
      params: { reservationId }
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateReservation(reservationId: string, reservation: any): Observable<any> {
    return this.http.put(`${this.backEndAddress}/reservations/${reservationId}`, reservation);
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    errorMessage = `${error.error} (${error.status})`;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
