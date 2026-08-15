import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-menu-settings',
  standalone: true,
  imports: [TableModule],
  templateUrl: './menu-settings.component.html',
  styleUrl: './menu-settings.component.scss',
})
export class MenuSettingsComponent {}
