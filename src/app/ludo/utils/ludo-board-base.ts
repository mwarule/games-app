import { AfterViewInit, OnInit, Component, Input, ChangeDetectorRef } from '@angular/core';
import { LudoPlayer } from '../models/ludo-player';
import { fabric } from 'fabric';
import { Pawn } from '../models/pawn.model';
import { BOARD_PATHS, BLOCK_SIZE, drawPawns, HEIGHT, WIDTH, BOARD_HOUSE_COLORS, getAllPawnsOnCanvas, BOARD_SAFE_HOUSES, getAllPawnsForPlayer } from './ludo-utils';
import { Observable } from 'rxjs';

@Component({
  template: ''
})
export class LudoBoardBase implements AfterViewInit {
  @Input() players: LudoPlayer[] = []
  canvas!: fabric.Canvas;
  @Input() diceValueSubscription$!: Observable<{value: number, action: boolean}>
  diceValue: number = 0

  constructor(public cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.subscribeDiceValue()
  }

  subscribeDiceValue() {
    if(this.diceValueSubscription$) {
      this.diceValueSubscription$
      .subscribe(data => {
        const action = data.action
        this.diceValue = data.value
        if(action) {
          console.log('die')
          this.diceChanged(this.diceValue)
        }
        this.cdr.markForCheck()
      })
    }
  }

  get currentPlayer(): LudoPlayer {
    const current: LudoPlayer = this.players.find(p => p.turn)!
    return current
  }

  get winners() {
    return this.players.filter((p: LudoPlayer) => p.score === 4)
  }

  clearAnimation(pawn: any) {
    cancelAnimationFrame(pawn.data.animationRequest)
    pawn.data.animationRequest = undefined
  }

  checkWinnings() {
    return this.winners.length === this.players.length - 1
  }

  pawnClicked(pawn: fabric.Object) {
    const pawns = getAllPawnsOnCanvas(this.canvas)
    this.highlightPawns(pawns, false)
    this.movePawn(pawn)
    .then((data) => {
      this.clearAnimation(pawn)
      const player: any = this.players.find((p: LudoPlayer) => p.id === pawn.data.playerId)
      let toPosition = BOARD_PATHS[player.boardPosition][pawn.data.position]
      this.checkKill(pawn, toPosition)
        .then((killed) => {
          this.movedCallback(killed, pawn)
        })
    })
  }

  movedCallback(value: boolean, pawn: fabric.Object) {
    if(!value) {
      if (pawn.data.position === 60) {
        this.currentPlayer.score += 1
        console.log('current turn')
        // this.activateDice.emit(this.currentPlayer.id)
      } else {
        if (this.diceValue === 6) {
          console.log('current turn')
          // this.activateDice.emit(this.currentPlayer.id)
        } else {
          console.log('next turn')
          // this.nextTurn()
        }
      }
    }
    if (value) {
      console.log('next turn')
      // this.activateDice.emit(this.currentPlayer.id)
    }
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

  displayPlayerWin(player: LudoPlayer) {
    const positions = [
      [BLOCK_SIZE + 1.5, 10 * BLOCK_SIZE],
      [BLOCK_SIZE + 2, BLOCK_SIZE + 2],
      [10 * BLOCK_SIZE - 0.5, BLOCK_SIZE + 2],
      [10 * BLOCK_SIZE, 10 * BLOCK_SIZE]]
    const winMessagePosition = positions[player.boardPosition - 1]
    const text = new fabric.Text(`Winner ${this.winners.length}`, {
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

  setBoardColors() {
    let colors: string[] = [...BOARD_HOUSE_COLORS]
    let playerColors: string[] = this.players.map((p: LudoPlayer) => p.color)
    let remainingColors: string[] = colors.filter(x => !playerColors.includes(x));
    this.canvas.forEachObject((object: fabric.Object | any) => {
      if (!object.data) {
        const objects = object['_objects']
        objects.forEach((o: fabric.Object | any) => {
          const houseId = o.id && o.id.includes(`house-`) ? o.id.split('-')[1] : ''
          if (houseId) {
            const player = this.players.find(p => p.boardPosition == houseId)
            let houseColor
            if (player) {
              houseColor = player.color
            } else {
              houseColor = remainingColors[0]
              remainingColors.shift()
            }
            if (houseColor) {
              o.set({
                fill: houseColor
              })
            }
          }
        })
      }
      this.canvas.renderAll()
    })
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
        const pawns = player.pawns
        const pawnsData = pawns.map((pawn: Pawn, j: number) => {
          return {
            id: pawn.id,
            playerId: player.id,
            color: player.color,
            initialPosition: {
              x: BOARD_PATHS[player.boardPosition][j][0] * BLOCK_SIZE + 8,
              y: BOARD_PATHS[player.boardPosition][j][1] * BLOCK_SIZE
            },
            position: pawn.position
          }
        })
        all.push(drawPawns(this.canvas, pawnsData))
      })
      Promise.allSettled(all)
        .then(() => {
          resolve(true)
        })
    })
  }

