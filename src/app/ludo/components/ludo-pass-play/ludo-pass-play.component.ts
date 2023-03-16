import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-ludo-pass-play',
  templateUrl: './ludo-pass-play.component.html',
  styleUrls: ['./ludo-pass-play.component.scss']
})
export class LudoPassPlayComponent implements OnInit {
  counts: any = []
  selectedCount: any
  form!: FormGroup;
  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.counts = [
      {label: '2 Players', value: 2},
      {label: '3 Players', value: 3},
      {label: '4 Players', value: 4}
    ]
    this.selectedCount = this.counts[0].value
    this.initFields()
  }

  onChange() {
    this.setPlayers()
  }

  setPlayers() {
    this.removePlayers()
    for (let index = 0; index < this.selectedCount; index++) {
      this.addPlayer(`player${index+1}`)
    }
  }

  initFields() {
    this.form = this.fb.group({
      players: this.fb.array([])
    })
    this.setPlayers()
  }

  get players() : FormArray {
    return this.form.get("players") as FormArray
  }

  addPlayer(name: string) {
    this.players.push(this.newPlayer(name));
  }

  newPlayer(name: string): FormGroup {
    return this.fb.group({
      [name]: this.fb.control('')
    });
  }

  removePlayers(): void {
    this.players.clear()
  }
}
