import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { MemberService } from '../members/service/member-service';
import { MemberDto } from '../members/model/member-dto';
import { MembershipDto, MembershipService } from '../members/service/membership-service';
import { StudioPackageDto } from '../studio-packages/model/studio-package-dto';
import { StudioPackageService } from '../studio-packages/service/studio-package-service';
import { ReservationDto, ReservationService } from '../reservations/service/reservation-service';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastService } from '../../shared/service/toast-service';
import { MemberMeasurementDto } from './model/member-measurement-dto';
import { MemberMeasurementService } from './service/member-measurement-service';

@Component({ selector: 'app-member-memberships', standalone: true, imports: [RouterLink, DatePipe, NgFor, NgIf, FormsModule, InputTextModule, TextareaModule, Select, Tabs, TabList, Tab, TabPanels, TabPanel, DrawerComponent], templateUrl: './member-memberships.component.html', styleUrl: './member-memberships.component.scss' })
export class MemberMembershipsComponent implements OnInit {
  member: MemberDto | null = null; memberships: MembershipDto[] = []; lessonReservations: ReservationDto[] = []; measurements: MemberMeasurementDto[] = []; packages: StudioPackageDto[] = []; selectedPackageId: number | null = null; assigning = false; packageDrawerVisible = false; measurementDrawerVisible = false; measurementChartVisible = false; savingMeasurement = false; editingMeasurement = false; measurement = new MemberMeasurementDto();
  readonly chartMetrics = [
    { key: 'weightKg', label: 'Kilo', unit: 'kg', color: '#B88A42' },
    { key: 'bodyFatPercentage', label: 'Yağ Oranı', unit: '%', color: '#9B7EAF' },
    { key: 'chestCm', label: 'Göğüs', unit: 'cm', color: '#C06C5A' },
    { key: 'waistCm', label: 'Bel', unit: 'cm', color: '#6D8A75' },
    { key: 'hipCm', label: 'Kalça', unit: 'cm', color: '#7489A7' },
  ] as const;
  readonly chartGroups = [
    { unit: 'kg', title: 'Kilo Takibi' },
    { unit: '%', title: 'Yağ Oranı' },
    { unit: 'cm', title: 'Vücut Ölçüleri' },
  ] as const;
  visibleChartMetrics: Record<string, boolean> = Object.fromEntries(this.chartMetrics.map((metric) => [metric.key, true]));
  private memberId = 0;
  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly memberService: MemberService, private readonly membershipService: MembershipService, private readonly packageService: StudioPackageService, private readonly reservationService: ReservationService, private readonly measurementService: MemberMeasurementService, private readonly toastService: ToastService, private readonly cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.memberId = Number(this.route.snapshot.paramMap.get('id')); this.member = (this.router.getCurrentNavigation()?.extras.state?.['member'] ?? history.state?.member ?? null) as MemberDto | null; this.memberService.findById(this.memberId).subscribe({next: value => this.member = value}); this.load(); }
  onTabChange(tab: string | number | undefined): void { if (tab === 'memberships') this.load(); if (tab === 'measurements') this.loadMeasurements(); if (tab === 'lessons') this.loadLessons(); }
  openPackageDrawer(): void { this.packageDrawerVisible = true; if (!this.packages.length) this.packageService.findAll().subscribe({next: values => this.packages = values.filter(value => value.active)}); }
  assign(): void { if (!this.selectedPackageId) return; this.assigning = true; this.membershipService.create(this.memberId, this.selectedPackageId).subscribe({next: () => { this.selectedPackageId = null; this.assigning = false; this.packageDrawerVisible = false; this.load(); }, error: () => this.assigning = false}); }
  openMeasurement(item?: MemberMeasurementDto): void { this.editingMeasurement = !!item; this.measurement = item ? { ...item } : { measuredAt: new Date().toISOString().slice(0, 10) }; this.measurementDrawerVisible = true; }
  saveMeasurement(): void { if (!this.measurement.measuredAt) { this.toastService.warning('Ölçüm tarihi seçilmelidir.'); return; } this.savingMeasurement = true; const request = { ...this.measurement, memberId: this.memberId }; const operation = this.editingMeasurement && this.measurement.id ? this.measurementService.update(this.memberId, this.measurement.id, request) : this.measurementService.create(this.memberId, request); operation.subscribe({next: () => { this.savingMeasurement = false; this.measurementDrawerVisible = false; this.toastService.success(`Ölçüm başarıyla ${this.editingMeasurement ? 'güncellendi' : 'eklendi'}.`); this.loadMeasurements(); }, error: (error) => { this.savingMeasurement = false; this.toastService.error(error?.error?.message ?? 'Ölçüm kaydedilirken hata oluştu.'); }}); }
  deleteMeasurement(item: MemberMeasurementDto): void { if (!item.id || !confirm('Bu ölçüm kaydını silmek istiyor musunuz?')) return; this.measurementService.delete(this.memberId, item.id).subscribe({next: () => { this.toastService.success('Ölçüm kaydı silindi.'); this.loadMeasurements(); }, error: (error) => this.toastService.error(error?.error?.message ?? 'Ölçüm silinirken hata oluştu.')}); }
  chartMeasurements(): MemberMeasurementDto[] { return this.measurements.slice().reverse(); }
  hasChartValues(): boolean { return this.chartMeasurements().some((item) => this.chartMetrics.some((metric) => item[metric.key] != null)); }
  toggleChartMetric(key: string): void { this.visibleChartMetrics[key] = !this.visibleChartMetrics[key]; }
  hasUnitChartValues(unit: string): boolean { return this.chartMeasurements().some((item) => this.chartMetrics.some((metric) => metric.unit === unit && this.visibleChartMetrics[metric.key] && item[metric.key] != null)); }
  chartUnitMin(unit: string): number { const values = this.chartUnitValues(unit); return values.length ? Math.min(...values) : 0; }
  chartUnitMax(unit: string): number { const values = this.chartUnitValues(unit); return values.length ? Math.max(...values) : 0; }
  chartUnitMiddle(unit: string): number { return (this.chartUnitMin(unit) + this.chartUnitMax(unit)) / 2; }
  chartPoints(key: keyof MemberMeasurementDto, unit: string): string { const items = this.chartMeasurements(); const values = items.flatMap((item) => this.chartMetrics.filter((metric) => metric.unit === unit && this.visibleChartMetrics[metric.key] && item[metric.key] != null).map((metric) => Number(item[metric.key]))); const min = Math.min(...values); const range = Math.max(...values) - min || 1; return items.map((item, index) => { const value = item[key]; const x = items.length === 1 ? 150 : 18 + index * (264 / (items.length - 1)); return value == null ? null : `${x},${122 - ((Number(value) - min) / range) * 92}`; }).filter((point): point is string => point !== null).join(' '); }
  private chartUnitValues(unit: string): number[] { return this.chartMeasurements().flatMap((item) => this.chartMetrics.filter((metric) => metric.unit === unit && this.visibleChartMetrics[metric.key] && item[metric.key] != null).map((metric) => Number(item[metric.key]))); }
  private load(): void { this.membershipService.findAll(this.memberId).subscribe({next: values => { this.memberships = [...values]; this.cdr.detectChanges(); }}); }
  private loadMeasurements(): void { this.measurementService.findAll(this.memberId).subscribe({next: values => { this.measurements = [...values]; this.cdr.detectChanges(); }}); }
  private loadLessons(): void { this.reservationService.findAllByMemberId(this.memberId).subscribe({next: values => { this.lessonReservations = [...values]; this.cdr.detectChanges(); }}); }
}
