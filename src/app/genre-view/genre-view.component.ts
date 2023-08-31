import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-view',
  templateUrl: './genre-view.component.html',
  styleUrls: ['./genre-view.component.scss'],
})

/**
 * This is the GenreViewComponent
 * @export
 * @class GenreViewComponent
 * @implements {OnInit}
 * @contructor {Inject}
 * @param {MAT_DIALOG_DATA}
 * @returns {string} Name
 * @returns {string} Description
 */
export class GenreViewComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string;
      Description: string;
    }
  ) {}

  ngOnInit(): void {}
}
