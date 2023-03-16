import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LudoHomeComponent } from './components/ludo-home/ludo-home.component';
import { LudoOnlineComponent } from './components/ludo-online/ludo-online.component';

const routes: Routes = [
  { path: '', component: LudoHomeComponent },
  { path: 'online', component: LudoOnlineComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LudoRoutingModule { }
