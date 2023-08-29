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
  navbarHeight: number = 95;
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

  getUserInfo(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      resp.Birthday = formatDate(resp.Birthday, 'MM-dd-yyyy', 'en-US');
    });
  }

  updateUser(): void {
    if (!this.isValidUserData(this.userData)) {
      this.snackBar.open('Please fill out all fields!', 'OK', {
        duration: 2000,
      });
      return;
    }

    this.fetchApiData.editUser(this.userData).subscribe(
      (resp: any) => {
        this.snackBar.open('User information has been updated!', 'OK', {
          duration: 2000,
        });

        // Update only the modified fields in local storage
        const userString = localStorage.getItem('user');
        if (userString) {
          const currentUser = JSON.parse(userString);
          const updatedUser = { ...currentUser, ...this.userData };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        this.router.navigate(['movies']);
      },
      (error) => {
        console.error('Error updating user:', error);
        // Handle error gracefully, show error message to user, etc.
      }
    );
  }

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

  private isValidUserData(userData: any): boolean {
    return (
      userData.Username &&
      userData.Password &&
      userData.Email &&
      userData.Birthday
    );
  }
}
