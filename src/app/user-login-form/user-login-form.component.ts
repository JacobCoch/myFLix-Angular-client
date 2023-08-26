import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
// close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
// call the API
import { FetchApiDataService } from '../fetch-api-data.service';
//display notification back to user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() loginData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.fetchApiData.userLogin(this.loginData).subscribe(
      (result) => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        console.log(result.user, result.token);
        this.dialogRef.close();
        this.router.navigate(['movies']);
        this.snackBar.open('User logged in successfully!', 'OK', {
          duration: 2000,
        });
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
