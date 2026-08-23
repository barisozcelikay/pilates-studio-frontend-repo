import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';

import { CalendarOptions, EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService } from './service/calendar-service';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { Select } from 'primeng/select';
import { LessonDto } from '../lessons/model/lesson-dto';
import { MemberDto } from '../members/model/member-dto';
import { MemberService } from '../members/service/member-service';
import { ReservationDto, ReservationService } from '../reservations/service/reservation-service';
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
    eventContent: (event) => this.renderLessonEvent(event),
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
  myReservation: ReservationDto | null = null;

  constructor(
    private readonly calendarService: CalendarService,
    private readonly memberService: MemberService,
    private readonly reservationService: ReservationService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.configureCalendarForRole();
    this.loadLessons();
  }

  get isMember(): boolean {
    return this.authService.getActiveRole() === 'PROFILE_MEMBER';
  }

  get canSelectMember(): boolean {
    const role = this.authService.getActiveRole();
    return role === 'PROFILE_ADMIN' || role === 'PROFILE_INSTRUCTOR';
  }

  openReservationDrawer(event: EventClickArg): void {
    const lesson = this.lessons.find((item) => item.id === Number(event.event.id));
    if (!lesson?.id) return;

    this.selectedLesson = lesson;
    this.selectedMemberId = null;
    this.reservationError = '';
    this.myReservation = null;
    this.reservationDrawerVisible = true;
    this.cdr.detectChanges();

    if (!this.canSelectMember) {
      this.reservationService.findMyReservation(lesson.id).subscribe({
        next: (reservation) => {
          this.myReservation = reservation;
          this.cdr.detectChanges();
        },
      });
    }

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
    return (
      !lesson ||
      this.reserving ||
      lesson.status !== 'ACTIVE' ||
      !lesson.capacity ||
      lesson.reservationCount >= lesson.capacity ||
      !!this.myReservation ||
      (this.canSelectMember && !this.selectedMemberId)
    );
  }

  cancelMyReservation(): void {
    if (!this.myReservation) return;
    this.reserving = true;
    this.reservationError = '';
    this.reservationService.cancel(this.myReservation.id).subscribe({
      next: () => {
        this.reserving = false;
        this.reservationDrawerVisible = false;
        this.loadLessons();
      },
      error: (error) => {
        this.reserving = false;
        this.reservationError = error?.error?.message ?? 'Rezervasyon iptal edilemedi.';
        this.cdr.markForCheck();
      },
    });
  }

  private loadLessons(): void {
    const request = this.isMember
      ? this.calendarService.findCurrentWeekLessons()
      : this.calendarService.findLessons();

    request.subscribe({
      next: (lessons) => {
        this.lessons = lessons;
        const events: EventInput[] = lessons.map((lesson) => ({
          id: String(lesson.id),
          title: lesson.name,
          start: lesson.startAt ?? undefined,
          end: lesson.endAt ?? undefined,
          extendedProps: {
            serviceNames: lesson.serviceNames,
            instructorNames: lesson.instructorNames,
            reservationCount: lesson.reservationCount,
            capacity: lesson.capacity,
          },
          backgroundColor: lesson.status === 'CANCELLED' ? '#b45f5f' : undefined,
          borderColor: lesson.status === 'CANCELLED' ? '#b45f5f' : undefined,
        }));

        this.calendarOptions = { ...this.calendarOptions, events };
        this.cdr.markForCheck();
      },
    });
  }

  private configureCalendarForRole(): void {
    if (!this.isMember) {
      return;
    }

    const today = new Date();
    const mondayOffset = (today.getDay() + 6) % 7;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - mondayOffset);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    this.calendarOptions = {
      ...this.calendarOptions,
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay',
      },
      validRange: { start: weekStart, end: weekEnd },
    };
  }

  private renderLessonEvent(event: EventContentArg): { domNodes: HTMLElement[] } {
    const root = document.createElement('div');
    root.className = 'calendar-lesson-event';

    const title = document.createElement('strong');
    title.className = 'calendar-lesson-event__title';
    title.textContent = event.event.title;
    root.append(title);

    const services = event.event.extendedProps['serviceNames'] as string[] | undefined;
    if (services?.length) {
      const chips = document.createElement('div');
      chips.className = 'calendar-lesson-event__chips';
      services.forEach((service, index) => {
        const chip = document.createElement('span');
        chip.className = `calendar-service-chip calendar-service-chip--${index % 4}`;
        chip.textContent = service;
        chips.append(chip);
      });
      root.append(chips);
    }

    const instructors = event.event.extendedProps['instructorNames'] as string[] | undefined;
    if (instructors?.length) {
      const instructor = document.createElement('span');
      instructor.className = 'calendar-lesson-event__instructor';
      instructor.textContent = instructors.join(', ');
      root.append(instructor);
    }

    const capacity = document.createElement('span');
    capacity.className = 'calendar-lesson-event__capacity';
    capacity.textContent = `${event.event.extendedProps['reservationCount']} / ${event.event.extendedProps['capacity']} katılımcı`;
    root.append(capacity);

    return { domNodes: [root] };
  }
}
