import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { CVNav } from '@tony/cv-nav';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [Title],
  bootstrap: [AppComponent, CVNav],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
