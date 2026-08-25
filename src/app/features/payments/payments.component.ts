import { DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

import { BaseComponent } from '../../shared/component/base/base-component';
import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import {
  PaymentDto,
  PaymentMethod,
  PaymentOptionDto,
  PaymentService,
  PaymentStatus,
} from './payment-service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    NgIf,
    FormsModule,
    DrawerComponent,
    ConfirmDialogComponent,
    Select,
    TableModule,
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export class PaymentsComponent extends BaseComponent<PaymentDto> {
  options: PaymentOptionDto[] = [];

  readonly methods = [
    { label: 'Nakit', value: 'CASH' },
    { label: 'Kart', value: 'CARD' },
  ];
  readonly statuses = [
    { label: 'Ödendi', value: 'PAID' },
    { label: 'Ödenmedi', value: 'UNPAID' },
  ];

  constructor(
    private readonly paymentService: PaymentService,
    changeDetector: ChangeDetectorRef,
  ) {
    super(paymentService, changeDetector, PaymentDto);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadOptions();
  }

  override openCreateForm(): void {
    super.openCreateForm();
    this.form.paymentMethod = 'CASH';
  }

  selectMembership(): void {
    const option = this.options.find((item) => item.membershipId === this.form.membershipId);
    const existing = this.items.find((item) => item.membershipId === this.form.membershipId);

    if (existing) {
      this.toastService.warning(
        'Bu üyelik için zaten ödeme kaydı var. Düzenleme işlemini kullanın.',
      );
      this.form.membershipId = null;
      return;
    }

    this.form.amount = option?.price ?? null;
    this.form.paymentMethod = 'CASH';
    this.form.status = 'UNPAID';
    this.form.note = '';
  }

  paymentStatusLabel(status: PaymentStatus): string {
    return status === 'PAID' ? 'Ödendi' : 'Ödenmedi';
  }

  paymentMethodLabel(method: PaymentMethod | null): string {
    return method === 'CASH' ? 'Nakit' : method === 'CARD' ? 'Kart' : '-';
  }

  private loadOptions(): void {
    this.paymentService.findOptions().subscribe({
      next: (options) => {
        this.options = options.map((option) => ({
          ...option,
          displayLabel: `${option.memberName} · ${option.packageName}`,
        }));
      },
      error: (error) => {
        this.toastService.error(error?.error?.message ?? 'Üye ve paket listesi yüklenemedi.');
      },
    });
  }
}
