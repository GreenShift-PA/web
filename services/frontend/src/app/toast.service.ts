import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<any>();
  toastState = this.toastSubject.asObservable();

  showSuccessToast(message: string) {
    this.toastSubject.next({ type: 'success', message });
  }

  showErrorToast(message: string) {
    this.toastSubject.next({ type: 'error', message });
  }

  hideToast() {
    this.toastSubject.next(null);
  }
}
