import { Component, OnInit } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';
import { Stock } from "src/app/models/stock.model";
import { MeatType } from "src/app/models/meat_type.model";
import { Product } from "src/app/models/product.model";
import { Branch } from "src/app/models/branch.model";

@Component({
  selector: 'app-totals-by-product',
  templateUrl: './totals-by-product.component.html',
  styleUrls: ['./totals-by-product.component.scss']
})
export class TotalsByProductComponent implements OnInit {
  public meat_types: MeatType[] = [];
  public products: Product[] = [];
  public stocks: Stock[];
  public branches: Branch[];

  public filterParams:any = {
    meatType: null,
    productId: null,
    branchId: null
  }

  public pages: number[] = [1];
  public currentPage: number = 1;

  constructor(public _httpService: HttpService) { }

  ngOnInit() {
    this._httpService.getMeatTypes(10, 0).subscribe((meat_types: MeatType[]) => {
      this.filterParams.meatType = 0;
      let itemAll: MeatType[] = [];
      itemAll.push({
        id: 0,
        is_deleted: 'N',
        meat_name: 'Todos'
      });

      this.meat_types = itemAll.concat(meat_types);
      this.getProductsByMeatType(this.meat_types[0].id);
    });

    this._httpService.getAllWarehouse().subscribe((branches: Branch[]) => {
      this.filterParams.branchId = branches[0].id;
      this.branches = branches;
    });
  }

  findStock(){
    this._httpService.getFullStock(this.filterParams).subscribe((stocks: Stock[]) => {
      this.stocks = stocks;
    });
  }

  getProductsByMeatType(meat_typeId: number): void{
    this._httpService.getProductsByMeatType(meat_typeId).subscribe((products: Product[]) => {
      this.filterParams.productId = 0;
      let itemAll: Product[] = [];
      itemAll.push({
        id: 0,
        description: "Todos",
        by_kilograms: "",
        by_pieces: "",
        by_boxes: "",
        is_deleted: "selected",
        meat_typeId: 0
      });

      this.products = itemAll.concat(products);
    })
  }

  onSubmit(f) {
     console.log(f.value);
    // if(f.invalid){
    //   return false;
    // }

    this.filterParams.meatType = f.value.meatType;
    this.filterParams.productId = f.value.product;
    this.filterParams.branchId = f.value.warehouse;

    this.findStock();
  }

}
