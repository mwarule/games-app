export class LudoPlayer {
  id: string;
  name: string;
  pawns: [];
  boardPosition!: number;
  color: string;
  score: number;
  constructor({
    id,
    name,
    pawns,
    boardPosition,
    color,
    score
  }: {
    id: string;
    name: string;
    pawns: [];
    boardPosition: number,
    color: string,
    score: number;
  }) {
    this.id = id;
    this.name = name;
    this.pawns = pawns;
    this.color = color
    this.boardPosition = boardPosition;
    this.score = score;
  }
}
