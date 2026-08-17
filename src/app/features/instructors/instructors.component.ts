import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BaseComponent } from '../../shared/component/base/base-component';
import { InstructorService } from './service/instructor-service';
import { DatePipe } from '@angular/common';
import { InstructorDto } from './model/instructor-dto';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    FormsModule,
    InputTextModule,
    CheckboxModule,
    DrawerComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './instructors.component.html',
})
export class InstructorsComponent extends BaseComponent<InstructorDto> {
  constructor(memberService: InstructorService, cdr: ChangeDetectorRef) {
    super(memberService, cdr, InstructorDto);
  }
}
