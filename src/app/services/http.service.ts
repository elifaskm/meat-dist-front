import { Injectable } from '@angular/core';
import { HttpClient }  from "@angular/common/http";
import { User } from "../models/user.model";
import { InputsOutputs } from "../models/inputs_outputs.model";
import { MeatType } from "../models/meat_type.model";
import { environment } from "src/environments/environment";
import { Product } from '../models/product.model';
import { Stock } from "../models/stock.model";
import { Branch } from '../models/branch.model';
import { RepByDate } from '../models/rep_by_date';
import { Configuration } from '../models/configuration.model';
import { ProductSent } from '../models/product_sent.model';
import { RepStockResidue } from '../models/rep_stock_residue';

@Injectable({
  providedIn: "root"
})

export class HttpService{
  private baseUrl: string = environment.BASE_API_URL;
  private urlGDriveApi: string = environment.API_GDRIVE_URL;

  constructor(private readonly _http: HttpClient){

  }

  public getUser(username: string){
      return this._http.get<User>(this.baseUrl + "/user/" + username);
  }

  public getInputsOutputs(filterParams: any, totalRowsOnly: boolean = false){
    //pagesize: number, pagenum: number, movType: string, meatType: number, productId: number, iniDate: string, finDate: string
    let strParams = "pageSize=" + filterParams.pageSize + "&pageNum=" + filterParams.pageNum;
    if(filterParams.movType){
      strParams += "&movType="+filterParams.movType;
    }
    if(filterParams.meatType > 0){
      strParams += "&meatType="+filterParams.meatType;
    }
    if(filterParams.productId > 0){
      strParams += "&productId="+filterParams.productId;
    }
    if(filterParams.iniDate){
      strParams += "&iniDate="+filterParams.iniDate.replaceAll("-", "");
    }
    if(filterParams.finDate){
      strParams += "&finDate="+filterParams.finDate.replaceAll("-", "");
    }
    if(totalRowsOnly){
      strParams += "&totalRowsOnly="+totalRowsOnly;
    }

    return this._http.get<InputsOutputs[]>(this.baseUrl + "/inputsoutputs?" + strParams);
  }

  public postInputsOutputs(body: any){
    return this._http.post(this.baseUrl + "/inputsoutputs", body);
  }

  public getMeatTypes(pagesize: number, pagenum: number){
    return this._http.get<MeatType[]>(this.baseUrl + "/meattype?pageSize=" + pagesize + "&pageNum=" + pagenum);
  }

  public getMeatTypeById(meatTypeId: number){
    return this._http.get<MeatType>(this.baseUrl + "/meattype/" + meatTypeId);
  }

  public getProductsByMeatType(meat_typeId: number){
    return this._http.get<Product[]>(this.baseUrl + "/product/" + meat_typeId + "/byMeatType");
  }

  public getProductById(productId: number){
    return this._http.get<Product>(this.baseUrl + "/product/" + productId);
  }

  public getFullStock(filterParams: any){
    let strParams = "";
    if(filterParams.branchId){
      strParams += "&branchId="+filterParams.branchId;
    }
    if(filterParams.meatType){
      strParams += "&meatTypeId="+filterParams.meatType;
    }
    if(filterParams.productId){
      strParams += "&productId="+filterParams.productId;
    }

    return this._http.get<Stock[]>(this.baseUrl + "/stock?" + strParams);
  }

  public getAllWarehouse(){
    return this._http.get<Branch[]>(this.baseUrl + "/branch/iswarehouse/Y");
  }

  public getAllBranches(){
    return this._http.get<Branch[]>(this.baseUrl + "/branch/iswarehouse/N");
  }

