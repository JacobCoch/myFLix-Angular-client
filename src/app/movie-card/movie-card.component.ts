import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { DetailsViewComponent } from '../details-view/details-view.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
  /**
   * variables below will manage data received from the API calls
   * @movies stores movies from the db
   */
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    private router: Router
  ) {}

  //ngOnInit is called when Angular is done creating the component
  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (!user) {
      this.router.navigate(['welcome']);
    }
    this.getMovies();
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
    return this.fetchApiData.getFavoriteMovies(id);
  }

  /**
   * Adds movie to user's favorite movies list using the API call fetchApiData.addFavMovie()
   * @function addToFavorites
   * @param id of movie, type: string
   */
  addToFavorites(id: string): void {}
  removeFromFavorites(id: string): void {}

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
