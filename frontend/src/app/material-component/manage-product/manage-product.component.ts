import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { GlobalContants } from 'src/app/shared/global-components';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  displayedColumns: string[] = ['name', 'categoryName', 'description', 'price', 'edit'];
  dataSource: any;
  responseMenssage: any;

  constructor(
    private productService: ProductService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.productService.getProducts().subscribe((response: any) =>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    }, (error: any)=>{
      this.ngxService.stop();
      if(error.error?.menssage){
        this.responseMenssage = error.error?.menssage
      } else{
        this.responseMenssage = GlobalContants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMenssage, GlobalContants.error);
    })
  }

  apllyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "850px";
    //const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      //dialogRef.close();
    });
    // const sub = dialogRef.componentInstance.onAddCategory.subscribe(
    //   (response) =>{
    //     this.tableData();
    //   }
    // )
  }

  handleEditAction(values: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    }
    dialogConfig.width = "850px";
    // const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    // this.router.events.subscribe(() => {
    //   dialogRef.close();
    // });
    // const sub = dialogRef.componentInstance.onEditCategory.subscribe(
    //   (response) =>{
    //     this.tableData();
    //   }
    // )
  }

  handleDeleteAction(values: any){}

  onChange(status: any, id: any){

  }

}
