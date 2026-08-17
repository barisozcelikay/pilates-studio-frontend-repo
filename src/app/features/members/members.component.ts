import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BaseComponent } from '../../shared/component/base/base-component';
import { MemberDto } from './model/member-dto';
import { MemberService } from './service/member-service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    FormsModule,
    InputTextModule,
    DrawerComponent,
    DatePicker,
  ],
  templateUrl: './members.component.html',
})
export class MembersComponent extends BaseComponent<MemberDto> {
  constructor(memberService: MemberService, cdr: ChangeDetectorRef) {
    super(memberService, cdr, MemberDto);
  }

  protected override save(): void {
    this.form.membershipStartDate = this.toDateValue(this.form.membershipStartDate);
    this.form.membershipEndDate = this.toDateValue(this.form.membershipEndDate);
    super.save();
  }

  private toDateValue(value: Date | string | null): string | null {
    return value instanceof Date ? value.toISOString().slice(0, 10) : value;
  }
}
