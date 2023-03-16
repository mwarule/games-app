import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil, Subscription } from 'rxjs';
import { LudoService } from '../../services/ludo.service';

@Component({
  selector: 'app-ludo-config',
  templateUrl: './ludo-config.component.html',
  styleUrls: ['./ludo-config.component.scss']
})
export class LudoConfigComponent implements OnDestroy {
  selectedCount: any
  newMessage = '';
  messageList: string[] = [];
  counts: any = [];
  ludoConnectData: any
  searching = false
  timerInterval: any
  timer: number = 30
  ludoConnectSubscription!: Subscription
  dialogSubscription!: Subscription
  constructor(private router: Router,
    private ludoService: LudoService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) {}

  ngOnInit() {
    this.counts = [
      { label: '2 Players', value: 2 },
      { label: '3 Players', value: 3 },
      { label: '4 Players', value: 4 }
    ]
    this.selectedCount = this.counts[0].value
    this.dialogSubscription = this.ref.onClose
    .subscribe(() => {
      if(this.searching) {
        this.disconnect()
        this.destroy()
      }
    })
  }

  searchPlayers() {
    this.searching = true
    this.startTimer()
    this.ludoService.connect()
    this.searchOnline()
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer--
      if(this.timer === 0) {
        this.disconnect()
        this.destroy()
      }
    }, 1000)
  }

  subscribeLudoConnect() {
    this.ludoConnectSubscription = this.ludoService.getLudoConnect()
    .subscribe((data: any) => {
      if(data) {
        console.log(data)
        this.ludoConnectData = data
        this.searching = this.ludoConnectData.status === 'WAITING'
        if(this.ludoConnectData.status === 'READY') {
          this.ref.close()
          this.router.navigate(['/ludo/online'], { queryParams: { gameState: JSON.stringify(this.ludoConnectData) }});
        }
      }
    })
  }

  ludoConnect(data: any) {
    this.ludoService.ludoConnect(data);
    this.subscribeLudoConnect()
  }

  searchOnline() {
    this.searching = true
    const data = {
      limit: this.selectedCount
    }
    this.ludoConnect(data)
  }

  disconnect() {
    this.ludoService.disconnect()
  }

  ngOnDestroy(): void {
    this.destroy()
  }

  destroy() {
    this.destorySubscriptions()
    clearInterval(this.timerInterval)
    this.timer = 30
    this.searching = false
  }

  destorySubscriptions() {
    if(this.ludoConnectSubscription) {
      this.ludoConnectSubscription.unsubscribe()
    }
  }
}
