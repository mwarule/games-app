import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Game } from "../models/game";
import { io } from "socket.io-client";

const apiBaseUrl = `http://localhost:4200/api`

@Injectable({ providedIn: 'root' })
export class GameService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  socket = io('http://localhost:8080');
  constructor(
    private http: HttpClient
  ) {
  }

  getAll(): Observable<Game[]> {
    return this.http.get<Game[]>(`${apiBaseUrl}/games`);
  }

  public sendMessage(message: any) {
    console.log('sendMessage: ', message)
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    this.socket.on('message', (message) =>{
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };
}
