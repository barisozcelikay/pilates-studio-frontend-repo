import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BaseComponent } from '../../shared/component/base/base-component';
import { InstructorService } from './service/instructor-service';
import { DatePipe } from '@angular/common';
import { InstructorDto } from './model/instructor-dto';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [TableModule, DatePipe],
  templateUrl: './instructors.component.html',
})
export class InstructorsComponent extends BaseComponent<InstructorDto> {
  constructor(memberService: InstructorService, cdr: ChangeDetectorRef) {
    super(memberService, cdr, InstructorDto);
  }
}
