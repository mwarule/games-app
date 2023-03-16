import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameListComponent } from './components/game-list/game-list.component';
import { GameCardComponent } from './components/game-card/game-card.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    GameListComponent,
    GameCardComponent,
    NotFoundComponent
  ],
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  imports: [
    CommonModule,
    ButtonModule
  ],
  exports: [
    GameListComponent,
    GameCardComponent,
    NotFoundComponent
  ]
})
export class AppCommonModule { }
