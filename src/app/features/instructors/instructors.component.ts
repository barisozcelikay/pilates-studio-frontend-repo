import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BaseComponent } from '../../shared/component/base/base-component';
import { InstructorService } from './service/instructor-service';
import { InstructorDto } from './model/instructor-dto';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [TableModule, FormsModule, InputTextModule, TextareaModule, DrawerComponent],
  templateUrl: './instructors.component.html',
})
export class InstructorsComponent extends BaseComponent<InstructorDto> {
  constructor(memberService: InstructorService, cdr: ChangeDetectorRef) {
    super(memberService, cdr, InstructorDto);
  }
}
