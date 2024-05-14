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
    return this.http.post(`${this.backEndAddress}/get-reservations`, body).pipe(
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
    return this.http.post<ApiReservation[]>(`${this.backEndAddress}/extract_reservations`,
      { User_id: userId }
    ).pipe(
      map((reservations: ApiReservation[]) => reservations.map((res: ApiReservation): Reservation => ({
        id: res.ID,  // Convert number ID to string if necessary
        userid: res.USER_ID,
        date: res.Date,
        time: res.Time,
        numberOfPeople: res.Number_of_people
      }))),
      catchError(this.handleError)
    );
  }

  // Eliminar una reservación
  deleteReservation(reservationId: number): Observable<any> {
    const body = { ID: reservationId };
    return this.http.post(`${this.backEndAddress}/cancel_reservation`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateReservation(updateData: ApiReservation): Observable<any> {
    return this.http.post(`${this.backEndAddress}/edit_reservation`, updateData).pipe(
      catchError(this.handleError)
    );
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<ApiReservation[]>(`${this.backEndAddress}/all_reservations`).pipe(
      map(reservations => reservations.map(res => ({
        id: res.ID,  // Convert ID to string if necessary
        userid: res.USER_ID,
        date: res.Date,
        time: res.Time,
        numberOfPeople: res.Number_of_people
      }))),
      catchError(this.handleError)
    );
  }
  
  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    errorMessage = `${error.error} (${error.status})`;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