  public getRepByDate(filterParams: any){
    let strParams = "";
    if(filterParams.branchId){
      strParams += "&branchId="+filterParams.branchId;
    }
    if(filterParams.meatType){
      strParams += "&meatTypeId="+filterParams.meatType;
    }
    if(filterParams.productId){
      strParams += "&productId="+filterParams.productId;
    }
    if(filterParams.iniDate){
      strParams += "&iniDate="+filterParams.iniDate.replaceAll("-", "");
    }
    if(filterParams.finDate){
      strParams += "&finDate="+filterParams.finDate.replaceAll("-", "");
    }

    return this._http.get<RepByDate[]>(this.baseUrl + "/inputsoutputs/report/bydaterange?" + strParams);
  }

  public getRepResidueOfBranch(filterParams: any){
    let strParams = "";
    if(filterParams.branchId){
      strParams += "&branchId="+filterParams.branchId;
    }
    if(filterParams.meatType){
      strParams += "&meatTypeId="+filterParams.meatType;
    }
    if(filterParams.productId){
      strParams += "&productId="+filterParams.productId;
    }
    if(filterParams.iniDate){
      strParams += "&iniDate="+filterParams.iniDate.replaceAll("-", "");
    }
    if(filterParams.finDate){
      strParams += "&finDate="+filterParams.finDate.replaceAll("-", "");
    }

    return this._http.get<RepStockResidue[]>(this.baseUrl + "/branchresidue/report/stockresidue?" + strParams);
  }

  public deleteInputOutput(id: number){
    return this._http.delete(this.baseUrl + "/inputsoutputs/" + id);
  }

  public patchProduct(id: number, body: any){
    return this._http.patch(this.baseUrl + "/product/"+id, body);
  }

  public delAllStock(){
    return this._http.delete(this.baseUrl + "/stock/");
  }

  public delAllInputsOutputs(){
    return this._http.delete(this.baseUrl + "/inputsoutputs/");
  }

  public getAllUserPermissions(userId:number){
    return this._http.get(this.baseUrl + "/user/"+userId+"/permissions");
  }

  public signIn(body: any){
    return this._http.post(this.baseUrl + "/auth/signIn", body);
  }

  public getConfigurationByKey(key: string){
    return this._http.get<Configuration>(this.baseUrl + "/configuration/bykey/" + key);
  }

  public getProductSents(filterParams: any, totalRowsOnly: boolean = false){
    //pagesize: number, pagenum: number, movType: string, meatType: number, productId: number, iniDate: string, finDate: string
    let strParams = "pageSize=" + filterParams.pageSize + "&pageNum=" + filterParams.pageNum;
    if(filterParams.branchId){
      strParams += "&branchId="+filterParams.branchId;
    }
    if(filterParams.meatType > 0){
      strParams += "&meatType="+filterParams.meatType;
    }
    if(filterParams.productId > 0){
      strParams += "&productId="+filterParams.productId;
    }
    if(filterParams.iniDate){
      strParams += "&iniDate="+filterParams.iniDate.replaceAll("-", "");
    }
    if(filterParams.finDate){
      strParams += "&finDate="+filterParams.finDate.replaceAll("-", "");
    }
    if(totalRowsOnly){
      strParams += "&totalRowsOnly="+totalRowsOnly;
    }

    return this._http.get<ProductSent[]>(this.baseUrl + "/productsent?" + strParams);
  }

  public deleteProductSent(id: number){
    return this._http.delete(this.baseUrl + "/productsent/" + id);
  }

  public postProductSent(body: any){
    return this._http.post(this.baseUrl + "/productsent", body);
  }

  public getProductSentById(productSentId: number){
    return this._http.get<ProductSent>(this.baseUrl + "/productsent/" + productSentId);
  }

  public patchProductSent(body: any){
    return this._http.patch(this.baseUrl + "/productsent", body);
  }

  public delAllProductSents(){
    return this._http.delete(this.baseUrl + "/productsent/");
  }

  public patchConfiguration(id: number, body: any){
    return this._http.patch(this.baseUrl + "/configuration/"+id.toString(), body);
  }

  public postLoadOutputs(force: boolean){
    return this._http.post(this.urlGDriveApi + "/GDriveFiles", {force:force});
  }


}
