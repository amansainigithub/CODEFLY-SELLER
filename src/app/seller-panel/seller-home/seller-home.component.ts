import { Component } from '@angular/core';
import { PincodeService } from '../../_services/pincodeService/pincode.service';
import { ChartConfiguration, ChartType } from 'chart.js';
declare var Cashfree: any;

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrl: './seller-home.component.css',
})
export class SellerHomeComponent {
  
  constructor() {}

   //CHART-JS
  combined = [
    { productDate: "23-Nov-2025", productName: "Neeman's Tread Basics Shoes for Men" },
    { productDate: "23-Nov-2025", productName: "Centrino Mens 6581 Running Shoes" },
    { productDate: "30-Jan-2025", productName: "Centrino Mens 6581 Running Shoes" },
    { productDate: "30-Nov-2025", productName: "Centrino Mens 6581 Running Shoes" },
    { productDate: "01-Mar-2025", productName: "Noble Monk Mens Relax Fit Hooded Shirt" },
    { productDate: "01-Mar-2025", productName: "Noble Monk Mens Relax Fit Hooded Shirt" },
    { productDate: "23-Feb-2025", productName: "Embroidered Kashmiri Tunic Top" },
    { productDate: "23-Mar-2025", productName: "KLOSIA Women's Rayon Printed Anarkali Kurta" },
    { productDate: "23-Mar-2025", productName: "Lymio Jackets" },
    { productDate: "23-Dec-2025", productName: "Noble Monk Mens Relax Fit Hooded Shirt" },
    { productDate: "23-Nov-2025", productName: "IndoPrimo Men's Regular Fit Casual Shirt" },
    { productDate: "23-Dec-2025", productName: "Symbol Premium Men's Casual Cotton Poplin Shirt" },
    { productDate: "23-Jul-2025", productName: "Lymio Jackets" },
    { productDate: "23-Jul-2025", productName: "Noble Monk Mens Relax Fit Hooded Shirt" },
    { productDate: "01-Jan-2025", productName: "Noble Monk Mens Relax Fit Hooded Shirt" },
    { productDate: "01-Jan-2025", productName: "Noble Monk Mens Relax Fit Hooded Shirt" },
    { productDate: "01-Jan-2025", productName: "Noble Monk Mens Relax Fit Hooded Shirt" },
    { productDate: "01-Jan-2025", productName: "Noble Monk Mens Relax Fit Hooded Shirt" },
    { productDate: "01-Jan-2025", productName: "Noble Monk Mens Relax Fit Hooded Shirt" },
    { productDate: "01-Jan-2025", productName: "Noble Monk Mens Relax Fit Hooded Shirt" },
    { productDate: "01-Jan-2025", productName: "Noble Monk Mens Relax Fit Hooded Shirt" },
    { productDate: "01-Jan-2025", productName: "Noble Monk Mens Relax Fit Hooded Shirt" },
  ];

  // Months Jan → Dec
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Month-wise product count
  monthCounts = this.months.map((month, i) => {
    // i + 1 because months are 1-indexed in JS Date
    return this.combined.filter(item => {
      const monthIndex = new Date(item.productDate).getMonth(); // 0 = Jan
      return monthIndex === i;
    }).length;
  });

  // Chart type
public chartType: ChartType = 'line';

// Chart data
public chartData: ChartConfiguration['data'] = {
  labels: this.months,
  datasets: [
    {
      label: 'Products per Month',
      data: this.monthCounts,
      borderWidth: 2,
      borderColor: '#2472b2ff',
      backgroundColor: '#2472b2aa', // optional for area fill
      fill: false,                   // line chart without fill
      cubicInterpolationMode: 'monotone' // linear interpolation (default)
    }
  ]
};

// Chart options
public chartOptions: ChartConfiguration['options'] = {
  responsive: true,
  plugins: {
    legend: {
      display: true
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      grid: {
        display: false
      },
      beginAtZero: true
    }
  }
};
// CHART JS


}
