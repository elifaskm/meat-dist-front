import { Injectable } from '@angular/core';
import { HttpClient }  from "@angular/common/http";
import { User } from "../models/user.model";
import { InputsOutputs } from "../models/inputs_outputs.model";
import { MeatType } from "../models/meat_type.model";
import { environment } from "src/environments/environment";
import { Product } from '../models/product.model';

@Injectable({
  providedIn: "root"
})

export class HttpService{
  private baseUrl: string = environment.BASE_API_URL;

  constructor(private readonly _http: HttpClient){

  }

  public getUser(username: string){
      return this._http.get<User>(this.baseUrl + "/user/" + username);
  }

  public getInputsOutputs(pagesize: number, pagenum: number){
    return this._http.get<InputsOutputs[]>(this.baseUrl + "/inputsoutputs?pageSize=" + pagesize + "&pageNum=" + pagenum);
  }

  public postInputsOutputs(body: any){
    return this._http.post(this.baseUrl + "/inputsoutputs", body);
  }

  public getMeatTypes(pagesize: number, pagenum: number){
    return this._http.get<MeatType[]>(this.baseUrl + "/meattype?pageSize=" + pagesize + "&pageNum=" + pagenum);
  }

  public getProductsByMeatType(meat_typeId: number){
    return this._http.get<Product[]>(this.baseUrl + "/product/" + meat_typeId + "/byMeatType");
  }

  public getProductById(productId: number){
    return this._http.get<Product>(this.baseUrl + "/product/" + productId);
  }
}
