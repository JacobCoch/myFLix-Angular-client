import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  initialInput: any = {};
  favorites: any = [];

  @Input() userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  getUserInfo(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      this.user.Username = this.user.Username;
      this.user.Email = this.user.Email;
      this.user.Birthday = formatDate(
        this.user.Birthday,
        'yyyy-MM-dd',
        'en-US',
        'UTC+0'
      );
      this.favorites = this.user.FavoriteMovies;
      return this.user;
    });
  }

  // updateUser(): void {
  //   this.fetchApiData.editUser(this.userData).subscribe((resp: any) => {
  //     console.log(resp);
  //     if (
  //       this.user.Username !== resp.Username ||
  //       this.user.Username !== resp.Password
  //     ) {
  //       localStorage.clear();
  //       this.router.navigate(['welcome']);
  //       this.snackBar.open(
  //         'Profile updated successfully! Please log in again.',
  //         'OK',
  //         {
  //           duration: 2000,
  //         }
  //       );
  //     } else {
  //       this.snackBar.open('User information has been updated!', 'OK', {
  //         duration: 2000,
  //       });
  //     }
  //   });
  // }

  // deleteAccount(): void {
  //   if (confirm('All your data will be lost - this cannout be undone!')) {
  //     this.router.navigate(['welcome']).then(() => {
  //       this.snackBar.open(
  //         'You have successfully deleted your account - we are sorry to see you go!',
  //         'OK',
  //         {
  //           duration: 2000,
  //         }
  //       );
  //     });
  //     this.fetchApiData.deleteUser().subscribe((resp: any) => {
  //       console.log(resp);
  //       localStorage.clear();
  //     });
  //   }
  // }
}
