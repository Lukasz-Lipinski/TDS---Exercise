export type RateType = Record<string, number>;

export interface CurrenciesList {
  meta: {
    code: number;
    disclaimer: string;
  };
  response: {
    date: string;
    base: string;
    rates: RateType;
  };
  date: string;
  base: string;
  rates: RateType;
}

export type Rate = {
  currency: string;
  value: number;
};
