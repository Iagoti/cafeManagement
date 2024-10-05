import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductService } from '../../../services/product.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { BillService } from 'src/app/services/bill/bill.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalContants } from 'src/app/shared/global-components';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manager-order',
  templateUrl: './manager-order.component.html',
  styleUrls: ['./manager-order.component.scss']
})
export class ManagerOrderComponent implements OnInit {

  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  managerOrderForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategory();
    this.managerOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalContants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalContants.nameRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalContants.nameRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]]
    })
  }

  getCategory() {
    this.categoryService.getCategorys().subscribe((response: any) => {
      this.ngxService.stop();
      this.categorys = response;
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.menssage) {
        this.responseMessage = error.error?.menssage
      } else {
        this.responseMessage = GlobalContants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalContants.error);
    })
  }

  getProductByCategory(value: any) {
    this.productService.getProductsByCategory(value.id).subscribe((response: any) => {
      this.products = response;
      this.managerOrderForm.controls['price'].setValue('');
      this.managerOrderForm.controls['quantity'].setValue('');
      this.managerOrderForm.controls['total'].setValue('');
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.menssage) {
        this.responseMessage = error.error?.menssage
      } else {
        this.responseMessage = GlobalContants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalContants.error);
    })
  }

  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe((response: any) => {
      this.price = response.price;
      this.managerOrderForm.controls['price'].setValue(response.price);
      this.managerOrderForm.controls['quantity'].setValue('1');
      this.managerOrderForm.controls['total'].setValue(this.price * 1);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.menssage) {
        this.responseMessage = error.error?.menssage
      } else {
        this.responseMessage = GlobalContants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalContants.error);
    })
  }

  setQuantity(value: any) {
    var temp = this.managerOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.managerOrderForm.controls['total'].setValue(this.managerOrderForm.controls['quantity'].value * this.managerOrderForm.controls['price'].value);
    }
    else if (temp != '') {
      this.managerOrderForm.controls['quantity'].value('1');
      this.managerOrderForm.controls['total'].setValue(this.managerOrderForm.controls['quantity'].value * this.managerOrderForm.controls['price'].value);
    }
  }

  validateProductAdd() {
    if (this.managerOrderForm.controls['total'].value === 0 || this.managerOrderForm.controls['total'].value === null || this.managerOrderForm.controls['quantity'].value <= 0) {
      return true;
    } else {
      return false;
    }
  }

  validateSubmit() {
    if (this.totalAmount === 0 || this.managerOrderForm.controls['name'].value === null || this.managerOrderForm.controls['email'].value === null ||
      this.managerOrderForm.controls['contactNumber'].value === null || this.managerOrderForm.controls['paymentMethod'].value === null ||
      !(this.managerOrderForm.controls['contactNumber'].valid) || !(this.managerOrderForm.controls['email'].valid)) {
      return true;
    } else {
      return false;
    }
  }

  add() {
    var formData = this.managerOrderForm.value;
    var productName = this.dataSource.find((e: { id: number; }) => e.id == formData.product.id);
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({
        id: formData.product.id, name: formData.product.name, category: formData.category.name,
        quantity: formData.quantity, price: formData.price, total: formData.total
      });
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar(GlobalContants.productAdded, "success");
    }
    else{
      this.snackbarService.openSnackBar(GlobalContants.productExistError, GlobalContants.error);
    }
  }

  handleDeleteAction(value: any, element: any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submitAction(){
    this.ngxService.start();
    var formData = this.managerOrderForm.value;
    var data ={
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe((response: any) => {
      this.downloadFile(response?.uuid);
      this.managerOrderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.menssage) {
        this.responseMessage = error.error?.menssage
      } else {
        this.responseMessage = GlobalContants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalContants.error);
    })
  }

  downloadFile(fileName: any){
    var data = {
      uuid: fileName
    }
    this.billService.getPDF(data).subscribe((response: any) => {
      saveAs(response, fileName + '.pdf');
      this.ngxService.stop();
    })
  }

}
