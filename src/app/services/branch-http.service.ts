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

}
