import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})

/**
 * This is the NavBarComponent
 * @export
 * @class NavBarComponent
 * @implements {OnInit}
 */
export class NavBarComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit(): void {}

  /**
   * This function is responsible for navigating to the movies view
   * @function toMovies
   * @returns navigates to movies view
   */
  toMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * This function is responsible for navigating to the user profile view
   * @function toProfile
   * @returns navigates to profile view
   */
  toProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * This function is responsible for navigating to the welcome view
   * @function logout
   * @returns navigates to welcome view
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
}
