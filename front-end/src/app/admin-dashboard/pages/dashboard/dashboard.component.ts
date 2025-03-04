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
  multi: any[] = [];
  view: [number, number] = [500, 200];
  gradient = false;
  showLegend = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  
  chartData = [
    { "name": "Products", "value": 50 },
    { "name": "Orders", "value": 120 },
    { "name": "Users", "value": 80 }
  ];
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

  leastSellers = [
    { name: 'Seller 10', value: 2000 },
    { name: 'Seller 11', value: 1800 },
    { name: 'Seller 12', value: 1500 }
  ];

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

  onlineOfflineSales = [
    { name: 'Online Sales', value: 70000 },
    { name: 'Offline Sales', value: 80000 }
  ];

  inventoryLevels = [
    { name: 'Cairo Branch', value: 20000 },
    { name: 'Alexandria Branch', value: 15000 },
    { name: 'Online Store', value: 10000 }
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

  gaugeData = [
    { "name": "Performance", "value": 65 }
  ];
  
  bubbleChartData = [
    {
      "name": "Product A",
      "series": [
        { "name": "Q1", "x": 30, "y": 20, "r": 15 },
        { "name": "Q2", "x": 80, "y": 60, "r": 30 }
      ]
    },
    {
      "name": "Product B",
      "series": [
        { "name": "Q1", "x": 50, "y": 30, "r": 25 },
        { "name": "Q2", "x": 70, "y": 40, "r": 35 }
      ]
    }
  ];

  heatMapData = [
    { "name": "Branch A", "series": [
        { "name": "Product 1", "value": 30 },
        { "name": "Product 2", "value": 50 },
        { "name": "Product 3", "value": 40 }
      ]
    },
    { "name": "Branch B", "series": [
        { "name": "Product 1", "value": 20 },
        { "name": "Product 2", "value": 60 },
        { "name": "Product 3", "value": 50 }
      ]
    }
  ];
  
  sankeyData = [
    {
      "source": "Branch A",
      "target": "Electronics",
      "value": 200
    },
    {
      "source": "Branch B",
      "target": "Furniture",
      "value": 150
    },
    {
      "source": "Branch A",
      "target": "Clothing",
      "value": 100
    },
    {
      "source": "Branch B",
      "target": "Sports",
      "value": 80
    }
  ];
  
  
}
