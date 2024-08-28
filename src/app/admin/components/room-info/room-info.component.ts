import { Component, Inject, OnInit, signal } from '@angular/core';
import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IFindOneRomm } from '../../../core/models/room.model';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { RoomService } from '../../../core/services/room.service';

interface InputData {
  id: number
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-room-info',
  standalone: true,
  imports: [DialogModule, DatePipe, FontAwesomeModule],
  templateUrl: './room-info.component.html',
  styleUrl: './room-info.component.scss'
})
export class RoomInfoComponent implements OnInit {

  faClose = faWindowClose;
  roomId: number = 0;
  room = signal<IFindOneRomm | null>(null);

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private roomService: RoomService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data) {
      this.roomId = data.id;
    }
  }

  ngOnInit(): void {
    this.roomService.getById(this.roomId).subscribe({
      next: (data) => {
        this.room.set(data.data);
      },
      error: (error) => {

      }
    })
  }

  close() {
    this.dialogRef.close();
  }
}
