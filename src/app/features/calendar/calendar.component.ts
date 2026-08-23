import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';

import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService } from './service/calendar-service';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { Select } from 'primeng/select';
import { LessonDto } from '../lessons/model/lesson-dto';
import { MemberDto } from '../members/model/member-dto';
import { MemberService } from '../members/service/member-service';
import { ReservationService } from '../reservations/service/reservation-service';
import { AuthService } from '../../core/auth/service/auth-service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, DrawerComponent, Select, FormsModule, DatePipe, NgIf],
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
    eventClick: (event) => {
      event.jsEvent.preventDefault();
      this.openReservationDrawer(event);
    },
  };

  lessons: LessonDto[] = [];
  members: MemberDto[] = [];
  selectedLesson: LessonDto | null = null;
  selectedMemberId: number | null = null;
  reservationDrawerVisible = false;
  reserving = false;
  reservationError = '';

  constructor(
    private readonly calendarService: CalendarService,
    private readonly memberService: MemberService,
    private readonly reservationService: ReservationService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadLessons();
  }

  get canSelectMember(): boolean {
    const role = this.authService.getActiveRole();
    return role === 'PROFILE_ADMIN' || role === 'PROFILE_INSTRUCTOR';
  }

  openReservationDrawer(event: EventClickArg): void {
    const lesson = this.lessons.find((item) => item.id === Number(event.event.id));
    if (!lesson) return;

    this.selectedLesson = lesson;
    this.selectedMemberId = null;
    this.reservationError = '';
    this.reservationDrawerVisible = true;
    this.cdr.detectChanges();

    if (this.canSelectMember && !this.members.length) {
      this.memberService.findAll().subscribe({
        next: (members) => {
          this.members = members.filter((member) => member.status === 'ACTIVE');
          this.cdr.markForCheck();
        },
      });
    }
  }

  reserve(): void {
    if (!this.selectedLesson?.id || (this.canSelectMember && !this.selectedMemberId)) return;

    this.reserving = true;
    this.reservationError = '';
    this.reservationService.create(this.selectedLesson.id, this.selectedMemberId).subscribe({
      next: () => {
        this.reserving = false;
        this.reservationDrawerVisible = false;
        this.loadLessons();
      },
      error: (error) => {
        this.reserving = false;
        this.reservationError = error?.error?.message ?? 'Rezervasyon oluşturulamadı.';
        this.cdr.markForCheck();
      },
    });
  }

  isReservationUnavailable(): boolean {
    const lesson = this.selectedLesson;
    return !lesson
      || this.reserving
      || lesson.status !== 'ACTIVE'
      || !lesson.capacity
      || lesson.reservationCount >= lesson.capacity
      || (this.canSelectMember && !this.selectedMemberId);
  }

  private loadLessons(): void {
    this.calendarService.findLessons().subscribe({
      next: (lessons) => {
        this.lessons = lessons;
        const events: EventInput[] = lessons.map((lesson) => ({
          id: String(lesson.id),
          title: `${lesson.name} · ${lesson.reservationCount}/${lesson.capacity}`,
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
