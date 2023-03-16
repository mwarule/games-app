import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationModule } from './authentication/authentication.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DashboardModule } from './dashboard/dashboard.module';
import { MessageService } from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import { ErrorInterceptor } from './common/helpers/error.interceptor';
import { NotFoundComponent } from './common/components/not-found/not-found.component';
import { LayoutModule } from './layout/layout.module';
import { CommonModule } from '@angular/common';
import { GameListComponent } from './common/components/game-list/game-list.component';
import { GameCardComponent } from './common/components/game-card/game-card.component';
import { AppCommonModule } from './common/app-common.module';
import { LudoModule } from './ludo/ludo.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DashboardModule,
    ToastModule,
    LayoutModule,
    AppCommonModule,
    LudoModule
  ],
  providers: [
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
