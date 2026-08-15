import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ToastMessage, ToastService } from '../../service/toast-service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];

  private readonly destroy$ = new Subject<void>();
  private readonly timeoutIds = new Map<number, ReturnType<typeof setTimeout>>();

  constructor(
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.toastService.toast$.pipe(takeUntil(this.destroy$)).subscribe((toast) => {
      this.toasts = [...this.toasts, toast];

      if (toast.duration && toast.duration > 0) {
        const timeoutId = setTimeout(() => {
          this.remove(toast.id);
        }, toast.duration);

        this.timeoutIds.set(toast.id, timeoutId);
      }

      this.cdr.markForCheck();
    });
  }

  close(id: number): void {
    this.remove(id);
  }

  ngOnDestroy(): void {
    this.timeoutIds.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });

    this.timeoutIds.clear();

    this.destroy$.next();
    this.destroy$.complete();
  }

  private remove(id: number): void {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);

    const timeoutId = this.timeoutIds.get(id);

    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutIds.delete(id);
    }

    this.cdr.markForCheck();
  }
}
