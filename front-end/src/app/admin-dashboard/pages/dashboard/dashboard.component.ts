import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule,ApexOptions } from "ng-apexcharts";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxChartsModule,NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  chartData = [
    { "name": "Products", "value": 50 },
    { "name": "Orders", "value": 120 },
    { "name": "Users", "value": 80 }
  ];

  ngxChartData = [
    { name: 'January', value: 5000 },
    { name: 'February', value: 3000 },
    { name: 'March', value: 7000 }
  ];

  multi: any[] = [];
  //view: [number, number] = [700, 400];

  // Chart options
  // showXAxis = true;
  // showYAxis = true;
  // gradient = false;
  // showLegend = true;
  // showXAxisLabel = true;
  // xAxisLabel = 'Months';
  // showYAxisLabel = true;
  // yAxisLabel = 'Sales';
  // barPadding = 10;
  // groupPadding = 20;

  constructor() {
    this.multi = [
      {
        "name": "Product A",
        "series": [
          { "name": "January", "value": 50 },
          { "name": "February", "value": 80 },
          { "name": "March", "value": 60 },
          { "name": "April", "value": 100 }
        ]
      },
      {
        "name": "Product B",
        "series": [
          { "name": "January", "value": 40 },
          { "name": "February", "value": 60 },
          { "name": "March", "value": 90 },
          { "name": "April", "value": 120 }
        ]
      }
    ];    
  }
  view: [number, number] = [500, 200];
  gradient = false;
  showLegend = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Months';
  yAxisLabel ='Sales';
  
  
  // مبيعات الفروع
  // branchSales = [
  //   { name: 'Cairo Branch', value: 50000 },
  //   { name: 'Alexandria Branch', value: 30000 },
  //   { name: 'Online Store', value: 70000 }
  // ];

  // المنتجات الأكثر والأقل مبيعًا
  // bestSellingProducts = [
  //   { name: 'Product A', value: 10000 },
  //   { name: 'Product B', value: 8000 },
  //   { name: 'Product C', value: 6000 }
  // ];

  // leastSellingProducts = [
  //   { name: 'Product X', value: 1000 },
  //   { name: 'Product Y', value: 800 },
  //   { name: 'Product Z', value: 500 }
  // ];

  // // أفضل وأقل البائعين مبيعًا
  // bestSellers = [
  //   { name: 'Seller 1', value: 20000 },
  //   { name: 'Seller 2', value: 15000 },
  //   { name: 'Seller 3', value: 10000 }
  // ];

  leastSellers = [
    { name: 'Seller 10', value: 2000 },
    { name: 'Seller 11', value: 1800 },
    { name: 'Seller 12', value: 1500 }
  ];

  // توزيع المنتجات عبر الفروع
  productDistribution = [
    {
      name: 'Product A',
      series: [
        { name: 'Cairo Branch', value: 5000 },
        { name: 'Alexandria Branch', value: 3000 },
        { name: 'Online Store', value: 7000 }
      ]
    },
    {
      name: 'Product B',
      series: [
        { name: 'Cairo Branch', value: 4000 },
        { name: 'Alexandria Branch', value: 2000 },
        { name: 'Online Store', value: 6000 }
      ]
    }
  ];

  // مبيعات الأونلاين مقابل الأوفلاين
  onlineOfflineSales = [
    { name: 'Online Sales', value: 70000 },
    { name: 'Offline Sales', value: 80000 }
  ];

  // مستويات المخزون في الفروع
  inventoryLevels = [
    { name: 'Cairo Branch', value: 20000 },
    { name: 'Alexandria Branch', value: 15000 },
    { name: 'Online Store', value: 10000 }
  ];

  // الأداء الشهري للفروع
  // monthlyPerformance = [
  //   {
  //     name: 'Cairo Branch',
  //     series: [
  //       { name: 'January', value: 10000 },
  //       { name: 'February', value: 12000 },
  //       { name: 'March', value: 9000 }
  //     ]
  //   },
  //   {
  //     name: 'Online Store',
  //     series: [
  //       { name: 'January', value: 15000 },
  //       { name: 'February', value: 17000 },
  //       { name: 'March', value: 14000 }
  //     ]
  //   }
  // ];

  // inventoryPerformance = [
  //   { "name": "Branch A", "value": 75 },
  //   { "name": "Branch B", "value": 60 },
  //   { "name": "Branch C", "value": 90 }
  // ];
  
  // branchComparison = [
  //   { "name": "Online Branch", "value": 50000 },
  //   { "name": "Offline Branch A", "value": 35000 },
  //   { "name": "Offline Branch B", "value": 42000 },
  //   { "name": "Offline Branch C", "value": 39000 }
  // ];

  branchSales = [
    { "name": "Cairo Branch", "value": 50000 },
    { "name": "Alex Branch", "value": 30000 },
    { "name": "Online Store", "value": 70000 }
  ];
  
  bestSellingProducts = [
    { "name": "Product A", "value": 1500 },
    { "name": "Product B", "value": 1200 },
    { "name": "Product C", "value": 900 }
  ];
  
  leastSellingProducts = [
    { "name": "Product X", "value": 100 },
    { "name": "Product Y", "value": 80 },
    { "name": "Product Z", "value": 50 }
  ];
  
  bestSellers = [
    { "name": "Seller 1", "value": 50000 },
    { "name": "Seller 2", "value": 30000 },
    { "name": "Seller 3", "value": 25000 }
  ];
  
  inventoryPerformance = [
    { "name": "Stock Level", "value": 80 }
  ];
  
  monthlyPerformance = [
    {
      "name": "Cairo Branch",
      "series": [
        { "name": "January", "value": 40000 },
        { "name": "February", "value": 35000 },
        { "name": "March", "value": 45000 }
      ]
    },
    {
      "name": "Alex Branch",
      "series": [
        { "name": "January", "value": 20000 },
        { "name": "February", "value": 18000 },
        { "name": "March", "value": 22000 }
      ]
    }
  ];
  
  branchComparison = [
    { "name": "Cairo Branch", "value": 50000 },
    { "name": "Alex Branch", "value": 30000 },
    { "name": "Online Store", "value": 70000 }
  ];
  salesOverTime = [
    { name: 'January', value: 25000 },
    { name: 'February', value: 30000 },
    { name: 'March', value: 28000 },
    { name: 'April', value: 32000 },
    { name: 'May', value: 31000 },
    { name: 'June', value: 29000 }
  ];
  
  
  
}
