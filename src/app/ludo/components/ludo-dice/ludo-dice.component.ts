import { Component, EventEmitter, HostBinding, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { LudoService } from '../../services/ludo.service';
import { LudoPlayer } from '../../models/ludo-player';

@Component({
  selector: 'app-ludo-dice',
  templateUrl: './ludo-dice.component.html',
  styleUrls: ['./ludo-dice.component.scss']
})
export class LudoDiceComponent implements OnInit {
  // audio: any;
  @Input() player!: LudoPlayer
  rollStatus = false
  dataRoll = 6
  @Output() diceValueChanged: EventEmitter<number> = new EventEmitter<number>();
  activateDice = false
  @HostBinding('id') get hostId() {
    const classList = [`host-dice-${this.player.boardPosition}`];
    return classList;
  }
  constructor(private authService: AuthenticationService,
    public cdr: ChangeDetectorRef,
    private ludoService: LudoService) {

  }

  ngOnInit(): void {
    this.initEventsAndSounds()
  }

  diceClick() {
    if(this.activateDice) {
      this.rollDice()
      this.diceValueChanged.emit(this.dataRoll);
    }
  }

  rollDice(value?: number) {
    const min = value ? value : 1
    const max = value ? value : 6
    // this.audio.play();
    this.rollStatus = this.rollStatus;
    this.rollStatus = !this.rollStatus;
    this.dataRoll = this.getRandomNumber(min, max);
    this.activateDice = false
  }

  getRandomNumber(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  initEventsAndSounds() {
    // this.audio = new Audio("./../../../assets/audio/rolling-dice.mp3");
    // this.audio.playbackRate = 2;
  }
}
