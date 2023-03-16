import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { fabric } from 'fabric';
import { LudoPlayer } from '../../models/ludo-player';
import { BOARD_HOUSE_COLORS, WIDTH, HEIGHT, BOARD_PATHS, BLOCK_SIZE, drawPawns, drawBoard, getAllPawnsOnCanvas, BOARD_SAFE_HOUSES, getAllPawnsForPlayer, PAWNS_COUNT, getOrientation } from '../../utils/ludo-utils';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../../../authentication/services/authentication.service';

@Component({
  selector: 'app-ludo-board',
  templateUrl: './ludo-board.component.html',
  styleUrls: ['./ludo-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LudoBoardComponent implements AfterViewInit {
  @Input() players: LudoPlayer[] = []
  canvas!: fabric.Canvas;
  @Input() diceValueObservable!: Observable<{ value: number, check: boolean }>
  diceValue: number = 0;
  @Input() currentPlayer!: LudoPlayer
  @Output() boardEmitter: EventEmitter<{ action: string, value?: any }> = new EventEmitter<{ action: string, value?: any }>()
  movementAudio: any
  resizeObservable$!: Observable<Event>
  resizeSubscription$!: Subscription
  @Output() canvasResized: EventEmitter<boolean> = new EventEmitter<boolean>()
  constructor(public cdr: ChangeDetectorRef,
    private authService: AuthenticationService) {
  }

  ngAfterViewInit(): void {
    this.drawLudoBoard()
    this.subscribeDiceValue()
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.resize()
      this.canvasResized.emit(true)
    })
    setTimeout(() => {
      this.resize()
      this.canvasResized.emit(true)
    }, 0);
  }

  resize() {
    const outerCanvasContainer = document.getElementById('layout-main')!
    let containerWidth = outerCanvasContainer.offsetWidth;
    let containerHeight  = outerCanvasContainer.offsetHeight ;
    if(containerWidth > containerHeight) {
      containerWidth = containerHeight
    }
    console.log('containerWidth')
    console.log(containerWidth)
    console.log('containerHeight')
    console.log(containerHeight)
    const scale = containerWidth / this.canvas.getWidth();
    const zoom  = this.canvas.getZoom() * scale;
    this.canvas.setDimensions({width: containerWidth, height: containerWidth});
    this.canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
  }

  get myPositionOnBoard() {
    return this.players.findIndex(p => p.id === this.loggedInUser?.id)
  }

  drawLudoBoard() {
    this.initCanvas()
    drawBoard(this.canvas)
      .then(() => {
        this.setBoardColors()
        this.drawPawns()
          .then(() => {
            this.movementAudio = new Audio("./../../../assets/audio/move.mp3");
            this.movementAudio.playbackRate = 2;
          })
      })
  }

  subscribeDiceValue() {
    if (this.diceValueObservable) {
      this.diceValueObservable.subscribe(data => {
        if (data) {
          this.diceValue = data.value
          if (data.check) {
            this.checkPossibleMoves()
          }
          this.cdr.markForCheck()
        }
      })
    }
  }

  setBoardColors() {
    let colors: string[] = [...BOARD_HOUSE_COLORS]
    let playerColors: string[] = this.players.map((p: LudoPlayer) => p.color)
    let remainingColors: string[] = colors.filter(x => !playerColors.includes(x));
    const board: fabric.Object | any = this.canvas.getObjects()[0]
    const objects = board['_objects']
    let count = 0
    for (let index = 1; index <= PAWNS_COUNT; index++) {
      const houseObjects = objects.filter((o: fabric.Object | any) => o.id && o.id === `house-${index}`)
      let houseColor: any
      if (houseObjects.length > 0) {
        const player = this.players.find(p => p.boardPosition == index)
        if (player) {
          houseColor = player.color
        } else {
          houseColor = remainingColors[count]
          remainingColors.shift()
        }
        houseObjects.forEach((o: fabric.Object | any) => {
          o.set({
            fill: houseColor
          })
        })
      }
    }
    this.canvas.renderAll()
  }

  initCanvas() {
    this.canvas = new fabric.Canvas('canvas', {
      width: WIDTH + 1,
      height: HEIGHT + 1
    });
    this.canvas.hoverCursor = 'pointer';
    this.canvas.selection = false;
  }

  drawPawns(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let all: Promise<boolean>[] = []
      this.players.forEach((player, i) => {
        let pawnsData = []
        for (let index = 0; index < PAWNS_COUNT; index++) {
          const pawn = {
            id: `${index + 1}`,
            playerId: player.id,
            color: player.color,
            initialPosition: {
              x: BOARD_PATHS[player.boardPosition][index][0] * BLOCK_SIZE + 8,
              y: BOARD_PATHS[player.boardPosition][index][1] * BLOCK_SIZE
            },
            position: 0,
          }
          pawnsData.push(pawn)
        }
        all.push(drawPawns(this.canvas, pawnsData))
      })
      Promise.allSettled(all)
        .then(() => {
          resolve(true)
        })
    })
  }

  get loggedInUser() {
    return this.authService.userValue
  }

  emitAction(action: string, value?: any) {
    this.boardEmitter.emit({
      action,
      value
    })
  }
  checkPossibleMoves() {
    const pawns = getAllPawnsForPlayer(this.canvas, this.currentPlayer.id)
    let activePawns: fabric.Object[]
    if (this.diceValue === 6) {
      activePawns = pawns.filter(p => p.data.position === 0 || p.data.position <= 60 && (p.data.position + this.diceValue) <= 60)
    } else {
      activePawns = pawns.filter(p => p.data.position !== 0 && p.data.position <= 60 && (p.data.position + this.diceValue) <= 60)
    }
    if (activePawns.length === 0) {
      this.emitAction('nextTurn')
      return
    }
    if (activePawns.length === 1) {
      this.emitAction('movePawn', activePawns[0].data)
      this.movePawn(activePawns[0])
        .then((data) => {
          this.emitAction('updatePawn', activePawns[0].data)
          if (activePawns[0].data.position !== 60) {
            this.emitAction('nextTurn')
            return
          }

          if (activePawns[0].data.position === 60) {
            this.currentPlayer.score += 1
            this.emitAction('updateScore', this.currentPlayer)
            if (this.currentPlayer.score < 4) {
              this.emitAction('currentTurn')
              return
            }
            if (this.currentPlayer.score === 4) {
              this.displayPlayerWin(this.currentPlayer)
              this.emitAction('winner', this.currentPlayer.id)
              if (this.winnings) {
                this.emitAction('gameOver')
              } else {
                this.emitAction('nextTurn')
              }
              return
            }
          }
        })
    }
    if (activePawns.length > 1) {
      this.highlightPawns(activePawns)
      return
    }
  }

  get winners() {
    return this.players.filter((p: LudoPlayer) => p.score === 4)
  }

  get winnings() {
    return this.winners.length === this.players.length - 1
  }

  displayPlayerWin(player: LudoPlayer) {
    let winners = this.winners
    const positions = [
      [BLOCK_SIZE + 1.5, 10 * BLOCK_SIZE],
      [BLOCK_SIZE + 2, BLOCK_SIZE + 2],
      [10 * BLOCK_SIZE - 0.5, BLOCK_SIZE + 2],
      [10 * BLOCK_SIZE, 10 * BLOCK_SIZE]]
    const winMessagePosition = positions[player.boardPosition - 1]
    const text = new fabric.Text(`Winner`, {
      fill: 'black',
      left: winMessagePosition[0] + 15,
      top: winMessagePosition[1] + 15 + BLOCK_SIZE,
      width: 4 * BLOCK_SIZE,
      fontSize: 30
    })
    const rect = new fabric.Rect({
      left: winMessagePosition[0],
      top: winMessagePosition[1],
      width: 4 * BLOCK_SIZE - 2,
      height: 4 * BLOCK_SIZE - 2,
      fill: 'darkgray'
    })
    this.canvas.add(rect)
    this.canvas.add(text)
    this.canvas.renderAll()
  }

  highlightPawns(pawns: fabric.Object[], highlight: boolean = true) {
    pawns.forEach((pawn: fabric.Object | any) => {
      if (pawn) {
        const objects = pawn['_objects']
        const highlighter: fabric.Object = objects[0]
        if (highlight) {
          highlighter.set({
            strokeWidth: 50,
            stroke: 'black'
          })
          pawn.on('mousedown', this.pawnClicked.bind(this, pawn))
          if (!highlighter.data.animationRequest) {
            highlighter.data.animationRequest = requestAnimationFrame(this.animatePawnsHighlighters.bind(this, highlighter))
          }
        } else {
          if (highlighter.data.animationRequest) {
            cancelAnimationFrame(highlighter.data.animationRequest)
            highlighter.data.animationRequest = null
          }
          pawn.off()
          pawn['__eventListeners'] = []
          highlighter.set({
            strokeWidth: 0,
            stroke: 'white'
          })
        }
      }
    })
    this.canvas.renderAll()
  }

  animatePawnsHighlighters(highlighter: any, time: any) {
    highlighter.set({
      'strokeDashOffset': time * 0.7
    })
    this.canvas.renderAll()
    highlighter.data.animationRequest = requestAnimationFrame(this.animatePawnsHighlighters.bind(this, highlighter))
  }

  unhighlightAllPawns() {
    const pawns = getAllPawnsOnCanvas(this.canvas)
    this.highlightPawns(pawns, false)
  }

  clearAnimation(pawn: any) {
    cancelAnimationFrame(pawn.data.animationRequest)
    pawn.data.animationRequest = undefined
  }

  checkKill(pawn: fabric.Object, position: any) {
    return new Promise<boolean>((resolve) => {
      const isSafeHouse = BOARD_SAFE_HOUSES.find(f => f[0] === position[0] && f[1] === position[1])
      let pawnsAtPosition: fabric.Object[] = []
      if (!isSafeHouse) {
        const pawns = getAllPawnsOnCanvas(this.canvas)
        pawnsAtPosition = pawns.filter((p: fabric.Object) => {
          const player: any = this.players.find((player: LudoPlayer) => player.id === p.data.playerId)
          const toPosition = BOARD_PATHS[player.boardPosition][p.data.position]
          return JSON.stringify(position) == JSON.stringify(toPosition) && player.id !== pawn.data.playerId
        })
      }
      if (pawnsAtPosition.length === 1) {
        this.emitAction('killPawn', pawnsAtPosition[0].data)
        this.animateKill(pawnsAtPosition[0])
          .then((data) => {
            this.emitAction('updatePawn', pawnsAtPosition[0].data)
            cancelAnimationFrame(pawn.data.animationRequest)
            pawn.data.animationRequest = undefined
            resolve(true)
          })
      } else {
        resolve(false)
      }
    })
  }

  animateKill(pawn: fabric.Object) {
    return new Promise<boolean>(resolve => {
      const id = pawn.data && pawn.data.playerId
      const player: any = this.players.find((p: LudoPlayer) => p.id === id)
      let that = this
      pawn.data.animationRequest = requestAnimationFrame(step)
      function step() {
        const newPosition = pawn.data.position
        const toPosition = BOARD_PATHS[player.boardPosition][newPosition]
        const left = BLOCK_SIZE * toPosition[0] + 8
        const top = BLOCK_SIZE * toPosition[1]
        // that.killAudio.play()
        pawn.set({
          'left': left,
          'top': top
        })
        pawn.setCoords();
        that.canvas.renderAll()
        if (pawn.data.position > 4) {
          pawn.data.position--
          setTimeout(() => {
            pawn.data.animationRequest = requestAnimationFrame(step)
          }, 30);
        } else {
          pawn.set({
            'left': pawn.data.initialPosition.x,
            'top': pawn.data.initialPosition.y
          })
          pawn.data.position = 0
          pawn.setCoords();
          that.canvas.renderAll()
          resolve(true)
        }
      }
    })
  }

  pawnClicked(pawn: fabric.Object) {
    this.emitAction('movePawn', pawn.data)
    this.unhighlightAllPawns()
    this.movePawn(pawn)
      .then((data) => {
        this.emitAction('updatePawn', pawn.data)
        this.clearAnimation(pawn)
        const player: any = this.players.find((p: LudoPlayer) => p.id === pawn.data.playerId)
        let toPosition = BOARD_PATHS[player.boardPosition][pawn.data.position]
        this.checkKill(pawn, toPosition)
          .then((killed) => {
            if (!killed) {
              if (pawn.data.position === 60) {
                this.currentPlayer.score += 1
                this.emitAction('updateScore', this.currentPlayer)
                this.emitAction('currentTurn')
              } else {
                if (this.diceValue === 6) {
                  this.emitAction('currentTurn')
                } else {
                  this.emitAction('nextTurn')
                }
              }
              return
            }
            if (killed) {
              this.emitAction('currentTurn')
              return
            }
          })
      })
  }

  movePawn(pawn: fabric.Object) {
    let currentPosition = pawn.data.position
    let newPosition = currentPosition === 0 ? 4 : currentPosition + this.diceValue
    return new Promise<boolean>(resolve => {
      if (pawn) {
        let that = this
        const player: any = that.players.find((p: LudoPlayer) => p.id === pawn.data.playerId)
        pawn.data.animationRequest = requestAnimationFrame(step)
        function step() {
          currentPosition = currentPosition === 0 ? 4 : currentPosition + 1
          if (currentPosition <= newPosition) {
            let toPosition = BOARD_PATHS[player.boardPosition][currentPosition]
            const left = BLOCK_SIZE * toPosition[0] + 8
            const top = BLOCK_SIZE * toPosition[1]
            // that.movementAudio.play()
            pawn.animate({
              'left': left,
              'top': top
            }, {
              duration: 250,
              onChange: that.canvas.renderAll.bind(that.canvas),
              easing: fabric.util.ease.easeInOutBounce
            });
            setTimeout(() => {
              pawn.data.animationRequest = requestAnimationFrame(step)
            }, 250);
          } else {
            pawn.data.position = newPosition
            pawn.setCoords();
            that.canvas.renderAll()
            resolve(true)
          }
        }
      }
    })
  }
}
