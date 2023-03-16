import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GAMES } from 'src/app/common/helpers/constants';
import { LudoConfigComponent } from '../ludo-config/ludo-config.component';
import { LudoPassPlayComponent } from '../ludo-pass-play/ludo-pass-play.component';

@Component({
  selector: 'app-ludo-home',
  templateUrl: './ludo-home.component.html',
  styleUrls: ['./ludo-home.component.scss']
})
export class LudoHomeComponent implements OnInit {
  types: any = [{
    id: '1',
    name: 'Pass N Play',
    description: 'Play with your friends offline. You can play with 2, 3 and 4 players.',
    icon: 'fa-people-arrows'
  },
  {
    id: '2',
    name: 'Play Online',
    description: 'Play with other players that are online. You can play with 2 or more players.',
    icon: 'fa-computer'
  },
  {
    id: '3',
    name: 'Play with friends',
    description: 'Invite and play with your friends online in a room. You can play with 2 or more friends.',
    icon: 'fa-person-shelter'
  },
  {
    id: '4',
    name: 'Computer Bots',
    description: 'Play with computer generated bots.',
    icon: 'fa-robot'
  }]
  ref!: DynamicDialogRef;
  @Input() game: any
  constructor(public dialogService: DialogService) {

  }

  ngOnInit(): void {
  }

  onClick(gameType: any) {
    let component: any = LudoConfigComponent
    if (gameType.id === '1') {
      component = LudoPassPlayComponent
    }
    this.ref = this.dialogService.open(component, {
      header: gameType.name,
      width: '30vw',
      contentStyle: { "overflow": "auto" },
      baseZIndex: 10000,
      maximizable: true
    });
    return false
  }

}
