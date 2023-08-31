import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})

/**
 * Defines the component responsible for the welcome page (the first page the user sees)
 * @export
 * @class WelcomePageComponent
 * @implements {OnInit}
 *
 */
export class WelcomePageComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  ngOnInit(): void {}

  /**
   * This method will open the dialog to open the UserRegistrationFormComponent
   * @method openUserRegistrationDialog
   * @returns a dialog box
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  /**
   * This method will open the dialog to open the UserLoginFormComponent
   * @method openLoginDialog
   * @returns a dialog box
   */
  openLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
