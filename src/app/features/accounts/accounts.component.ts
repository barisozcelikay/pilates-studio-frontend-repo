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

  constructor(
    accountService: AccountService,
    cdr: ChangeDetectorRef,
    private readonly profileService: ProfileService,
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
  }
}
