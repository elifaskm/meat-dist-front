import { Injectable } from '@angular/core';
import { HttpClient }  from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BranchCashControl } from '../models/brach-cash-control.model';

@Injectable({
  providedIn: "root"
})

export class BranchCashControlHttpService{
  private baseUrl: string = environment.BASE_API_URL;

  constructor(private readonly _http: HttpClient){

  }

  public getFullBranchCashControl(filterParams: any){

    let strParams = "dateOfCapture="+filterParams.dateOfCapture.replaceAll("-", "");
    if(filterParams.branchId>0){
      strParams += "&branchId="+filterParams.branchId;
    }
    if(filterParams.status){
      strParams += "&status="+filterParams.status;
    }

    return this._http.get<BranchCashControl[]>(this.baseUrl + "/branchcashcontrol?" + strParams);
  }

}
