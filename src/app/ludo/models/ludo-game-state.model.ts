import { LudoPlayer } from './ludo-player';
export class LudoGameState {
  id: string;
  roomId: string;
  status: string;
  players: LudoPlayer[];
  diceValue: number;
  turn: string;
  action: any
  constructor({
    id,
    roomId,
    status,
    players,
    diceValue,
    turn,
    action
  }: {
    id: string;
    roomId: string;
    status: string;
    players: LudoPlayer[];
    diceValue: number,
    turn: any,
    action: any
  }) {
    this.id = id
    this.roomId = roomId
    this.status = status
    this.players = players
    this.diceValue = diceValue
    this.turn = turn
    this.action = action
  }
}
