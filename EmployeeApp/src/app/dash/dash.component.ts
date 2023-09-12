import { Component, inject, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { EmployeeDetail } from '../shared/model-api.model';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../shared/service-api.service';
import { trigger, transition, animate, style } from '@angular/animations';
@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css'],
  animations: [
    trigger('numberAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('1s', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class DashComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);

  employeeAges: number[] = [];
  statistics: { label: string; value: string }[] = [];
  dataSource: MatTableDataSource<EmployeeDetail>;
  constructor(public service: EmployeeService) {
    this.dataSource = new MatTableDataSource<EmployeeDetail>();
  }
  meanAge?: number;
  medianAge?: number;
  standardDeviation?: number;
  ngOnInit(): void {
    this.loadAndSetData();

    setTimeout(() => {
      // Trigger the number animation
      this.triggerNumberAnimation();
    }, 100);
    // Calculate statistics after loading data
    this.meanAge = this.calculateMeanAge();

    this.medianAge = this.calculateMedianAge();
    this.standardDeviation = this.calculateStandardDeviation();
  }
  private calculateMeanAge(): number {
    const numericAges = this.employeeAges.filter((age) => !isNaN(age));

    if (numericAges.length === 0) {
      return NaN; // Return NaN if there are no valid numeric ages
    }

    const mean = numericAges.reduce((a, b) => a + b, 0) / numericAges.length;

    return mean;
  }

  triggerNumberAnimation() {
    // Get the target values for animation
    const targetValues = {
      meanAge: parseFloat(this.statistics[0].value),
      medianAge: parseFloat(this.statistics[1].value),
      standardDeviation: parseFloat(this.statistics[2].value),
    };

    // Duration of the animation in milliseconds
    const animationDuration = 100; // 1 second

    // Calculate step values for each statistic
    const stepValues = {
      meanAge: targetValues.meanAge / animationDuration,
      medianAge: targetValues.medianAge / animationDuration,
      standardDeviation: targetValues.standardDeviation / animationDuration,
    };

    // Initialize starting values
    let currentValues = {
      meanAge: 0,
      medianAge: 0,
      standardDeviation: 0,
    };

    // Create an interval to update the values gradually
    const interval = setInterval(() => {
      // Update the values
      currentValues.meanAge += stepValues.meanAge;
      currentValues.medianAge += stepValues.medianAge;
      currentValues.standardDeviation += stepValues.standardDeviation;

      // Update the displayed values
      this.statistics[0].value = currentValues.meanAge.toFixed(1);
      this.statistics[1].value = currentValues.medianAge.toFixed(1);
      this.statistics[2].value = currentValues.standardDeviation.toFixed(1);

      // Check if the animation is complete
      if (
        currentValues.meanAge >= targetValues.meanAge &&
        currentValues.medianAge >= targetValues.medianAge &&
        currentValues.standardDeviation >= targetValues.standardDeviation
      ) {
        clearInterval(interval); // Stop the interval when animation is complete
      }
    }, 30); // Update values every 10 milliseconds
  }

  private calculateMedianAge(): number {
    // Calculate and return the median age
    // You can use the 'this.employeeAges' array here
    const sortedAges = this.employeeAges.slice().sort((a, b) => a - b);
    const middle = Math.floor(sortedAges.length / 2);

    if (sortedAges.length % 2 === 0) {
      return (sortedAges[middle - 1] + sortedAges[middle]) / 2;
    } else {
      return sortedAges[middle];
    }
  }

  private calculateStandardDeviation(): number {
    if (this.meanAge === undefined) {
      // Handle the case when meanAge is undefined (e.g., show an error message)
      return NaN; // or handle it as appropriate for your application
    }

    // Calculate and return the standard deviation
    const squaredDifferences = this.employeeAges.map(
      (age) => Math.pow(age - this.meanAge!, 2) // Use the non-null assertion operator (!)
    );

    const variance =
      squaredDifferences.reduce((a, b) => a + b, 0) / this.employeeAges.length;
    return Math.sqrt(variance);
  }

  public loadAndSetData() {
    this.service.getEmployee().subscribe((data: EmployeeDetail[]) => {
      // 'age' is a property in the EmployeeDetail object
      this.employeeAges = data.map((employee) => employee.age);

      this.dataSource.data = data;

      // Calculate statistics after loading data
      this.meanAge = this.calculateMeanAge();
      this.medianAge = this.calculateMedianAge();
      this.standardDeviation = this.calculateStandardDeviation();

      // Push the calculated statistics into the 'statistics' array
      this.statistics.push({
        label: 'Mean Age',
        value: this.meanAge.toFixed(1),
      });
      this.statistics.push({
        label: 'Median Age',
        value: this.medianAge.toFixed(1),
      });
      this.statistics.push({
        label: 'Standard Deviation',
        value: this.standardDeviation.toFixed(1),
      });
    });
  }

  /** Based on the screen size, switch from standard to one column per row */
  cardLayout = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return {
          columns: 1,
          miniCard: { cols: 4, rows: 1 },

          table: { cols: 1, rows: 4 },
        };
      }

      return {
        columns: 4,
        miniCard: { cols: 1, rows: 1 },

        table: { cols: 4, rows: 4 },
      };
    })
  );
}
