interface DiscountStrategy {
  calculate(price: number): number;
}

class NoDiscount implements DiscountStrategy {
  calculate(price: number): number {
    return price;
  }
}

class BlackFridayDiscount implements DiscountStrategy {
  calculate(price: number): number {
    return price * 0.7;
  }
}

class NewCustomerDiscount implements DiscountStrategy {
  calculate(price: number): number {
    return price * 0.9;
  }
}

class ShoppingCart {
  constructor(private strategy: DiscountStrategy) {}

  setStrategy(strategy: DiscountStrategy) {
    this.strategy = strategy;
  }

  checkout(price: number): number {
    return this.strategy.calculate(price);
  }
}

const cart = new ShoppingCart(new NoDiscount());
console.log(cart.checkout(100));

cart.setStrategy(new BlackFridayDiscount());
console.log(cart.checkout(100));
