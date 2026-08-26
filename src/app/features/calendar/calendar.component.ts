import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';

import { CalendarOptions, EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateClickArg } from '@fullcalendar/interaction';
import { CalendarService } from './service/calendar-service';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { DatePicker } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { LessonDto } from '../lessons/model/lesson-dto';
import { MemberDto } from '../members/model/member-dto';
import { MemberService } from '../members/service/member-service';
import { ReservationDto, ReservationService } from '../reservations/service/reservation-service';
import { AuthService } from '../../core/auth/service/auth-service';
import { LessonService } from '../lessons/service/lesson-service';
import { InstructorDto } from '../instructors/model/instructor-dto';
import { InstructorService } from '../instructors/service/instructor-service';
import { StudioServiceDto } from '../studio-services/model/studio-service-dto';
import { StudioServiceService } from '../studio-services/service/studio-service-service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, DrawerComponent, Select, MultiSelect, DatePicker, InputTextModule, TextareaModule, FormsModule, DatePipe, NgIf],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

    initialView: 'timeGridWeek',

    height: 700,

    locale: 'tr',
    firstDay: 1,

    nowIndicator: true,
    allDaySlot: false,

    slotMinTime: '07:00:00',
    slotMaxTime: '22:00:00',
    slotDuration: '00:30:00',
    slotLabelInterval: '01:00:00',
    scrollTime: '07:00:00',
    scrollTimeReset: false,
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      startTime: '07:00',
      endTime: '22:00',
    },

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
    dateClick: (event) => this.openLessonDrawerFromDate(event),
  };

  lessons: LessonDto[] = [];
  members: MemberDto[] = [];
  selectedLesson: LessonDto | null = null;
  selectedMemberId: number | null = null;
  reservationDrawerVisible = false;
  reserving = false;
  reservationError = '';
  myReservation: ReservationDto | null = null;
  lessonDrawerVisible = false;
  lessonSaving = false;
  lessonError = '';
  lessonForm = new LessonDto();
  instructors: InstructorDto[] = [];
  instructorOptions: { label: string; value: number }[] = [];
  services: StudioServiceDto[] = [];
  selectedInstructorIds: number[] = [];
  selectedServiceIds: number[] = [];

  constructor(
    private readonly calendarService: CalendarService,
    private readonly memberService: MemberService,
    private readonly reservationService: ReservationService,
    private readonly authService: AuthService,
    private readonly lessonService: LessonService,
    private readonly instructorService: InstructorService,
    private readonly studioServiceService: StudioServiceService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.configureCalendarForRole();
    this.loadLessons();
    if (this.canCreateLesson) this.loadLessonFormOptions();
  }

  get isMember(): boolean {
    return this.authService.getActiveRole() === 'PROFILE_MEMBER';
  }

  get canSelectMember(): boolean {
    const role = this.authService.getActiveRole();
    return role === 'PROFILE_ADMIN' || role === 'PROFILE_INSTRUCTOR';
  }

  get canCreateLesson(): boolean {
    const role = this.authService.getActiveRole();
    return role === 'PROFILE_ADMIN' || role === 'PROFILE_INSTRUCTOR';
  }

  openLessonDrawer(): void {
    if (!this.canCreateLesson) return;
    const start = new Date();
    start.setMinutes(Math.ceil(start.getMinutes() / 30) * 30, 0, 0);
    this.prepareLessonForm(start);
  }

  openLessonDrawerFromDate(event: DateClickArg): void {
    if (!this.canCreateLesson) return;
    const start = new Date(event.date);
    if (event.allDay) start.setHours(9, 0, 0, 0);
    this.prepareLessonForm(start);
  }

  saveLesson(): void {
    if (!this.canCreateLesson || this.lessonSaving) return;
    if (!this.lessonForm.name.trim() || !this.lessonForm.startAt || !this.lessonForm.endAt || !this.lessonForm.capacity) {
      this.lessonError = 'Ders adı, başlangıç, bitiş ve kontenjan alanları zorunludur.';
      return;
    }
    if (new Date(this.lessonForm.endAt).getTime() <= new Date(this.lessonForm.startAt).getTime()) {
      this.lessonError = 'Bitiş saati başlangıç saatinden sonra olmalıdır.';
      return;
    }
    if (!this.isWithinStudioHours(new Date(this.lessonForm.startAt), new Date(this.lessonForm.endAt))) {
      this.lessonError = 'Dersler aynı gün içinde 07:00–22:00 saatleri arasında planlanmalıdır.';
      return;
    }

    this.lessonSaving = true;
    this.lessonError = '';
    const request = Object.assign(new LessonDto(), this.lessonForm, {
      instructorIds: [...this.selectedInstructorIds],
      serviceIds: [...this.selectedServiceIds],
      startAt: new Date(this.lessonForm.startAt).toISOString(),
      endAt: new Date(this.lessonForm.endAt).toISOString(),
      status: 'ACTIVE',
    });
    this.lessonService.create(request).subscribe({
      next: () => {
        this.lessonSaving = false;
        this.lessonDrawerVisible = false;
        this.loadLessons();
      },
      error: (error) => {
        this.lessonSaving = false;
        this.lessonError = error?.error?.message ?? 'Ders oluşturulamadı.';
        this.cdr.markForCheck();
      },
    });
  }

  normalizeLessonTime(field: 'start' | 'end'): void {
    const value = field === 'start' ? this.lessonForm.startAt : this.lessonForm.endAt;
    if (!value) return;
    const date = new Date(value);
    const minutes = date.getHours() * 60 + date.getMinutes();

    if (field === 'start') {
      if (minutes < 7 * 60) date.setHours(7, 0, 0, 0);
      if (minutes >= 22 * 60) date.setHours(21, 0, 0, 0);
      this.lessonForm.startAt = date;
      const end = this.lessonForm.endAt ? new Date(this.lessonForm.endAt) : new Date(date);
      if (end.getTime() <= date.getTime() || !this.isWithinStudioHours(date, end)) {
        end.setTime(date.getTime() + 60 * 60 * 1000);
        if (end.getHours() > 22 || (end.getHours() === 22 && end.getMinutes() > 0)) end.setHours(22, 0, 0, 0);
        this.lessonForm.endAt = end;
      }
      return;
    }

    if (minutes < 7 * 60) date.setHours(7, 30, 0, 0);
    if (minutes > 22 * 60) date.setHours(22, 0, 0, 0);
    const start = this.lessonForm.startAt ? new Date(this.lessonForm.startAt) : null;
    if (start && date.getTime() <= start.getTime()) {
      date.setTime(start.getTime() + 30 * 60 * 1000);
      if (date.getHours() > 22 || (date.getHours() === 22 && date.getMinutes() > 0)) date.setHours(22, 0, 0, 0);
    }
    this.lessonForm.endAt = date;
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
          classNames: [lesson.status === 'CANCELLED' ? 'calendar-event--cancelled' : 'calendar-event--active'],
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

  private prepareLessonForm(start: Date): void {
    const normalizedStart = new Date(start);
    const startMinutes = normalizedStart.getHours() * 60 + normalizedStart.getMinutes();
    if (startMinutes < 7 * 60) normalizedStart.setHours(7, 0, 0, 0);
    if (startMinutes >= 22 * 60) normalizedStart.setHours(21, 0, 0, 0);
    const end = new Date(normalizedStart.getTime() + 60 * 60 * 1000);
    this.lessonForm = Object.assign(new LessonDto(), {
      startAt: normalizedStart,
      endAt: end,
      capacity: 3,
      status: 'ACTIVE',
    });
    this.selectedInstructorIds = [];
    this.selectedServiceIds = [];
    this.lessonError = '';
    this.lessonDrawerVisible = true;
    this.cdr.detectChanges();
  }

  private loadLessonFormOptions(): void {
    this.instructorService.findAll().subscribe({
      next: (instructors) => {
        this.instructors = instructors.filter((instructor) => instructor.status === 'ACTIVE');
        this.instructorOptions = this.instructors
          .filter((instructor): instructor is InstructorDto & { id: number } => instructor.id !== undefined)
          .map((instructor) => ({ label: `${instructor.firstName} ${instructor.lastName}`, value: instructor.id }));
        this.cdr.markForCheck();
      },
    });
    this.studioServiceService.findAll().subscribe({
      next: (services) => {
        this.services = services.filter((service) => service.active);
        this.cdr.markForCheck();
      },
    });
  }

  private isWithinStudioHours(start: Date, end: Date): boolean {
    const sameDay = start.getFullYear() === end.getFullYear()
      && start.getMonth() === end.getMonth()
      && start.getDate() === end.getDate();
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    return sameDay && startMinutes >= 7 * 60 && startMinutes < 22 * 60 && endMinutes <= 22 * 60;
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
