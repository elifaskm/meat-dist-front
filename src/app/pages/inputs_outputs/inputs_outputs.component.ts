import { Component, OnInit } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';
import { InputsOutputs } from "src/app/models/inputs_outputs.model";
import { MeatType } from "src/app/models/meat_type.model";
import { Product } from "src/app/models/product.model";
import Swal from "sweetalert2";

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
    pageSize: 20,
    pageNum: 0,
    movType: null,
    meatType: null,
    productId: null,
    iniDate: null,
    finDate: null
  }

  public visibleFilters = false;
  private pagesLength: number = 0;
  public pages: number[] = [];
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

    this.findInputsOutputs();
  }

  findInputsOutputs(getTotalRows: boolean = true){
    this._httpService.getInputsOutputs(this.filterParams).subscribe((inputsOutputs: InputsOutputs[]) => {
      this.inputsOutputs = inputsOutputs;
    });

    if(getTotalRows){
      this.pagesLength = 0;
      this.pages = [];
      this._httpService.getInputsOutputs(this.filterParams, true).subscribe((data: any[]) => {
        this.pagesLength = Math.ceil((data[0].TotalRows / this.filterParams.pageSize));
        for(let i = 0; i<this.pagesLength; i++){
          this.pages.push(i+1);
        }
      });
    }

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

  pageClass(numPage:number){
    if(numPage==this.currentPage){
      return "page-item active";
    }else{
      return "page-item";
    }
  }

  changePage(pageNum){
    this.filterParams.pageNum = pageNum - 1;
    this.findInputsOutputs(false);
    this.currentPage = pageNum;
  }

  nextPage(){
    this.filterParams.pageNum += 1;
    this.findInputsOutputs(false);
    this.currentPage += 1;
  }

  previousPage(){
    this.filterParams.pageNum -= 1;
    this.findInputsOutputs(false);
    this.currentPage -= 1;
  }

  nextPageClass(){
    if(this.pagesLength==this.currentPage){
      return "page-item disabled";
    }else{
      return "page-item";
    }
  }

  previousPageClass(){
    if(this.currentPage==1){
      return "page-item disabled";
    }else{
      return "page-item";
    }
  }

  deleteInputOutput(id:number): void{
    Swal.fire({
      html: 'espere...',
      title: 'Eliminando registro',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this._httpService.deleteInputOutput(id).subscribe((resp: boolean) => {
      Swal.close();

      if(resp){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Registro eliminado',
          showConfirmButton: false,
          timer: 2000
        });

        this.inputsOutputs = this.inputsOutputs.filter(e=>e.id!==id);
      }else{
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error',
          html: "Error al eliminar registro",
          showConfirmButton: false,
          timer: 2000
        });
      }
    },
    error => {

      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error',
        html: error,
        showConfirmButton: false,
        timer: 2000
      });

    });
  }

}
