import { SnackbarService } from './../services/snackbar/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DashboardService } from './../services/dashboard/dashboard.service';
import { Component, AfterViewInit } from '@angular/core';
import { error } from 'console';
import { GlobalContants } from '../shared/global-components';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  responseMessage: any;
  data: any;

	ngAfterViewInit() { }

	constructor(private dashboardService: DashboardService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {
    this.ngxService.start();
    this.dashBoardData();
	}

  dashBoardData(){
    this.dashboardService.getDetails().subscribe((response: any)=>{
      this.ngxService.stop();
      this.data = response;
      }, (error: any)=>{
        this.ngxService.stop();
        console.log(error);
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }else{
          this.responseMessage = GlobalContants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalContants.error);
      }

    )
  }
}
