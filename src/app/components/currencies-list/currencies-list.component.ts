import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rate } from '../../services/currencies/abstractions';

@Component({
  selector: 'app-currencies-list',
  templateUrl: './currencies-list.component.html',
  styleUrls: ['./currencies-list.component.css'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrenciesListComponent {
  currenciesList = input.required<Rate[]>();
  selectedCurrency = output<Rate>();

  constructor() {}

  onChooseCurrency(event: Event) {
    const target = event.currentTarget as HTMLSelectElement;
    this.selectedCurrency.emit(this.currenciesList()[target.selectedIndex]);
  }
}
