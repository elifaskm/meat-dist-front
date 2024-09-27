import { Injectable } from '@angular/core';
import { HttpClient }  from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BranchCashControl } from '../models/brach-cash-control.model';
import { ProductSent } from '../models/product_sent.model';
import { BranchProductsEntry } from '../models/branch-products-entry.model';

@Injectable({
  providedIn: "root"
})

export class BranchCashControlHttpService{
  private baseUrl: string = environment.BASE_API_URL;
  private urlGDriveApi: string = environment.API_GDRIVE_URL;

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

  public getProductSentForBranch(filterParams: any){
    let strParams = "date="+filterParams.date.replaceAll("-", "");
    return this._http.get<ProductSent[]>(this.baseUrl + "/productsent/forbranch/"+filterParams.branchId+"/?" + strParams);
  }

  public getDriveFilesData(){
    return this._http.get<object>(this.urlGDriveApi + "/GDriveFiles");
  }

  public getBranchCashControlById(id: number){
    return this._http.get<BranchCashControl>(this.baseUrl + "/branchcashcontrol/" + id);
  }

  public patchBranchCashControl(id: number, body: any){
    return this._http.patch(this.baseUrl + "/branchcashcontrol/"+id, body);
  }


  //ProductsEntry
  public getBranchProductsEntry(filterParams: any){
    let strParams = "date="+filterParams.date.replaceAll("-", "");
    return this._http.get<BranchProductsEntry[]>(this.baseUrl + "/branchproductsentry/forbranch/"+filterParams.branchId+"/?" + strParams);
  }

  public getFullBranchProductsEntry(filterParams: any){

    let strParams = "dateOfCapture="+filterParams.dateOfCapture.replaceAll("-", "");
    if(filterParams.branchId>0){
      strParams += "&branchId="+filterParams.branchId;
    }

    return this._http.get<BranchProductsEntry[]>(this.baseUrl + "/branchproductsentry?" + strParams);
  }

  public patchBranchProductEntry(id: number, body: any){
    return this._http.patch(this.baseUrl + "/branchproductsentry/"+id, body);
  }

  public delAllBranchCashControl(){
    return this._http.delete(this.baseUrl + "/branchcashcontrol/");
  }

  public delAllStocksResidue(){
    return this._http.delete(this.baseUrl + "/branchresidue/");
  }

  public delAllBranchProductsEntry(){
    return this._http.delete(this.baseUrl + "/branchproductsentry/");
  }

}
