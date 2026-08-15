import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-drawer',
  standalone: true,
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
})
export class DrawerComponent {
  @Input() visible = false;
  @Input() title = '';
  @Input() width = '480px';

  @Output() visibleChange = new EventEmitter<boolean>();

  close(): void {
    this.visibleChange.emit(false);
  }
}
