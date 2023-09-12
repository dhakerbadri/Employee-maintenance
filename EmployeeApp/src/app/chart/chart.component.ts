import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'angular-highcharts';
import { range } from 'rxjs';
import { EmployeeDetail } from '../shared/model-api.model';
import { EmployeeService } from '../shared/service-api.service';

const salaryRanges = [
  { label: 'Minimum Wage %', min: 0, max: 2000 },
  { label: 'Medium Wage %', min: 2000, max: 3500 },
  { label: 'Higher Wage %', min: 3500, max: 7000 },
];

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
})
export class ChartComponent {
  salaryRangePercentages: string[] = [];
  chart: Chart = new Chart();
  dataSource: MatTableDataSource<EmployeeDetail>;

  constructor(public service: EmployeeService) {
    this.dataSource = new MatTableDataSource<EmployeeDetail>();
  }

  ngOnInit() {
    this.service.employeeData$.subscribe((data) => {
      this.loadAndSetChart(data);
    });
  }

  public loadAndSetChart(data: EmployeeDetail[]) {
    this.service.getEmployee().subscribe((data: EmployeeDetail[]) => {
      // Extract salary information from the EmployeeDetail objects
      const employeeSalaries = data.map((employee) => employee.salary);

      // Initialize an array to store the count of employees in each salary range
      const salaryRangeCounts = new Array(salaryRanges.length).fill(0);

      // Iterate through each employee's salary and count them in the appropriate range
      for (const salary of employeeSalaries) {
        for (let i = 0; i < salaryRanges.length; i++) {
          if (salary >= salaryRanges[i].min && salary <= salaryRanges[i].max) {
            salaryRangeCounts[i]++;
            break; // Break once the salary is counted in one range
          }
        }
      }

      // Calculate the total number of employees
      const totalEmployees = employeeSalaries.length;

      // Calculate the percentage of employees in each range and store in an array
      this.salaryRangePercentages = salaryRangeCounts.map((count) => {
        return ((count / totalEmployees) * 100).toFixed(2);
      });
      this.init();
    });
  }

  init() {
    // Create an array of data points for the pie chart, using salaryRangePercentages
    const dataPoints = salaryRanges.map((range, index) => ({
      name: range.label,
      y: parseFloat(this.salaryRangePercentages[index]),
    }));

    let chart = new Chart({
      chart: {
        type: 'pie',
      },
      title: {
        text: '',
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Salary Percentage',
          type: 'pie',
          data: dataPoints,
        },
      ],
    });

    this.chart = chart;

    chart.ref$.subscribe(console.log);
  }
}
