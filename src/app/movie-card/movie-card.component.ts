import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { DetailsViewComponent } from '../details-view/details-view.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
/**
 * defines the movie card component
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
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

  //ngOnInit is a lifecycle hook that runs when the component initializes
  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (!user) {
      this.router.navigate(['welcome']);
    }
    this.getMovies();
    this.updateFavoriteStatus();
    this.getFavoriteMovies();
  }

  /**
   * Fetches all movies using the API call fetchApiData.getAllMovies()
   * @function getMovies
   * @returns an object array of all movies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.favoriteMovies = resp.filter((movie: any) =>
          this.user.FavoriteMovies.includes(movie._id)
        );
        return this.favoriteMovies;
      });
    });
  }

  /**
   * Opens dialog to display genre details
   * @param name of specfic Genre
   * @param description of specific Genre
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
   * @param name of director
   * @param bio of director
   * @param birthday of director
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
   * Determines if a movie id is in the user's favorites list or not
   * @param id of movie, type: string
   * @returns boolean showing movie id is true or false
   */
  isFavorite(id: string): boolean {
    return this.favoriteStatus[id] === true;
  }

  /**
   * Updates favoriteStatus object with movie id and boolean value
   * @function updateFavoriteStatus
   * @returns favoriteStatus object
   */
  updateFavoriteStatus(): void {
    const username = localStorage.getItem('Username');

    if (username) {
      this.fetchApiData.getFavoriteMovies(username).subscribe(
        (response) => {
          this.favoriteStatus = {}; // Reset the favoriteStatus
          response.forEach((movie: any) => {
            this.favoriteStatus[movie._id] = true; // Set movies as favorite
          });
        },
        (error) => {
          console.error('Error fetching favorite movies:', error);
        }
      );
    } else {
      console.warn('Username is not available.');
    }
  }

  /**
   * Adds movie to user's favorite movies list using the API call fetchApiData.addFavMovie()
   * @function addToFavorites
   * @param id of movie, type: string
   */
  addToFavorites(id: string): void {
    const username = localStorage.getItem('Username');

    if (username) {
      this.fetchApiData.addFavoriteMovie(id).subscribe(
        () => {
          this.favoriteStatus[id] = true;
          this.snackbar.open('Added to favorites!', 'OK', {
            duration: 2000,
          });
        },
        (error) => {
          console.error(error);
          this.snackbar.open(error, 'OK', {
            duration: 2000,
          });
        }
      );
    } else {
      console.warn('Username is not available.');
    }
  }

  removeFromFavorites(id: string): void {
    const username = localStorage.getItem('Username');

    this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
      this.favoriteStatus[id] = false; // Update favoriteStatus when movie is removed
      this.snackbar.open('Removed from favorites!', 'OK', {
        duration: 2000,
      });
    });
  }

  /**
   * Opens dialog to display movie details
   * @param title of movie
   * @param description of movie
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
