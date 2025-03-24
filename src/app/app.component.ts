import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { CurrenciesListComponent } from './components/currencies-list/currencies-list.component';
import { CurrencyFieldComponent } from './components/currency-field/currency-field.component';
import { Rate } from './services/currencies/abstractions';
import { CurrenciesService } from './services/currencies/currencies.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CurrenciesListComponent, CurrencyFieldComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'ex-lukasz-lipinski';

  private currenciesService = inject(CurrenciesService);
  private fb = inject(FormBuilder);
  selectedCurrencies!: SelectedCurrenciesType;

  currenciesList = signal<Rate[]>([]);

  currencyFromGroup!: FormGroup<{
    currencyToExchange: FormControl<number>;
    exchangedCurrency: FormControl<number>;
  }>;

  isLoading = signal<boolean>(false);
  isError = signal<boolean>(false);

  private preloadCurrenciesList = effect(() => {
    untracked(() => {
      this.currenciesService
        .getCurrencyList()
        .pipe(
          catchError((err) => {
            this.isError.set(true);
            throw err;
          })
        )
        .subscribe({
          next: (preloadedCurrenciesList) => {
            this.currenciesList.set(preloadedCurrenciesList);
            this.selectedCurrencies = {
              from: preloadedCurrenciesList[0],
              to: preloadedCurrenciesList[0],
            };
          },
        });
    });
  });

  ngOnInit() {
    this.currencyFromGroup = this.fb.group({
      currencyToExchange: this.fb.control<number>(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      exchangedCurrency: this.fb.control<number>(0, {
        nonNullable: true,
      }),
    });
  }

  onSelectCurrency(selectedItem: Rate, isFrom: boolean = false) {
    this.selectedCurrencies = {
      from: isFrom ? selectedItem : this.selectedCurrencies.from,
      to: !isFrom ? selectedItem : this.selectedCurrencies.to,
    };
  }

  onClickConvertCurrency() {
    this.isLoading.set(true);

    if (this.selectedCurrencies.from && this.selectedCurrencies.to) {
      this.currenciesService
        .convertValue(
          this.selectedCurrencies.to.currency,
          this.selectedCurrencies.from.currency,
          this.currencyFromGroup.get('currencyToExchange')!.value
        )
        .pipe(
          catchError((err) => {
            this.isError.set(true);
            throw err;
          })
        )
        .subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.currencyFromGroup.get('exchangedCurrency')?.setValue(res);
          },
        });
    }
  }

  checkIfDisabled = () =>
    this.currencyFromGroup.get('currencyToExchange')?.invalid;
}

type SelectedCurrenciesType = {
  from: Rate;
  to: Rate;
};
