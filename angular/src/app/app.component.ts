import { Component, OnInit } from '@angular/core';
import { IActivity } from '@lib/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular';
  activities: IActivity[] = [];
  async ngOnInit() {
    console.log('ngOnInit');
    const { activities } = await import(/* webpackChunkName: "cvData" */ '@lib/data/raw');
    console.log({ activities });
    this.activities = activities;
  }
}
