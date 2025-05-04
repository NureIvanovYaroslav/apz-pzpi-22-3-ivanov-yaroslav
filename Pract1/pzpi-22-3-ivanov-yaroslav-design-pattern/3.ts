interface ReportStrategy {
    generate(data: any): string;
  }
  
  class JSONReport implements ReportStrategy {
    generate(data: any): string {
      return JSON.stringify(data, null, 2);
    }
  }
  
  class CSVReport implements ReportStrategy {
    generate(data: any): string {
      return Object.keys(data).join(",") + "\n" + Object.values(data).join(",");
    }
  }
  
  class ReportGenerator {
    constructor(private strategy: ReportStrategy) {}
  
    setStrategy(strategy: ReportStrategy) {
      this.strategy = strategy;
    }
  
    export(data: any): string {
      return this.strategy.generate(data);
    }
  }
  
  const report = new ReportGenerator(new JSONReport());
  console.log(report.export({ name: "Ivan", age: 30 }));
  
  report.setStrategy(new CSVReport());
  console.log(report.export({ name: "Ivan", age: 30 }));
  