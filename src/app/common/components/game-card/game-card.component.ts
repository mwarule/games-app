import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: '[app-game-card]',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit {
  @Input() item: any;
  @Input() index!: number;
  imagePath: string = `assets/images/`
  buttonLabel: string = 'Play'
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.buttonLabel = this.item.active ? 'Play': 'Coming soon'
  }

  onClick(item: any) {
    const routerLink = this.getGameLink(item.name)
    this.router.navigate([routerLink])
  }

  getGameLink(name:string) {
    switch(name) {
      case 'Ludo King': {
        return 'ludo'
      }
      case 'Snakes and Ladders': {
        return 'snakes-and-ladders'
      }
      default: {
        return ''
      }
    }
  }

}
