import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProfileDto } from '../../core/auth/model/profile-dto';
import { ProfileService } from './service/profile-service';
import {  CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';
import { BaseComponent } from '../../shared/component/base/base-component';


@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DrawerComponent,
    InputTextModule,
    CheckboxModule,
    ConfirmDialogComponent,
  ],
  templateUrl: './profiles.component.html',
})
export class ProfilesComponent extends BaseComponent<ProfileDto> {
  constructor(
    profileService: ProfileService,
    cdr: ChangeDetectorRef) {
    super(profileService, cdr, ProfileDto);
  }

}
