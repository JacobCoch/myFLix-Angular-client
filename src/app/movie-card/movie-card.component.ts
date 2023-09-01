import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { DetailsViewComponent } from '../details-view/details-view.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})

/**
 * this is the MovieCardComponent
 * @export
 * @class MovieCardComponent
 * @implements {OnInit}
 *
 */
export class MovieCardComponent implements OnInit {
  // TYPES are set to any for now, but can be changed to more specific types later
  navbarHeight: number = 95;
  movies: Array<any> = [];
  favoriteStatus: { [movieId: string]: boolean } = {};
  user: any = {};
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (!user) {
      this.router.navigate(['welcome']);
    }

    /**
     * Fetches all movies using the API call fetchApiData.getAllMovies()
     * @function getAllMovies
     * @returns an object array of all movies
     * @method updateFavoriteStatus
     * @method getFavoriteMovies
     */
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.updateFavoriteStatus();
      this.getFavoriteMovies();
    });
  }

  /**
   * Fetches all favorite movies using the API call fetchApiData.getUser()
   * @function getFavoriteMovies
   * @returns an object array of all favorite movies
   * @method updateFavoriteStatus
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.favoriteMovies = resp.filter((movie: any) =>
          this.user.FavoriteMovies.includes(movie._id)
        );
        this.updateFavoriteStatus();
        return this.favoriteMovies;
      });
    });
  }

  /**
   * Determines if a movie id is in the user's favorites list or not
   * @param {string} movieId of movie
   * @returns boolean showing movie id is true or false
   */
  isFavorite(movieId: string): boolean {
    return this.favoriteStatus[movieId] === true;
  }

  /**
   * Updates favoriteStatus object with movie id and boolean value
   * @function updateFavoriteStatus
   * @returns favoriteStatus object
   */
  updateFavoriteStatus(): void {
    this.favoriteMovies.forEach((movie: any) => {
      this.favoriteStatus[movie._id] = true;
    });
  }

  /**
   * Adds movie to user's favorite movies list using the API call fetchApiData.addFavMovie()
   * @function addToFavorites
   * @param {string} movieId of movie
   * @returns favoriteStatus object
   * @method updateFavoriteStatus
   */
  addToFavorites(movieId: string): void {
    const username = localStorage.getItem('Username');

    if (username) {
      this.fetchApiData.addFavoriteMovie(movieId).subscribe({
        next: () => {
          this.favoriteStatus[movieId] = true;
          this.snackbar.open('Added to favorites!', 'OK', {
            duration: 2000,
          });
        },
        error: (error) => {
          console.error(error);
          this.snackbar.open(error, 'OK', {
            duration: 2000,
          });
        },
        complete: () => {
          // Handle completion if needed
        },
      });
    } else {
      console.warn('Username is not available.');
    }
  }

  /**
   * Removes movie from user's favorite movies list using the API call fetchApiData.deleteFavMovie()
   * @function removeFromFavorites
   * @param {string} movieId of movie
   * @returns favoriteStatus object
   * @method updateFavoriteStatus
   */
  removeFromFavorites(movieId: string): void {
    const username = localStorage.getItem('Username');

    if (username) {
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe({
        next: () => {
          this.favoriteStatus[movieId] = false;
          this.snackbar.open('Removed from favorites!', 'OK', {
            duration: 2000,
          });
        },
        error: (error) => {
          console.error(error);
          this.snackbar.open(error, 'OK', {
            duration: 2000,
          });
        },
      });
    } else {
      console.warn('Username is not available.');
    }
  }

  /**
   * Opens dialog to display genre details
   * @function openGenre
   * @param {string} name of specific Genre
   * @param {string} description of specific Genre
   * @returns GenreViewComponent
   */
  openGenre(name: string, description: string): void {
    this.dialog.open(GenreViewComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '600px',
    });
  }

  /**
   * Opens dialog to display director details
   * @function openDirector
   * @param {string} name of director
   * @param {string} bio of director
   * @param {string} birthday of director
   * @returns DirectorViewComponent
   */
  openDirector(name: string, bio: string, birthday: string): void {
    this.dialog.open(DirectorViewComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birthday: birthday,
      },
      width: '600px',
    });
  }

  /**
   * Opens dialog to display movie details
   * @function openDetails
   * @param {string} title of movie
   * @param {string} description of movie
   * @returns DetailsViewComponent
   */
  openDetails(title: string, description: string): void {
    this.dialog.open(DetailsViewComponent, {
      data: {
        Title: title,
        Description: description,
      },
      width: '600px',
    });
  }
}
