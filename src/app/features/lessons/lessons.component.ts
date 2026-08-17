import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BaseComponent } from '../../shared/component/base/base-component';
import { LessonDto } from './model/lesson-dto';
import { LessonService } from './service/lesson-service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';
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
    DrawerComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './lessons.component.html',
})
export class LessonsComponent extends BaseComponent<LessonDto> {
  instructors: InstructorDto[] = [];
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
        this.instructors = instructors.filter((instructor) => instructor.active);
        this.cdr.markForCheck();
      },
    });
  }

  protected override openEditForm(lesson: LessonDto): void {
    super.openEditForm(lesson);
    this.form.startAt = this.toLocalDateTime(lesson.startAt);
    this.form.endAt = this.toLocalDateTime(lesson.endAt);
  }

  protected override save(): void {
    this.form.startAt = this.toIsoDateTime(this.form.startAt);
    this.form.endAt = this.toIsoDateTime(this.form.endAt);
    super.save();
  }

  private toLocalDateTime(value: string): string {
    return value ? value.slice(0, 16) : '';
  }

  private toIsoDateTime(value: string): string {
    return value ? new Date(value).toISOString() : '';
  }
}
