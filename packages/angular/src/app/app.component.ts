import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import type { IActivity } from '@tony/cv-data/types';

import '@tony/cv-nav';

declare const __TITLE__: string;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: string = __TITLE__;
  activities: IActivity[] = [];
  public constructor(private titleService: Title) {
    titleService.setTitle(__TITLE__);
  }

  async ngOnInit() {
    console.log('ngOnInit');
    const { activities } = await import(/* webpackChunkName: "cvData" */ '@tony/cv-data/raw');
    console.log({ activities });
    this.activities = activities;
  }
}
