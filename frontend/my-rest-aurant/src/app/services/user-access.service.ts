import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserAccessService {

  backEndAddress: string = "https://us-central1-my-rest-raurant-2.cloudfunctions.net/";

  constructor(private http: HttpClient, private afAuth: Auth,) { }

  checkLogin(email: string, password: string): Observable<any>{
    const body = { email, password };
    return this.http.post(this.backEndAddress + "logIn", body).pipe(catchError(this.handleError));
  }

  createAccount(name: string, email: string, password: string): Observable<any>{
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    const body = {name, email, password}
    return this.http.post(this.backEndAddress + "signUp", body).pipe(catchError(this.handleError));
  }

  resetPassword(email: string): Observable<any>{
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    const body = {email}
    return this.http.post(this.backEndAddress + "resetPassword", body).pipe(catchError(this.handleError));
  }

  promoteToAdmin(email: string): Observable<any>{
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    const body = {email}
    return this.http.post(this.backEndAddress + "prmoteToAdmin", body).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    errorMessage = `${error.error} (${error.status})`;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
