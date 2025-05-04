interface SortStrategy {
    sort(data: number[]): number[];
  }
  
  class BubbleSort implements SortStrategy {
    sort(data: number[]): number[] {
      console.log('Сортування бульбашкою');
      return [...data].sort();
    }
  }
  
  class QuickSort implements SortStrategy {
    sort(data: number[]): number[] {
      console.log('Швидке сортування');
      return [...data].sort();
    }
  }
  
  class Sorter {
    constructor(private strategy: SortStrategy) {}
  
    setStrategy(strategy: SortStrategy) {
      this.strategy = strategy;
    }
  
    sort(data: number[]): number[] {
      return this.strategy.sort(data);
    }
  }
  
  const sorter = new Sorter(new BubbleSort());
  console.log(sorter.sort([5, 3, 1]));
  
  sorter.setStrategy(new QuickSort());
  console.log(sorter.sort([5, 3, 1]));
  