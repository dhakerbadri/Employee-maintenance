import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  EmployeesTableDataSource,
  EmployeesTableItem,
} from './employees-table-datasource';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from '../emp-add-edit/emp-add-edit.component';
import { EmployeeService } from '../shared/service-api.service';
import { EmployeeDetail } from '../shared/model-api.model';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.css'],
})
export class EmployeesTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<EmployeeDetail>;
  updatedData: EmployeeDetail[] = []; // Define this variable in your component
  public Status = '';
  constructor(public service: EmployeeService, private _dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<EmployeeDetail>();
  }
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadAndSetData();
  }

  updateEmployeeData(updatedData: EmployeeDetail[]) {
    // Update the shared data service with the new data
    this.service.updateEmployeeData(updatedData);
  }

  public loadAndSetData() {
    this.service.getEmployee().subscribe((data: EmployeeDetail[]) => {
      this.dataSource.data = data;
    });
  }
  employeeForm() {
    this.Status = 'Add Employee';
    this.service.updateStatus(this.Status);

    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe((result: EmployeeDetail[]) => {
      if (result) {
        // The dialog is closed, and you have the updated data
        this.updatedData = result;
        this.loadAndSetData();
        this.updateEmployeeData(this.updatedData);
      }
      // The dialog is closed, reload data
    });
  }

  applyFilterName(filterValue: any) {
    filterValue = filterValue.target.value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.firstName.toLowerCase().includes(filter);
    };
    this.dataSource.filter = filterValue;
  }

  editEmployee(data: EmployeeDetail) {
    this.Status = 'Edit Employee';
    this.service.updateStatus(this.Status);
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe((result: EmployeeDetail[]) => {
      // The dialog is closed, reload data
      if (result) {
        // The dialog is closed, and you have the updated data
        this.updatedData = result;
        this.loadAndSetData();
        this.updateEmployeeData(this.updatedData);
      }
    });
  }
  deleteEmployee(id: number) {
    this.service.deleteEmployee(id).subscribe({
      next: (res) => {
        this.loadAndSetData();
        this.updateEmployeeData(res);
      },
    });
  }
}
