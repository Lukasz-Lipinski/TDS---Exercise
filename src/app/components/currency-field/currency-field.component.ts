import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-currency-field',
  templateUrl: './currency-field.component.html',
  styleUrls: ['./currency-field.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class CurrencyFieldComponent {
  isReadonly = input<boolean>(false);
  controlName = input.required<string>();
  FormGroup = input.required<FormGroup>();

  onChangeValue($event: KeyboardEvent) {
    if (
      $event.key === 'Backspace' ||
      ($event.target as HTMLInputElement).value.indexOf('.') === -1
    ) {
      return;
    }

    if (!/^\d*(\.\d{1,2})?$/.test($event.key)) {
      $event.preventDefault();
    }
  }
}
