/**
 * this component renders the welcome page
 * @export
 * @class WelcomePageComponent
 * @implements {OnInit}
 *
 * This component imports the the following components:
 * @component UserRegistrationFormComponent
 * @component UserLoginFormComponent
 *
 * the following methods are defined:
 * @method openUserRegistrationDialog()
 * @method openLoginDialog()
 *
 */

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  ngOnInit(): void {}

  // This method will open the dialog to open the UserRegistrationFormComponent
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  // This method will open the dialog to open the UserLoginFormComponent
  openLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
