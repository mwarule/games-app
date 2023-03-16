import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ludo-searching',
  templateUrl: './ludo-searching.component.html',
  styleUrls: ['./ludo-searching.component.scss']
})
export class LudoSearchingComponent {
  @Input() timer = 0
}
