import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { DetailsViewComponent } from '../details-view/details-view.component';

@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.scss'],
})

/**
 * This is the FavoriteMoviesComponent
 * @export
 * @class FavoriteMoviesComponent
 * @implements {OnInit}
 *
 */
export class FavoriteMoviesComponent implements OnInit {
  // TYPES are set to any for now, but can be changed to more specific types later
  favoriteMovies: any[] = [];
  user: any = {};
  favoriteStatus: { [movieId: string]: boolean } = {};
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackbar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (!user) {
      this.router.navigate(['welcome']);
    }

    /**
     * Fetches all movies using the API call fetchApiData.getAllMovies()
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
   * isFavorite() determines if a movie id is in the user's favorites list or not
   * @param {string} id of movie
   * @returns boolean showing movie id is true or false
   */
  isFavorite(id: string): boolean {
    return this.user.FavoriteMovies.includes(id);
  }

  /**
   * Adds movie to user's favorite movies list using the API call fetchApiData.addFavMovie()
   * @function addToFavorites
   * @param {string} id of movie
   * @method updateFavoriteStatus
   */
  addToFavorites(id: string): void {
    const username = localStorage.getItem('Username');

    if (username) {
      this.fetchApiData.addFavoriteMovie(id).subscribe({
        next: () => {
          this.favoriteStatus[id] = true;
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
   * removeFromFavorites() removes movie from user's favorite movies list using the API call fetchApiData.deleteFavMovie()
   * @function removeFromFavorites
   * @param {string} id of movie
   * @method updateFavoriteStatus
   * @method getFavoriteMovies
   */
  removeFromFavorites(id: string): void {
    const username = localStorage.getItem('Username');
    if (username) {
      this.fetchApiData.deleteFavoriteMovie(id).subscribe({
        next: () => {
          this.favoriteStatus[id] = false;
          this.snackbar.open('Removed from favorites!', 'OK', {
            duration: 2000,
          });
          this.favoriteMovies = this.favoriteMovies.filter(
            (movie) => movie._id !== id
          );
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
   * @param {string} name of genre
   * @param {string} description of genre

   * @returns genre details
   */
  openGenre(name: string, description: string): void {
    this.dialog.open(GenreViewComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '400px',
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
        Birth: birthday,
      },
      width: '400px',
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
      width: '400px',
    });
  }
}
