import { Injectable } from '@angular/core';
import { HttpClient }  from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Branch } from '../models/branch.model';
import { ProductSent } from '../models/product_sent.model';

@Injectable({
  providedIn: "root"
})

export class BranchHttpService{
  private baseUrl: string = environment.BASE_API_URL;

  constructor(private readonly _http: HttpClient){

  }

  public getBranches(){
    return this._http.get<Branch[]>(this.baseUrl + "/branch/iswarehouse/N");
  }

  public getProductSentToBranch(id:number){
    return this._http.get<ProductSent>(this.baseUrl + "/productsent/byioid/"+id.toString());
  }

  public saveProductSentToBranch(body: any){
    return this._http.post(this.baseUrl + "/productsent", body);
  }

  public updateProductSentToBranch(id:number, body: any){
    return this._http.patch(this.baseUrl + "/productsent/"+id.toString(), body);
  }

  public deleteProductSentToBranch(id:number){
    return this._http.delete(this.baseUrl + "/productsent/"+id.toString());
  }

  public findBranches(filterParams: any, totalRowsOnly: boolean = false){
    //pagesize: number, pagenum: number, movType: string, meatType: number, productId: number, iniDate: string, finDate: string
    let strParams = "pageSize=" + filterParams.pageSize + "&pageNum=" + filterParams.pageNum;
    if(filterParams.branchId){
      strParams += "&branchId="+filterParams.branchId;
    }

    if(totalRowsOnly){
      strParams += "&totalRowsOnly="+totalRowsOnly;
    }

    return this._http.get<Branch[]>(this.baseUrl + "/branch?" + strParams);
  }

  public getBranchId(branchId: number){
    return this._http.get<Branch>(this.baseUrl + "/branch/" + branchId);
  }

  public updateBranch(id:number, body: any){
    return this._http.patch(this.baseUrl + "/branch/"+id.toString(), body);
  }

  public insertBranch(body: any){
    return this._http.post(this.baseUrl + "/branch", body);
  }

}
