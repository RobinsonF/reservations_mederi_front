import { Component, OnInit, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { RoomService } from '../../../core/services/room.service';
import { IFindAllRomm } from '../../../core/models/room.model';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ReservationInfoComponent } from '../../components/reservation-info/reservation-info.component';
import { RoomInfoComponent } from '../../components/room-info/room-info.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, DialogModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    locale: esLocale,
    events: [],
    height: 'auto',
    aspectRatio: 1.5,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    eventClick: this.handleEventClick.bind(this)
  };

  rooms = signal<IFindAllRomm[]>([]);

  constructor(
    private roomService: RoomService,
    private dialog: Dialog
  ) { }

  ngOnInit(): void {
    this.roomService.get().subscribe({
      next: (data) => {
        this.rooms.set(data.data);
        this.loadRoomAvailability();
      },
      error: (error) => {

      }
    })
  }

  handleEventClick(info: any): void {
    if (info.event._def.extendedProps && info.event._def.extendedProps.table === 'reservation') {
      this.dialog.open(ReservationInfoComponent, {
        data: {
          id: info.event._def.extendedProps.id
        }
      });
    } else {
      this.dialog.open(RoomInfoComponent, {
        data: {
          id: info.event._def.extendedProps.id
        }
      });
    }
  }

  loadRoomAvailability() {
    const getCurrentDate = (): string => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const calendarEvents = this.rooms().flatMap(room => {
      if (room.reservations.length === 0) {
        return [{
          title: `${room.name} Disponible`,
          start: getCurrentDate(),
          color: 'green',
          extendedProps: {
            id: room.id,
            table: 'room',
          }
        }];
      } else {
        return room.reservations.map(reservation => ({
          title: `${room.name} Ocupada`,
          start: reservation.startTime,
          end: reservation.endTime,
          color: 'red',
          extendedProps: {
            id: reservation.id,
            table: 'reservation',
          }
        }));
      }
    });
    this.calendarOptions.events = calendarEvents;
  }
}
