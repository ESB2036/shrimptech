export interface MonthlySales {
  month: string;
  year: number;
  sales: number;
  growth: number;
}

export interface TopClient {
  id: number;
  name: string;
  totalPurchases: number;
  percentage: number;
}

export interface SalesFilter {
  startDate: Date;
  endDate: Date;
  clientType: string;
  category: string;
}