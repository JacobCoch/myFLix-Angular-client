/**
 * This is the service file that communicates with the API
 * @export
 * @class FetchApiDataService
 * 
 * The following methods are defined:
 * @method userRegistration()
 * @method userLogin()
 * @method getAllMovies()
 * @method getOneMovie()
 * @method getOneDirector()
 * @method getOneGenre()
 * @method getUser()
 * @method editUser()
 * @method getFavoriteMovies()
 * @method addFavoriteMovie()
 * @method deleteUser()
 * @method deleteFavoriteMovie()
 * @method extractResponseData()
 * @method handleError()
 * 
 * 
 * The Api can be found at:
 * https://mymovieapidb.herokuapp.com/
 * 

 */

import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

const apiUrl = 'https://mymovieapidb.herokuapp.com/';

@Injectable({
  // This decorator specifies that the class right below it is a service
  providedIn: 'root',
})
/**
 * Defines the methods that access the API to retrieve data
 * @export
 * @class FetchApiDataService
 *
 */
export class FetchApiDataService {
  // HttpClient is a service that allows us to make HTTP requests
  constructor(private http: HttpClient) {}

  /**
   * @method userRegistration
   * @param userDetails
   * @returns an Observable of the API call
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http

      .post(apiUrl + 'users', userDetails) //--------------- Pass userDetails as the request body
      .pipe(catchError(this.handleError));
  }

  /**
   * @method userLogin
   * @param userDetails
   * @returns   an Observable of the API call
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login?' + new URLSearchParams(userDetails), {})
      .pipe(catchError(this.handleError));
  }

  /**
   * @method getAllMovies
   * @returns  an Observable of the API call
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
    return this.http
      .get(apiUrl + 'movies', { headers })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @method getOneMovie
   * @param title
   * @returns  an Observable of the API call
   */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @method getOneDirector
   * @param directorName
   * @returns  an Observable of the API call
   *
   */
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/director/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @method getOneGenre
   * @param Name
   * @returns  an Observable of the API call
   */
  getOneGenre(Name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/Genre/' + Name, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @method getUser
   * @returns  an Observable of the API call
   */
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user'); // Retrieve as a string

    if (userString) {
      const user = JSON.parse(userString); // Parse if not null

      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + token,
      });

      return this.http
        .get(apiUrl + 'users/' + user.Username, { headers })
        .pipe(map(this.extractResponseData), catchError(this.handleError));
    } else {
      // Handle the case when userString is null
      console.error('User data not found in localStorage');
      return throwError(() => 'User data not found in localStorage');
    }
  }

  /**
   * @method editUser
   * @param userDetails
   * @returns  an Observable of the API call
   */
  editUser(userDetails: any): Observable<any> {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userString) {
      const user = JSON.parse(userString);
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + token,
      });

      return this.http
        .put(apiUrl + 'users/' + user.Username, userDetails, { headers })
        .pipe(
          tap((response) => {
            console.log('API Response:', response);
          }),
          map(this.extractResponseData),
          catchError(this.handleError)
        );
    } else {
      console.error('User data not found in localStorage');
      return throwError(() => 'User data not found in localStorage');
    }
  }

  /**
   * @method getFavoriteMovies
   * @param id
   * @returns  an Observable of the API call
   */
  getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http
      .get(apiUrl + 'users/' + username + '/favorites', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        tap((response) => {
          console.log('API Response for favorite movies:', response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * @method addFavoriteMovie
   * @param movieId
   * @returns  an Observable of the API call
   */
  addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    if (user) {
      return this.http
        .post(
          apiUrl + 'users/' + user.Username + '/' + movieId,
          {},
          { headers }
        )
        .pipe(catchError(this.handleError));
    } else {
      return of(null);
    }
  }

  /**
   * @method deleteFavoriteMovie
   * @param movieId
   * @returns  an Observable of the API call
   */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const username = localStorage.getItem('Username');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    if (username) {
      return this.http
        .delete(apiUrl + 'users/' + username + '/' + movieId, { headers })
        .pipe(catchError(this.handleError));
    } else {
      return of(null);
    }
  }

  /**
   * @method deleteUser
   * @returns  an Observable of the API call
   */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + user._id, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * @method extractResponseData
   * @returns  whichever data is passed in
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * @method handleError
   * @returns  error messages
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}
