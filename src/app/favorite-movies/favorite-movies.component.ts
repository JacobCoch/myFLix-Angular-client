import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GenreViewComponent } from '../genre-view/genre-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { DetailsViewComponent } from '../details-view/details-view.component';

@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.scss'],
})
export class FavoriteMoviesComponent implements OnInit {
  favoriteMovies: any[] = [];
  user: any = {};

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getFavoriteMovies();
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

  isFavorite(id: string): boolean {
    return this.user.FavoriteMovies.includes(id);
  }

  addToFavorites(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((resp: any) => {
      this.snackBar.open('Added to favorites!', 'OK', {
        duration: 2000,
      });
    });
  }

  removeFromFavorites(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe((resp: any) => {
      this.snackBar.open('Removed from favorites!', 'OK', {
        duration: 2000,
      });
    });
    this.ngOnInit();
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
      width: '400px',
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
        Birth: birthday,
      },
      width: '400px',
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
      width: '400px',
    });
  }
}
