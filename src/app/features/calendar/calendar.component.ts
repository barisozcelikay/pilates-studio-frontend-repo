import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';

import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService } from './service/calendar-service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
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
    buttonText: {
      today: 'Bugün',
      month: 'Ay',
      week: 'Hafta',
      day: 'Gün',
    },

    events: [],
  };

  constructor(
    private readonly calendarService: CalendarService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.calendarService.findLessons().subscribe({
      next: (lessons) => {
        const events: EventInput[] = lessons.map((lesson) => ({
          id: String(lesson.id),
          title: lesson.name,
          start: lesson.startAt ?? undefined,
          end: lesson.endAt ?? undefined,
          backgroundColor: lesson.status === 'CANCELLED' ? '#b45f5f' : undefined,
          borderColor: lesson.status === 'CANCELLED' ? '#b45f5f' : undefined,
        }));

        this.calendarOptions = { ...this.calendarOptions, events };
        this.cdr.markForCheck();
      },
    });
  }
}
