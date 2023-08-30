/**
 * This component renders the user registration form
 * @export
 * @class UserRegistrationFormComponent
 * @implements {OnInit}
 *
 * This component imports the following components:
 * @component FetchApiDataService
 *
 * the following methods are defined:
 * @method registerUser()
 *
 */

import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// call the API
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  // Input is a decorator that defines the components input
  @Input() userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: new Date().toISOString(),
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  // This is the default function that is executed once the component is initialized
  ngOnInit(): void {}

  /**
   * This is the function responsible for sending the form inputs to the backend
   * @method registerUser
   *
   * @returns
   *
   */
  registerUser(): void {
    this.userData.Birthday = this.userData.Birthday.slice(0, 10);
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      console.log(result.Username);
      this.dialogRef.close(); // This will close the modal on success!
      this.snackBar
        .open('Welcome, ' + result.Username + '!', 'OK', {
          duration: 4000,
        })
        .afterDismissed()
        .subscribe(() => {
          this.snackBar.open('Please login!', 'OK', {
            duration: 4000,
          });
        });
    });
  }
}
