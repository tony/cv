import { Component, OnInit } from '@angular/core';
import { IActivity } from '@lib/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular';
  activities: IActivity[] = [];
  async ngOnInit() {
    console.log('ngOnInit');
    const { myActivities } = await import(/* webpackChunkName: "myData" */ '@lib/data');
    console.log({ myActivities });
    this.activities = myActivities;
  }
}