  diceChanged(value: number) {
    const pawns = getAllPawnsForPlayer(this.canvas, this.currentPlayer.id)
    let activePawns
    if (value === 6) {
      activePawns = pawns.filter(p => p.data.position === 0 || p.data.position <= 60 && (p.data.position + value) <= 60)
    } else {
      activePawns = pawns.filter(p => p.data.position !== 0 && p.data.position <= 60 && (p.data.position + value) <= 60)
    }
    this.checkPossibleMove(activePawns)
  }

  checkPossibleMove(pawns: fabric.Object[]) {
    if(pawns.length === 0) {
      // this.nextTurn()
      console.log('next turn')
      return
    }
    if(pawns.length === 1) {
      this.movePawn(pawns[0])
      .then((data) => {
        if (pawns[0].data.position !== 60) {
          // this.nextTurn()
          console.log('next turn')
          return
        }

        if (pawns[0].data.position === 60) {
          this.currentPlayer.score += 1
          if(this.currentPlayer.score < 4) {
            // this.activateDice.emit(this.currentPlayer.id)
            console.log('current turn')
            return
          }
          if(this.currentPlayer.score === 4) {
            this.displayPlayerWin(this.currentPlayer)
            const won = this.checkWinnings()
            console.log(won)
            if(won) {
              // this.activateDice('')
              console.log('Game Over')
            } else {
              console.log('Pawn reached but no win yet')
              // this.nextTurn()
              console.log('next turn')
            }
            return
          }
        }
      })
    }
    if(pawns.length > 1) {
      this.highlightPawns(pawns)
      return
    }
  }


  movePawn(pawn: fabric.Object) {
    let currentPosition = pawn.data.position
    let newPosition = currentPosition === 0 ? 4 : parseInt(currentPosition + this.diceValue)
    return new Promise<boolean>(resolve => {
      let that = this
      const id = pawn.data && pawn.data.playerId
      const player: any = that.players.find((p: LudoPlayer) => p.id === id)
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
    })
  }

  checkKill(pawn: fabric.Object, position: any) {
    return new Promise<boolean>((resolve) => {
      const isSafeHouse = BOARD_SAFE_HOUSES.find(f => f[0] === position[0] && f[1] === position[1])
      let pawnsAtPosition: fabric.Object[] = []
      if(!isSafeHouse) {
        const pawns = getAllPawnsOnCanvas(this.canvas)
        pawnsAtPosition = pawns.filter((p: fabric.Object) => {
          const player: any = this.players.find((player: LudoPlayer) => player.id === p.data.playerId)
          const toPosition = BOARD_PATHS[player.boardPosition][p.data.position]
          return JSON.stringify(position) == JSON.stringify(toPosition) && player.id !== pawn.data.playerId
        })
      }
      if (pawnsAtPosition.length === 1) {
        this.killPawn(pawnsAtPosition[0])
          .then((data) => {
            cancelAnimationFrame(pawn.data.animationRequest)
            pawn.data.animationRequest = undefined
            resolve(true)
          })
      } else {
        resolve(false)
      }
    })
  }

  killPawn(pawn: fabric.Object) {
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
}
