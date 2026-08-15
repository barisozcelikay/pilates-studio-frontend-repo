import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastSubject = new Subject<ToastMessage>();

  readonly toast$ = this.toastSubject.asObservable();

  private nextId = 0;

  success(message: string, duration = 3000): void {
    this.show('success', message, duration);
  }

  error(message: string, duration = 4000): void {
    this.show('error', message, duration);
  }

  warning(message: string, duration = 4000): void {
    this.show('warning', message, duration);
  }

  info(message: string, duration = 3000): void {
    this.show('info', message, duration);
  }

  private show(type: ToastType, message: string, duration: number): void {
    this.toastSubject.next({
      id: ++this.nextId,
      type,
      message,
      duration,
    });
  }
}
