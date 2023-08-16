import { Component, OnInit } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';
import { InputsOutputs } from "src/app/models/inputs_outputs.model";
import { MeatType } from "src/app/models/meat_type.model";
import { Product } from "src/app/models/product.model";

@Component({
  selector: 'app-inputs-outputs',
  templateUrl: './inputs_outputs.component.html',
  styleUrls: ['./inputs_outputs.component.scss']
})
export class InputsOutputsComponent implements OnInit {
  public meat_types: MeatType[] = [];
  public products: Product[] = [];
  public inputsOutputs: InputsOutputs[];
  public filterParams:any = {
    pageSize: 50,
    pageNum: 0,
    movType: null,
    meatType: null,
    productId: null,
    iniDate: null,
    finDate: null
  }

  public visibleFilters = false;

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

    this.findInputsOutputs();
  }

  findInputsOutputs(){
    this._httpService.getInputsOutputs(this.filterParams).subscribe((inputsOutputs: InputsOutputs[]) => {
      this.inputsOutputs = inputsOutputs;
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

      //this.products = products;
    })
  }

  onSubmit(f) {
     console.log(f.value);
    // if(f.invalid){
    //   return false;
    // }

    this.filterParams.pageNum = 0;
    this.filterParams.movType = f.value.movement;
    this.filterParams.meatType = f.value.meatType;
    this.filterParams.productId = f.value.product;
    this.filterParams.iniDate = f.value.dateIni;
    this.filterParams.finDate = f.value.dateFin;

    this.findInputsOutputs();
  }

}
