import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BaseComponent } from '../../shared/component/base/base-component';
import { LessonDto } from './model/lesson-dto';
import { LessonService } from './service/lesson-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [TableModule, DatePipe],
  templateUrl: './lessons.component.html',
})
export class LessonsComponent extends BaseComponent<LessonDto> {
  constructor(memberService: LessonService, cdr: ChangeDetectorRef) {
    super(memberService, cdr, LessonDto);
  }
}
