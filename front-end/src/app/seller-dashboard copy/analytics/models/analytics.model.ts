export interface AnalyticsData {
  sales: {
    date: string;
    amount: number;
    count: number;
  }[];
  topProducts: {
    name: string;
    sales: number;
    revenue: number;
  }[];
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalSales: number;
    averageOrderValue: number;
  };
}