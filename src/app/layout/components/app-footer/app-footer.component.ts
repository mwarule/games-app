import { Component } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent {
  constructor(public layoutService: LayoutService) { }
}
