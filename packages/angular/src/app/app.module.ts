import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { MyNav } from '@tony/cv-nav/components';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [Title],
  bootstrap: [AppComponent, MyNav],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
