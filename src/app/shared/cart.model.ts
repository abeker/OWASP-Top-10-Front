import { Car } from './car.model';
import { Ad } from './ad.model';

export class Cart {
  constructor(
    public ad: Ad,
    public car: Car
  ) {}
}

