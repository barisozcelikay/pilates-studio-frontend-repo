import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [TableModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
})
export class MembersComponent {}
