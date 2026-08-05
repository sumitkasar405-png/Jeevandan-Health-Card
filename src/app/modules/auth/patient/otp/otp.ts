import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-otp',
  imports: [RouterLink],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
})
export class Otp {
  moveToNext(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1) {
      (input.nextElementSibling as HTMLInputElement | null)?.focus();
    }
  }

  moveToPrevious(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value) {
      (input.previousElementSibling as HTMLInputElement | null)?.focus();
    }
  }

  preventSubmit(event: SubmitEvent): void {
    event.preventDefault();
  }
}
