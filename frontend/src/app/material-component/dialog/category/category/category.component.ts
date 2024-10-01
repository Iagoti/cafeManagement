import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category/category.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { GlobalContants } from 'src/app/shared/global-components';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  responseMenssage: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryComponent>,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name:["", [Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Update"
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction === "Edit"){
      this.edit();
    } else{
      this.add();
    }
  }

  add(){
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name
    }
    this.categoryService.add(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMenssage = response.message;
      this.snackbarService.openSnackBar(this.responseMenssage, "success");
    },(error: any) => {
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMenssage = error.error?.message;
      } else{
        this.responseMenssage = GlobalContants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMenssage, GlobalContants.error);
    })
  }

  edit(){
    var formData = this.categoryForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name
    }
    this.categoryService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMenssage = response.message;
      this.snackbarService.openSnackBar(this.responseMenssage, "success");
    },(error: any) => {
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMenssage = error.error?.message;
      } else{
        this.responseMenssage = GlobalContants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMenssage, GlobalContants.error);
    })
  }

}
