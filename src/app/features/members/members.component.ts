import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BaseComponent } from '../../shared/component/base/base-component';
import { MemberDto } from './model/member-dto';
import { MemberService } from './service/member-service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-members',
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
  templateUrl: './members.component.html',
})
export class MembersComponent extends BaseComponent<MemberDto> {
  constructor(memberService: MemberService, cdr: ChangeDetectorRef) {
    super(memberService, cdr, MemberDto);
  }
}
