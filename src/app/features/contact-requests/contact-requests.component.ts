import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table';

import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';
import { BaseComponent } from '../../shared/component/base/base-component';
import {
  ContactRequestDto,
  ContactRequestService,
  ContactRequestStatus,
} from './contact-request.service';

@Component({
  selector: 'app-contact-requests',
  standalone: true,
  imports: [DatePipe, TableModule, ConfirmDialogComponent],
  templateUrl: './contact-requests.component.html',
  styleUrl: './contact-requests.component.scss',
})
export class ContactRequestsComponent extends BaseComponent<ContactRequestDto> {
  readonly statuses: Array<{ value: ContactRequestStatus; label: string }> = [
    { value: 'NEW', label: 'Yeni' },
    { value: 'CONTACTED', label: 'Görüşüldü' },
    { value: 'CLOSED', label: 'Kapatıldı' },
  ];

  get newRequestCount(): number {
    return this.items.filter((request) => request.status === 'NEW').length;
  }

  constructor(
    private readonly contactRequestService: ContactRequestService,
    cdr: ChangeDetectorRef,
  ) {
    super(contactRequestService, cdr, ContactRequestDto);
  }

  updateStatus(request: ContactRequestDto, status: ContactRequestStatus): void {
    const previousStatus = request.status;
    request.status = status;
    if (!request.id) return;

    this.contactRequestService.updateStatus(request.id, status).subscribe({
      next: (updated) => {
        request.status = updated.status;
        this.toastService.success('Talep durumu güncellendi.');
      },
      error: () => {
        request.status = previousStatus;
        this.toastService.error('Talep durumu güncellenemedi.');
      },
    });
  }

  statusLabel(status: ContactRequestStatus): string {
    return this.statuses.find((item) => item.value === status)?.label ?? status;
  }
}
