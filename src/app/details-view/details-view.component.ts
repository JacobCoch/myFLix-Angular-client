import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.scss'],
})

/**
 * This is the DetailsViewComponent
 * @export
 * @class DetailsViewComponent
 * @implements {OnInit}
 * @contructor {Inject}
 * @param {MAT_DIALOG_DATA}
 * @returns {string} Title
 * @returns {string} Description
 */
export class DetailsViewComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Title: string;
      Description: string;
    }
  ) {}

  ngOnInit(): void {}
}
