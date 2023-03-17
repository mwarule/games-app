import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment';
import { LudoGameState } from '../models/ludo-game-state.model';
@Injectable({
  providedIn: 'root'
})
export class LudoService {
  socket: any = io(`${environment.SOCKET_URL}ludo`, {
    autoConnect: false,
    transports: ['websocket']
  })
  public ludoConnectStrem$: BehaviorSubject<string> = new BehaviorSubject('');
  public gameState$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() {
  }

  connect() {
    const user: any = localStorage.getItem('user');
    const token = user ? JSON.parse(user).accessToken : ''
    this.socket.auth = { token }
    this.socket.connect()
    this.handleErrors()
  }

  disconnect() {
    this.socket.disconnect()
  }

  handleErrors() {
    this.socket.on("connect_error", (err: any) => {
      console.log(err);
    });

    this.socket.on("error", (err: any) => {
      console.log(err);
    });
  }

  ludoConnect(data: any) {
    this.socket.emit('ludo-connect', data);
  }

  getLudoConnect() {
    this.socket.on('ludo-connect', (data: any) => {
      if(data) {
        this.ludoConnectStrem$.next(data);
      }
    });

    return this.ludoConnectStrem$.asObservable();
  };

  emitGameState(data: LudoGameState) {
    this.socket.emit('game-state', data)
  }

  getGameState() {
    this.socket.on('game-state', (data: any) => {
      if(data) {
        this.gameState$.next(data);
      }
    });

    return this.gameState$.asObservable();
  }


  ludoTurn(turn: string) {
    this.socket.emit('ludo-turn', turn)
  }

  emitDiceValue(value: number) {
    this.socket.emit('ludo-dice-value', value)
  }

  movePawn(pawn: any) {
    this.socket.emit('move-pawn', pawn)
  }

  playerWon(id: string) {
    this.socket.emit('player-won', id)
  }

  updatePawn(data: any) {
    this.socket.emit('update-pawn', data)
  }

  updateScore(data: any) {
    this.socket.emit('update-score', data)
  }

  gameOver(id: string) {
    this.socket.emit('game-over', id)
  }

  startGame() {
    this.socket.emit('start-game')
  }
}
