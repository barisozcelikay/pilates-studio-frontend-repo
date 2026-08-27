import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';

import { BaseComponent } from '../../shared/component/base/base-component';
import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { ReservationPolicyDto, ReservationPolicyService } from './reservation-policy-service';

@Component({
  selector: 'app-reservation-policies',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    TableModule,
    CheckboxModule,
    DrawerComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './reservation-policies.component.html',
  styleUrl: './reservation-policies.component.scss',
})
export class ReservationPoliciesComponent extends BaseComponent<ReservationPolicyDto> {
  constructor(service: ReservationPolicyService, cdr: ChangeDetectorRef) {
    super(service, cdr, ReservationPolicyDto);
  }

  override openCreateForm(): void {
    super.openCreateForm();
    this.form.active = true;
    this.form.freeCancellationEnabled = true;
    this.form.cancellationDeadlineMinutes = 240;
    this.form.latestReservationEnabled = true;
    this.form.latestReservationMinutes = 10;
  }

  onDefaultPolicyChange(): void {
    if (this.form.defaultPolicy) this.form.active = true;
  }
}
