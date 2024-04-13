import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AppService } from './app.service';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatDividerModule, MatIconModule, MatTableModule, MatSelectModule,
    MatInputModule,
    MatButtonModule, MatTooltipModule,
    MatPaginatorModule, MatSortModule, MatDatepickerModule, MatOptionModule, MatFormFieldModule, DatePipe, DecimalPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  userId: number;
  userInfo: any;
  expenseTypeList: any[] = [];
  expenseFormGroup: FormGroup | undefined;
  expenseGridGroup: FormGroup | undefined;
  fromDate;
  toDate;
  expenseMatTableDataSource: MatTableDataSource<any>;
  gridTypeList = [{ value: 1, desc: "Detail" }, { value: 2, desc: "Summary" }];
  displayColumnsDetail = ["expenseDate", "expenseTypeDesc", "expenseNarration", "amount", "actions"];
  displauColumnsSummary = ["expenseTypeDesc", "amount"];
  displayColumns = [];
  gridType = 1
  datePipe = new DatePipe('en-US')
  expenseId = 0;
  showForm = false;
  addBtnText = "Add";
  showExpenseTypeSelection = true;

  constructor(private fb: FormBuilder, public appService: AppService) {
    this.createForm();
    this.displayColumns = this.displayColumnsDetail;
    this.userId = 1
  }
  ngOnInit(): void {
    this.loadDropdowns();
  }

  createForm() {
    this.expenseFormGroup = this.fb.group({
      expenseDate: [undefined, Validators.required],
      expenseTypeId: [undefined, Validators.required],
      expenseNarration: [undefined, Validators.required],
      amount: [undefined, Validators.required],
    })

    this.expenseGridGroup = this.fb.group({
      fromDate: [new Date(), Validators.required],
      toDate: [new Date(), Validators.required],
      expenseTypeId: [0, Validators.required],
      gridType: [1, Validators.required]
    })
    this.onDateChange("fromDate");
    this.onDateChange("toDate");
  }

  async loadDropdowns() {
    const reqObj = { expenseUserId: this.userId }
    await this.appService.loadDropdowns(reqObj).then((res) => {
      if (res.isSuccessful) {
        const data = res.data;
        this.expenseTypeList = data.expenseTypes;
        this.userInfo = data.userInfo;
        this.loadGrid();
      }
    });
  }

  onDateChange(action: string) {
    if (action == "fromDate") {
      this.fromDate = this.expenseGridGroup.get("fromDate").value;
    } else {
      this.toDate = this.expenseGridGroup.get("toDate").value;
    }
  }

  async loadGrid() {
    const gridType = this.expenseGridGroup.controls["gridType"].value;
    const reqObj = {
      fromDate: this.appService.getDateFormat(this.fromDate),
      toDate: this.appService.getDateFormat(this.toDate),
      expenseUserId: this.userId,
      expenseTypeId: this.expenseGridGroup.controls["expenseTypeId"].value,
    }
    if (gridType == 1) {
      await this.appService.loadExpenses(reqObj).then((res) => {
        if (res.isSuccessful) {
          const data = res.data
          this.displayColumns = this.displayColumnsDetail;
          this.expenseMatTableDataSource = new MatTableDataSource(data);
          this.expenseMatTableDataSource.paginator = this.paginator;
          this.expenseMatTableDataSource.sort = this.sort;
        }
      })
    } else {
      await this.appService.loadExpenseDetailsTypeWise(reqObj).then((res) => {
        if (res.isSuccessful) {
          const data = res.data
          this.displayColumns = this.displauColumnsSummary;
          this.expenseMatTableDataSource = new MatTableDataSource(data);
          this.expenseMatTableDataSource.paginator = this.paginator;
          this.expenseMatTableDataSource.sort = this.sort;
        }
      })
    }

  }

  onTypeSelected() {
    this.gridType = this.expenseGridGroup.controls["gridType"].value;
  }

  async getExpenseById(row) {
    const reqObj = {
      expenseId: row.expenseId,
    }
    await this.appService.getExpenseById(reqObj).then((res) => {
      if (res.isSuccessful) {
        this.onAddClicked();
        const data = res.data
        this.expenseFormGroup.patchValue({
          expenseDate: new Date(data.expenseDate),
          expenseTypeId: data.expenseTypeId,
          expenseNarration: data.expenseNarration,
          amount: data.amount
        });
        this.expenseId = data.expenseId
      }
    })
  }

  async createExpense() {
    debugger
    const reqObj = {
      expenseDate: this.appService.getDateFormat(this.expenseFormGroup.get("expenseDate").value),
      expenseNarration: this.expenseFormGroup.get("expenseNarration").value,
      amount: this.expenseFormGroup.get("amount").value,
      expenseTypeId: this.expenseFormGroup.get("expenseTypeId").value,
      userId: this.userId,
      expenseUserId: this.userId
    }
    await this.appService.createExpense(reqObj).then((res) => {
      this.appService.displaySnackBar(res.isSuccessful, res.message)
      if (res.isSuccessful) {
        this.expenseFormGroup.reset();
        this.loadDropdowns();
      }
    })
  }

  async editExpense() {
    const reqObj = {
      expenseNarration: this.expenseFormGroup.get("expenseNarration").value,
      amount: this.expenseFormGroup.get("amount").value,
      expenseTypeId: this.expenseFormGroup.get("expenseTypeId").value,
      userId: this.userId,
      expenseUserId: this.userId,
      expenseId: this.expenseId
    }
    await this.appService.editExpense(reqObj).then((res) => {
      this.appService.displaySnackBar(res.isSuccessful, res.message)
      if (res.isSuccessful) {
        this.expenseFormGroup.reset();
        this.expenseId = 0
        this.loadDropdowns();
      }
    })
  }

  onSave() {
    if (this.expenseId !== 0) {
      this.editExpense()
    }
    else {
      this.createExpense();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.expenseMatTableDataSource.filter = filterValue.trim().toLowerCase();
  }

  onAddClicked() {
    this.showForm = !this.showForm;
    this.addBtnText = this.showForm ? "Close" : "Add";
  }

  onGridViewChange() {
    const gridView = this.expenseGridGroup.get("gridType").value;
    if (gridView == 1) {
      this.showExpenseTypeSelection = true;
    }
    else {
      this.showExpenseTypeSelection = false;
      this.expenseGridGroup.get("expenseTypeId").setValue(0);
    }
  }
}
