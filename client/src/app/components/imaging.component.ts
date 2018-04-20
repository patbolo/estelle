import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { Message } from '../models/message';
import { Action } from '../models/action';

@Component({
  selector: 'imaging-component',
  template: `
    <h2>Imaging</h2>
    <h3>Sequence</h3>
    <form>
      <div class="row">
        <label class="col-md-2 col-xs-12" for="frames">Frames</label>
        <input class="col-md-2 col-xs-12" type="number" name="frames" [(ngModel)]="frames"/>
      </div>
      <div class="row">
        <label class="col-md-2 col-xs-12" for="iso">ISO</label>
        <select  class="col-md-2 col-xs-12" name="ISO" name="iso" [(ngModel)]="iso">
          <option *ngFor="let iso of isos" [ngValue]="iso">{{iso}}</option>
        </select>
      </div>
      <button (click)=doCapture()>Capture</button>
    </form>
  `
})
export class ImagingComponent {
  private isos = [
    50,
    100,
    200,
    400,
    800,
    1600,
    3200,
    6400,
    12800,
    25600,
    51200,
    102400
  ];

  private frames: number;

  private iso: number;

  constructor(private socketService: SocketService) { }
  
  doCapture() {
    let message: Message;

    message = {
      action: Action.CAPTURE,
      content: {
        iso: this.iso,
        frames: this.frames
      }
    };

    this.socketService.send(message);
  }
  
}
