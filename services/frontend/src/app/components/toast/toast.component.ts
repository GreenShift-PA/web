import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  @Input() toastText: string='';
  @Input() toastIcon: string='';
  show: boolean = false;
  ngOnInit(): void {
    // Show the toast
    this.show = true;

    // Automatically hide the toast after 2 seconds
    setTimeout(() => {
      this.show = false;
    }, 2000);
  }
}
