import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

import { BaseComponent } from '../../shared/component/base/base-component';
import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { AppointmentDto, AppointmentService, AppointmentStatus } from './appointment.service';

type QuickRange = 'TODAY' | 'WEEK' | 'ALL' | 'CUSTOM';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    InputTextModule,
    DatePicker,
    Select,
    TableModule,
    DrawerComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
})
export class AppointmentsComponent extends BaseComponent<AppointmentDto> {
  filterFrom: Date | null = null;
  filterTo: Date | null = null;
  appointmentAtInput: Date | null = null;
  activeRange: QuickRange = 'ALL';

  readonly quickRanges: Array<{ value: QuickRange; label: string; icon: string }> = [
    { value: 'TODAY', label: 'Bugün', icon: 'pi pi-sun' },
    { value: 'WEEK', label: 'Bu Hafta', icon: 'pi pi-calendar' },
    { value: 'ALL', label: 'Tümü', icon: 'pi pi-list' },
  ];

  readonly statuses: Array<{ value: AppointmentStatus; label: string }> = [
    { value: 'SCHEDULED', label: 'Bekliyor' },
    { value: 'CONTACTED', label: 'Görüşüldü' },
    { value: 'CANCELLED', label: 'İptal Edildi' },
  ];

  constructor(
    private readonly appointmentService: AppointmentService,
    cdr: ChangeDetectorRef,
  ) {
    super(appointmentService, cdr, AppointmentDto);
  }

  override openCreateForm(): void {
    super.openCreateForm();
    this.form.status = 'SCHEDULED';
    this.appointmentAtInput = null;
  }

  override openEditForm(item: AppointmentDto): void {
    super.openEditForm(item);
    this.appointmentAtInput = item.appointmentAt ? new Date(item.appointmentAt) : null;
  }

  override save(): void {
    if (!this.appointmentAtInput) {
      this.toastService.error('Randevu tarihi zorunludur.');
      return;
    }

    this.form.appointmentAt = new Date(this.appointmentAtInput).toISOString();
    super.save();
  }

  selectQuickRange(range: QuickRange): void {
    this.activeRange = range;

    const today = new Date();

    if (range === 'TODAY') {
      this.filterFrom = today;
      this.filterTo = today;
    } else if (range === 'WEEK') {
      const start = new Date(today);
      const day = (start.getDay() + 6) % 7;
      start.setDate(start.getDate() - day);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      this.filterFrom = start;
      this.filterTo = end;
    } else {
      this.filterFrom = null;
      this.filterTo = null;
    }

    this.applyFilter();
  }

  onCustomDateChange(): void {
    this.activeRange = 'CUSTOM';
    this.applyFilter();
  }

  applyFilter(): void {
    this.startLoading();

    const toIso = (date: Date | null) => {
      if (!date) return null;
      const pad = (value: number) => value.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    this.appointmentService.findByRange(toIso(this.filterFrom), toIso(this.filterTo)).subscribe({
      next: (items) => {
        this.items = items;
        this.stopLoading();
      },
      error: (error) => {
        this.toastService.error(error?.error?.message ?? 'Randevular yüklenirken bir hata oluştu.');
        this.stopLoading();
      },
    });
  }

  clearFilter(): void {
    this.filterFrom = null;
    this.filterTo = null;
    this.activeRange = 'ALL';
    this.load();
  }

  statusLabel(status: AppointmentStatus): string {
    return this.statuses.find((item) => item.value === status)?.label ?? status;
  }
}
