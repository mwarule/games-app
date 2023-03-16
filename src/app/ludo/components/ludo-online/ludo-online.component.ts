import { Component, ComponentRef, OnInit, ViewChild, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { LudoService } from '../../services/ludo.service';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Subject, takeUntil, BehaviorSubject, Observable, Subscription, fromEvent } from 'rxjs';
import { LudoGameState } from '../../models/ludo-game-state.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LudoDiceComponent } from '../ludo-dice/ludo-dice.component';
import { LudoBoardComponent } from '../ludo-board/ludo-board.component';
import { BOARD_HOUSE_COLORS, getAllPawnsForPlayer, getPawnForPlayer, PAWNS_COUNT } from '../../utils/ludo-utils';
import { LudoPlayer } from '../../models/ludo-player';
import { DiceDirective } from '../../directives/dice.directive';

@Component({
  selector: 'app-ludo-online',
  templateUrl: './ludo-online.component.html',
  styleUrls: ['./ludo-online.component.scss']
})
export class LudoOnlineComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  gameState!: LudoGameState
  @ViewChild('boardComponent', {static: false}) boardComponent!: LudoBoardComponent
  currentPlayer!: LudoPlayer
  diceValueSubject: Subject<{value: number, check: boolean}> = new Subject<{value: number, check: boolean}>()
  @ViewChild(DiceDirective, { static: false }) dice!: DiceDirective;
  diceRefs: ComponentRef<LudoDiceComponent>[] = []
  hasClass = false
  message: string = ''
  constructor(
    public authService: AuthenticationService,
    private ludoService: LudoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router) {}

  ngOnInit(): void {
  }

  checkState() {
    this.route.queryParams.subscribe(params => {
      const stateParam = params['gameState']
      const state: LudoGameState = JSON.parse(stateParam)
      if(state && state.id && state.players.length > 0 && state.status === 'READY') {
        this.gameState = state
        this.cdr.detectChanges()
        this.checkGameStatus()
      } else {
        this.router.navigate(['/'])
      }
    });
  }

  checkGameStatus() {
    const status = this.gameState.status
    if(status === 'READY') {
      let count = 5
      let interval = setInterval(() => {
        this.message = `Your game will start in ${count} seconds.`
        count--
        if(count === 0) {
          clearInterval(interval)
          this.startGame()
        }
      }, 1000)
      this.subscribeGameState()
    } else if(status === 'GAME_OVER') {
      this.message = 'The game has ended. Please visit home page to play another game.'
    } else {}
  }

  loadDices() {
    const _viewContainerRef = this.dice.viewContainerRef;
    _viewContainerRef.clear();
    this.players.forEach(player => {
      const diceComponentRef = _viewContainerRef.createComponent<LudoDiceComponent>(LudoDiceComponent);
      diceComponentRef.instance.player = player
      this.diceRefs.push(diceComponentRef);
      diceComponentRef.instance.diceValueChanged.subscribe(value => {
       this.diceClicked(value)
      })
      diceComponentRef.changeDetectorRef.detectChanges()
    })
  }

  activateDice(id: string) {
    const ref = this.diceRefs.find(r => r.instance.player.id === id)
    if(ref) {
      ref.instance.activateDice = true
    }
  }

  onBoardEmitter(data: any) {
    const action = data.action
    switch(action) {
      case 'currentTurn': {
        this.activateDice(this.currentPlayer.id)
        return
      }
      case 'nextTurn': {
        this.ludoService.ludoTurn(this.turn)
        return
      }
      case 'movePawn': {
        const value = {
          ...data.value,
          kill: false
        }
        this.ludoService.movePawn(value)
        return
      }
      case 'killPawn': {
        const value = {
          ...data.value,
          kill: true
        }
        this.ludoService.movePawn(value)
        return
      }
      case 'updatePawn': {
        const value = data.value
        this.ludoService.updatePawn(value)
        return
      }
      case 'updateScore': {
        const value = data.value
        this.ludoService.updateScore(value)
        return
      }
      case 'winner': {
        const id = data.value
        this.ludoService.playerWon(id)
        return
      }
      case 'gameOver': {
        this.ludoService.gameOver(this.gameState.id)
        return
      }
    }
  }

  ngAfterViewInit() {
    this.checkState()
  }

  startGame() {
    this.ludoService.startGame()
  }

  subscribeGameState() {
    this.ludoService.getGameState()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if(data) {
        this.gameState = data
        this.initPlayerBoardPosition()
        if(!this.diceRefs.length) {
          setTimeout(() => {
            this.loadDices()
          }, 0);
        }
        setTimeout(() => {
          this.onGameStateChanged()
        }, 0);
      }
    })
  }

  set turn(turn: string) {
    this.gameState.turn = turn
  }

  handleDiceValue() {
    if(this.gameState.diceValue) {
      this.diceValueSubject.next({
        value: this.diceValue,
        check: false
      })
      const ref = this.diceRefs.find(r => r.instance.player.id === this.currentPlayer.id)
      if(ref) {
        ref.instance.rollDice(this.diceValue)
      }
    }
  }

  diceClicked(value: number) {
    this.diceValue = value
    this.ludoService.emitDiceValue(value)
    this.diceValueSubject.next({
      value: this.diceValue,
      check: true
    })
  }


  set diceValue(value: number) {
    this.gameState.diceValue = value
  }

  get diceValue() {
    return this.gameState ? this.gameState.diceValue : 0
  }

  get myTurn() {
    return this.currentPlayer.id === this.authService.userValue?.id
  }

  onGameStateChanged() {
    console.log(this.gameState)
    const status = this.gameState.status
    const action = this.gameState.action
    if(status === 'STARTED') {
      this.checkAction(action)
    } else if(status === 'GAME_OVER') {
      console.log('GAME OVER')
    }
  }

  checkAction(action: any) {
    const key = action && action.key ? action.key : null
    if(key) {
      switch(key) {
        case 'TURN': {
          this.handleTurn()
          return
        }
        case 'DICE': {
          this.handleDiceValue()
          return
        }
        case 'MOVE_PAWN': {
          this.handleMovePawn()
          return
        }
        case 'KILL_PAWN': {
          this.handleMovePawn(true)
          return
        }
        case 'PLAYER_WON': {
          this.handlePlayerWon()
        }
      }
    }
  }

  handlePlayerWon() {
    const id = this.gameState.action.value
    if(id) {
      const player = this.players.find(p => p.id === id)
      if(player) {
        this.boardComponent.displayPlayerWin(player)
      }
    }
  }

  handleTurn() {
    this.currentPlayer = this.players.find(p => p.id === this.gameState.turn)!
    if(this.myTurn) {
      this.activateDice(this.currentPlayer.id)
    }
  }

  handleMovePawn(kill: boolean = false) {
    const pawn = this.gameState.action.value
    const method = kill ? 'animateKill' : 'movePawn'
    if(pawn) {
      const panwObject: fabric.Object = this.boardComponent.canvas.getObjects().find(o => o.data && o.data.id === pawn.id && o.data.playerId === pawn.playerId)!
      this.boardComponent[method](panwObject)
      .then(data => {
        console.log('pawn moved/killed')
      })
    }
  }

  emitGameState(){
    this.ludoService.emitGameState(this.gameState)
  }

  get players(): LudoPlayer[] {
    return this.gameState && this.gameState.players ? this.gameState.players : []
  }

  set players(players: LudoPlayer[]) {
    this.gameState.players = players
  }

  get loggedInUser() {
    return this.authService.userValue
  }
  get turn() {
    return this.gameState.turn
  }

  initPlayerBoardPosition() {
    let boardPosition = 1
    const currentPlayerIndex = this.players.findIndex(p => p.id === this.loggedInUser?.id)
    if(currentPlayerIndex > -1) {
      this.players[currentPlayerIndex].boardPosition = boardPosition
    }
    boardPosition = 2
    for(let i = currentPlayerIndex+1; i < PAWNS_COUNT; i++) {
      if(this.players[i]) {
       this.players[i].boardPosition = this.players.length > 2 ? boardPosition : 3
      }
      boardPosition++
    }
    for(let i = 0; i < currentPlayerIndex; i++) {
      this.players[i].boardPosition = this.players.length > 2 ? boardPosition : 3
      boardPosition++
    }
    this.players = this.players
  }
}
