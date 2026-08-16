import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';

import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

    initialView: 'timeGridWeek',

    height: 'calc(100vh - 220px)',

    locale: 'tr',
    firstDay: 1,

    nowIndicator: true,
    allDaySlot: false,

    slotMinTime: '07:00:00',
    slotMaxTime: '22:00:00',

    expandRows: true,

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    dateClick: (info) => {
      console.log('Tıklanan tarih:', info.date);
      console.log('Tıklanan saat:', info.dateStr);
    },

    buttonText: {
      today: 'Bugün',
      month: 'Ay',
      week: 'Hafta',
      day: 'Gün',
    },

    events: [
      {
        id: '1',
        title: 'Pilates Başlangıç',
        start: '2026-08-17T10:00:00',
        end: '2026-08-17T11:00:00',
      },
      {
        id: '2',
        title: 'Mat Pilates',
        start: '2026-08-17T14:00:00',
        end: '2026-08-17T15:00:00',
      },
      {
        id: '3',
        title: 'Reformer Pilates',
        start: '2026-08-18T18:00:00',
        end: '2026-08-18T19:00:00',
      },
      {
        id: '4',
        title: 'Hamile Pilatesi',
        start: '2026-08-19T11:00:00',
        end: '2026-08-19T12:00:00',
      },
      {
        id: '5',
        title: 'Reformer Pilates',
        start: '2026-08-20T17:00:00',
        end: '2026-08-20T18:00:00',
      },
    ],
  };
}
