import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { CurrenciesList, Rate } from './abstractions';
import { API_KEY } from '../../environmant/env';

@Injectable({
  providedIn: 'root',
})
export class CurrenciesService {
  private http = inject(HttpClient);
  private url = 'https://api.currencybeacon.com/v1';

  constructor() {}

  getCurrencyList(): Observable<Rate[]> {
    const url = `${this.url}/latest`;

    return this.http.get<CurrenciesList>(url).pipe(
      map((data) =>
        Object.entries(data.rates).map(
          (el) =>
            ({
              currency: el[0],
              value: el[1],
            } as Rate)
        )
      )
    );
  }

  convertValue(to: string, from: string, amount: number): Observable<number> {
    const url = `${this.url}/convert`;
    return this.http
      .get<ResponseFromBackend>(url, {
        params: {
          to,
          from,
          amount,
        },
      })
      .pipe(map((result) => result.value));
  }
}

type ResponseFromBackend = {
  to: string;
  value: number;
};
