import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LudoRoutingModule } from './ludo-routing.module';
import { LudoHomeComponent } from './components/ludo-home/ludo-home.component';
import { ButtonModule } from 'primeng/button';
import { AnimateModule } from 'primeng/animate';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { LudoConfigComponent } from './components/ludo-config/ludo-config.component';
import { LudoPassPlayComponent } from './components/ludo-pass-play/ludo-pass-play.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LudoService } from './services/ludo.service';
import { LudoOnlineComponent } from './components/ludo-online/ludo-online.component';
import { LudoBoardComponent } from './components/ludo-board/ludo-board.component';
import { LudoDiceComponent } from './components/ludo-dice/ludo-dice.component';
import { LudoSearchingComponent } from './components/ludo-searching/ludo-searching.component';
import { DiceDirective } from './directives/dice.directive';

@NgModule({
  declarations: [
    LudoHomeComponent,
    LudoConfigComponent,
    LudoPassPlayComponent,
    LudoOnlineComponent,
    LudoBoardComponent,
    LudoDiceComponent,
    LudoSearchingComponent,
    DiceDirective
  ],
  imports: [
    CommonModule,
    LudoRoutingModule,
    ButtonModule,
    AnimateModule,
    DynamicDialogModule,
    RadioButtonModule,
    FormsModule,
    SelectButtonModule,
    ReactiveFormsModule
  ],
  providers: [
    DialogService,
    LudoService
  ]
})
export class LudoModule { }
