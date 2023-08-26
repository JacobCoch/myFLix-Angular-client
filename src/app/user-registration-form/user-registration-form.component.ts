import { Component, OnInit, Input } from '@angular/core';
// close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
// call the API
import { FetchApiDataService } from '../fetch-api-data.service';
//display notification back to user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  // Input is a decorator that defines the components input
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  // This is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        this.dialogRef.close(); // This will close the modal on success!
        this.snackBar.open(result, 'User created!', {
          duration: 2000,
        });
      },
      (result) => {
        console.log(result.error); // Log the error object for more details
        const errorMessage = result.error.message || 'An error occurred';
        this.snackBar.open(errorMessage, 'OK', {
          duration: 5000, // Increase duration to give more time to read the error message
        });
      }
    );
  }
}
