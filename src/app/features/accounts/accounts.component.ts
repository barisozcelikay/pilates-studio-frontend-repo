import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AccountDto } from '../../core/auth/model/account-dto';
import { AccountService } from './service/account-service';
import { DatePipe } from '@angular/common';
import { BaseComponent } from '../../shared/component/base/base-component';
import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { ProfileDto } from '../../core/auth/model/profile-dto';
import { ProfileService } from '../profiles/service/profile-service';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { StudioPackageDto } from '../studio-packages/model/studio-package-dto';
import { StudioPackageService } from '../studio-packages/service/studio-package-service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    ConfirmDialogComponent,
    FormsModule,
    DrawerComponent,
    InputTextModule,
    Select,
  ],
  templateUrl: './accounts.component.html',
})
export class AccountsComponent extends BaseComponent<AccountDto> {
  profiles: ProfileDto[] = [];
  packages: StudioPackageDto[] = [];
  readonly statusOptions = [
    { label: 'Aktif', value: 'ACTIVE' },
    { label: 'Pasif', value: 'PASSIVE' },
    { label: 'E-Mail Onayı Bekliyor', value: 'EMAIL_CONFIRMATION_PENDING' },
  ];

  constructor(
    accountService: AccountService,
    cdr: ChangeDetectorRef,
    private readonly profileService: ProfileService,
    private readonly packageService: StudioPackageService,
  ) {
    super(accountService, cdr, AccountDto);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.profileService.findAll().subscribe({
      next: (profiles) => {
        this.profiles = profiles.filter((profile) => profile.active);
        this.cdr.markForCheck();
      },
    });

    this.packageService.findAll().subscribe({
      next: (packages) => {
        this.packages = packages.filter((item) => item.active);
        this.cdr.markForCheck();
      },
    });
  }

  get isMemberProfile(): boolean {
    return (
      this.profiles.find((profile) => profile.id === this.form.profileId)?.code === 'PROFILE_MEMBER'
    );
  }

  get selectedPackage(): StudioPackageDto | undefined {
    return this.packages.find((item) => item.id === this.form.packageId);
  }

  onProfileChange(): void {
    if (!this.isMemberProfile) this.form.packageId = null;
  }

  protected override save(): void {
    if (
      !this.form.firstName.trim() ||
      !this.form.lastName.trim() ||
      !this.form.phone.trim() ||
      !this.form.profileId
    ) {
      this.toastService.warning('Ad, soyad, telefon ve profil alanları zorunludur.');
      return;
    }
    if (!this.editing && this.isMemberProfile && !this.form.packageId) {
      this.toastService.warning('Üye hesabı için paket seçmelisiniz.');
      return;
    }
    super.save();
  }
}
