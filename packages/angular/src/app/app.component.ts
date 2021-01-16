import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import type { IActivity } from '@tony/cv-lib/data/types';

import '@tony/cv-nav/components';

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
    const { activities } = await import(/* webpackChunkName: "cvData" */ '@lib/data/raw');
    console.log({ activities });
    this.activities = activities;
  }
}
