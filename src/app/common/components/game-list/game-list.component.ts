import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {
  games: Game[] = []
  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    this.getAllGames()
  }

  getAllGames() {
    this.gameService.getAll()
    .subscribe({
      next: (response) => {
        if(response) {
          this.games = response
        }
      }, error: (error) => {
        console.log(error)
      }
    })
  }
}
