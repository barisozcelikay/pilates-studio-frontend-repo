import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BaseComponent } from '../../shared/component/base/base-component';
import { MemberDto } from './model/member-dto';
import { MemberService } from './service/member-service';
import { DatePipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { Select } from 'primeng/select';
import { RouterLink } from '@angular/router';
import { MembershipDto, MembershipService } from './service/membership-service';
import { StudioPackageService } from '../studio-packages/service/studio-package-service';
import { StudioPackageDto } from '../studio-packages/model/studio-package-dto';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    NgFor,
    FormsModule,
    InputTextModule,
    DrawerComponent,
    Select,
    RouterLink,
  ],
  templateUrl: './members.component.html',
})
export class MembersComponent extends BaseComponent<MemberDto> {
  memberships: MembershipDto[] = [];
  packages: StudioPackageDto[] = [];
  selectedPackageId: number | null = null;

  constructor(
    memberService: MemberService,
    cdr: ChangeDetectorRef,
    private readonly membershipService: MembershipService,
    packageService: StudioPackageService,
  ) {
    super(memberService, cdr, MemberDto);
    packageService
      .findAll()
      .subscribe({ next: (packages) => (this.packages = packages.filter((item) => item.active)) });
  }

  protected override openEditForm(member: MemberDto): void {
    super.openEditForm(member);
    this.memberships = [];
    this.selectedPackageId = null;
    if (member.id)
      this.membershipService
        .findAll(member.id)
        .subscribe({ next: (items) => (this.memberships = items) });
  }

  assignPackage(): void {
    if (!this.form.id || !this.selectedPackageId) return;
    this.membershipService.create(this.form.id, this.selectedPackageId).subscribe({
      next: () =>
        this.membershipService
          .findAll(this.form.id!)
          .subscribe({ next: (items) => (this.memberships = items) }),
    });
  }

  protected override save(): void {
    this.form.birthDate = this.toDateValue(this.form.birthDate);
    this.form.membershipStartDate = this.toDateValue(this.form.membershipStartDate);
    this.form.membershipEndDate = this.toDateValue(this.form.membershipEndDate);
    super.save();
  }

  private toDateValue(value: Date | string | null): string | null {
    return value instanceof Date ? value.toISOString().slice(0, 10) : value;
  }
}
