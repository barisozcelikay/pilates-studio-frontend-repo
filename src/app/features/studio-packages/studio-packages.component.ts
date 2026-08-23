import { ChangeDetectorRef, Component } from '@angular/core';
import { TableModule } from 'primeng/table'; import { FormsModule } from '@angular/forms'; import { InputTextModule } from 'primeng/inputtext'; import { TextareaModule } from 'primeng/textarea'; import { CheckboxModule } from 'primeng/checkbox';
import { BaseComponent } from '../../shared/component/base/base-component'; import { DrawerComponent } from '../../shared/component/drawer/drawer.component'; import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';
import { StudioPackageDto } from './model/studio-package-dto';
import { StudioPackageService } from './service/studio-package-service';
import { InputNumber } from 'primeng/inputnumber';
import { DatePipe, DecimalPipe, NgIf } from '@angular/common';
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
    DrawerComponent,
    ConfirmDialogComponent,
    InputNumber,
    DatePipe,
    DecimalPipe,
    NgIf,
  ],
  templateUrl: './studio-packages.component.html',
})
export class StudioPackagesComponent extends BaseComponent<StudioPackageDto> {
  constructor(service: StudioPackageService, cdr: ChangeDetectorRef) {
    super(service, cdr, StudioPackageDto);
  }
}
