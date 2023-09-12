import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeService } from '../shared/service-api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeDetail } from '../shared/model-api.model';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeesTableComponent } from '../employees-table/employees-table.component';

//import { CoreService } from '../core/core.service';
@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.css'],
})
export class EmpAddEditComponent implements OnInit {
  employeeForm: FormGroup;
  dataSource: MatTableDataSource<EmployeeDetail>;
  statusForm = EmployeesTableComponent;
  Status?: string;
  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,

    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    // private _coreService: CoreService,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDetail
  ) {
    this.dataSource = new MatTableDataSource<EmployeeDetail>();
    this.employeeForm = this._fb.group({
      firstName: '',
      lastName: '',
      age: '',
      salary: '',
    });
  }
  ngOnInit(): void {
    this.employeeForm.patchValue(this.data);
    this._empService.currentStatus$.subscribe((Status) => {
      this.Status = Status;
    });
  }

  public loadData() {
    this._empService.getEmployee().subscribe((data: EmployeeDetail[]) => {
      this.dataSource.data = data;
      console.log(this.dataSource.data);
    });
  }

  onFormSubmit() {
    if (this.employeeForm.valid) {
      if (this.data) {
        let employee = new EmployeeDetail();
        employee.employeeDetailId = this.data.employeeDetailId;
        employee.lastName = this.employeeForm.get('lastName')?.value;
        employee.firstName = this.employeeForm.get('firstName')?.value;
        employee.age = this.employeeForm.get('age')?.value;
        employee.salary = this.employeeForm.get('salary')?.value;
        this._empService
          .updateEmployee(this.data.employeeDetailId, employee)
          .subscribe({
            next: (res) => {
              this.loadData();
              this._dialogRef.close(true);
            },
            error: (err) => {
              console.error(err);
            },
          });
      } else {
        this._empService.addEmployee(this.employeeForm.value).subscribe({
          next: (res) => {
            this._dialogRef.close(true);
            this.loadData();
          },
          error: (err) => {
            console.error(err);
          },
        });
      }
    }
  }
}
