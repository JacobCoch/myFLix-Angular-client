import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';

import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})

/**
 * This is the component responsible for the user profile view
 * @export
 * @class UserProfileComponent
 * @implements {OnInit}
 *
 */
export class UserProfileComponent implements OnInit {
  // TYPES are set to any for now, but can be changed to more specific types later
  navbarHeight: number = 95; // for the sticky navbar
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

  ngOnInit(): void {
    this.getUserInfo();
  }

  /**
   * Fetches user information using the API call fetchApiData.getUser()
   * @function getUserInfo
   * @returns an object of user information
   */
  getUserInfo(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      resp.Birthday = formatDate(resp.Birthday, 'MM-dd-yyyy', 'en-US');
    });
  }

  /**
   * this validates that all fields are filled out
   * @function isValidUserData
   * @param {any} userData
   */
  private isValidUserData(userData: any): boolean {
    return (
      userData.Username &&
      userData.Password &&
      userData.Email &&
      userData.Birthday
    );
  }
  /**
   * Updates user information using the API call fetchApiData.editUser()
   * @function updateUser
   * @returns a success or error message
   */
  updateUser(): void {
    if (!this.isValidUserData(this.userData)) {
      this.snackBar.open('Please fill out all fields!', 'OK', {
        duration: 2000,
      });
      return;
    }

    // if user has not changed any fields, do not make API call
    this.fetchApiData.editUser(this.userData).subscribe({
      next: (resp: any) => {
        this.snackBar.open('User information has been updated!', 'OK', {
          duration: 2000,
        });

        const userString = localStorage.getItem('user');
        if (userString) {
          const currentUser = JSON.parse(userString);
          const updatedUser = { ...currentUser, ...this.userData };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        this.router.navigate(['movies']);
      },
      error: (error) => {
        console.error('Error updating user:', error);
      },
    });
  }

  /**
   * Deletes user account using the API call fetchApiData.deleteUser()
   * @function deleteAccount
   * @returns a success or error message
   */
  deleteAccount(): void {
    if (confirm('All your data will be lost - this cannout be undone!')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account - we are sorry to see you go!',
          'OK',
          {
            duration: 2000,
          }
        );
      });
      this.fetchApiData.deleteUser().subscribe((resp: any) => {
        console.log(resp);
        localStorage.clear();
      });
    }
  }
}
