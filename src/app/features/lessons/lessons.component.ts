import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BaseComponent } from '../../shared/component/base/base-component';
import { LessonDto } from './model/lesson-dto';
import { LessonService } from './service/lesson-service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';
import { DatePicker } from 'primeng/datepicker';
import { InstructorDto } from '../instructors/model/instructor-dto';
import { InstructorService } from '../instructors/service/instructor-service';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    FormsModule,
    InputTextModule,
    Select,
    MultiSelect,
    DrawerComponent,
    ConfirmDialogComponent,
    DatePicker,
  ],
  templateUrl: './lessons.component.html',
})
export class LessonsComponent extends BaseComponent<LessonDto> {
  instructors: InstructorDto[] = [];
  instructorOptions: { label: string; value: number }[] = [];
  selectedInstructorIds: number[] = [];
  readonly statusOptions = [
    { label: 'Aktif', value: 'ACTIVE' },
    { label: 'İptal Edildi', value: 'CANCELLED' },
    { label: 'Tamamlandı', value: 'COMPLETED' },
  ];

  constructor(
    lessonService: LessonService,
    cdr: ChangeDetectorRef,
    private readonly instructorService: InstructorService,
  ) {
    super(lessonService, cdr, LessonDto);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.instructorService.findAll().subscribe({
      next: (instructors) => {
        this.instructors = instructors.filter((instructor) => instructor.status === 'ACTIVE');
        this.instructorOptions = this.instructors
          .filter((instructor): instructor is InstructorDto & { id: number } => instructor.id !== undefined)
          .map((instructor) => ({
            label: `${instructor.firstName} ${instructor.lastName}`,
            value: instructor.id,
          }));
        this.cdr.markForCheck();
      },
    });
  }

  protected override openEditForm(lesson: LessonDto): void {
    super.openEditForm(lesson);
    this.selectedInstructorIds = [...lesson.instructorIds];
    this.form.startAt = lesson.startAt ? new Date(lesson.startAt) : null;
    this.form.endAt = lesson.endAt ? new Date(lesson.endAt) : null;
  }

  protected override save(): void {
    this.form.instructorIds = [...this.selectedInstructorIds];
    this.form.startAt = this.toIsoDateTime(this.form.startAt);
    this.form.endAt = this.toIsoDateTime(this.form.endAt);
    super.save();
  }

  override openCreateForm(): void {
    super.openCreateForm();
    this.selectedInstructorIds = [];
  }

  private toIsoDateTime(value: Date | string | null): string {
    return value ? new Date(value).toISOString() : '';
  }
}
