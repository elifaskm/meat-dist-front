import { Injectable } from '@angular/core';
import { HttpClient }  from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Product } from '../models/product.model';

@Injectable({
  providedIn: "root"
})

export class ProductHttpService{
  private baseUrl: string = environment.BASE_API_URL;

  constructor(private readonly _http: HttpClient){

  }

  public insertProduct(body: any){
    return this._http.post(this.baseUrl + "/product", body);
  }

  public updateProduct(id:number, body: any){
    return this._http.patch(this.baseUrl + "/product/"+id.toString(), body);
  }

  public deleteProduct(id:number){
    return this._http.delete(this.baseUrl + "/product/"+id.toString());
  }

  public findProducts(filterParams: any, totalRowsOnly: boolean = false){
    //pagesize: number, pagenum: number, movType: string, meatType: number, productId: number, iniDate: string, finDate: string
    let strParams = "pageSize=" + filterParams.pageSize + "&pageNum=" + filterParams.pageNum;
    if(filterParams.branchId){
      strParams += "&branchId="+filterParams.branchId;
    }

    if(totalRowsOnly){
      strParams += "&totalRowsOnly="+totalRowsOnly;
    }

    return this._http.get<Product[]>(this.baseUrl + "/product?" + strParams);
  }

  public getProductId(branchId: number){
    return this._http.get<Product>(this.baseUrl + "/product/" + branchId);
  }

}
