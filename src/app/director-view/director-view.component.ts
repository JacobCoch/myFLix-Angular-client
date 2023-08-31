import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director-view',
  templateUrl: './director-view.component.html',
  styleUrls: ['./director-view.component.scss'],
})

/**
 * This is the DirectorViewComponent
 * @export
 * @class DirectorViewComponent
 * @implements {OnInit}
 * @contructor {Inject}
 * @param {MAT_DIALOG_DATA}
 * @returns {string} Name
 * @returns {string} Bio
 * @returns {string} Birthday
 */
export class DirectorViewComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Bio: string;
      Birthday: string;
    }
  ) {}

  ngOnInit(): void {}
}
