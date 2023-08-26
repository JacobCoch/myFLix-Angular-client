import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
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
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params.
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  /**
   *
   * @param userDetails
   * @returns an Observable of the API call
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails) // Pass userDetails as the request body
      .pipe(catchError(this.handleError));
  }

  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'login?' + new URLSearchParams(userDetails), {})
      .pipe(catchError(this.handleError));
  }

  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

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

  getUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    console.log('Token:', token);
    console.log('Username:', username);

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    return this.http
      .get(apiUrl + 'users/' + username, { headers })
      .pipe(
        tap((response) => {
          console.log('API Response:', response);
        })
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getFavoriteMovies(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      return user.FavoriteMovies.includes(movieId);
    }
    return false;
  }

  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    user.FavoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));

    return this.http
      .post(
        apiUrl + 'users/' + user.Username + '/movies/' + movieId,
        {},
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  editUser(userDetails: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + user.Username, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

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

  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const index = user.FavoriteMovies.indexOf(movieId);
    console.log(index);
    if (index > -1) {
      user.FavoriteMovies.splice(index, 1);
    }
    localStorage.setItem('user', JSON.stringify(user));
    return this.http
      .delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(this.extractResponseData, catchError(this.handleError));
  }

  private extractResponseData(res: any): any {
    console.log(res);
    const body = res;
    return body || {};
  }

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
