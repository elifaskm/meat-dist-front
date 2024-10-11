import { Product } from './../../../models/product.model';
import { Component, OnInit } from '@angular/core';
import { HttpService, ProductHttpService }  from 'src/app/services';
import { MeatType } from "src/app/models/meat_type.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  //public meat_types: MeatType[] = [];
  public _meatTypesFilter: MeatType[] = [];
  public products: Product[];
  public _productsFilter: Product[];
  public productId: number;

  public filterParams:any = {
    pageSize: 20,
    pageNum: 0,
    productId: null,
    meatTypeId: null
  }

  public visibleFilters = false;
  public visibleUpdProduct = false;
  public visibleInsProduct = false;
  private pagesLength: number = 0;
  public pages: number[] = [];
  public currentPage: number = 1;

  constructor(public _httpService: HttpService, public _productHttpService: ProductHttpService) { }

  receiveMessage($event) {
    this.visibleUpdProduct = false;
    this.visibleInsProduct = false;

    if($event){
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Registro guardado',
        showConfirmButton: false,
        timer: 2000
      });
      this.findProducts();
    }

  }

  ngOnInit() {

    this._httpService.getMeatTypes(10, 0).subscribe((meat_types: MeatType[]) => {
      this.filterParams.meatTypeId = 0;
      let itemAll: MeatType[] = [];
      itemAll.push({
        id: 0,
        meat_name: "Todos",
        is_deleted: 'N'
      });

      //this.meat_types = meat_types;
      this._meatTypesFilter = itemAll.concat(meat_types.filter(e=>e.is_deleted=="N"));

      this.getProductsFilter();

      this.findProducts();
    });

  }


  findMeatType(meat_type_id){
    return this._meatTypesFilter.find(x=>x.id==meat_type_id).meat_name;
  }

  findProducts(getTotalRows: boolean = true){
    this._productHttpService.findProducts(this.filterParams, true).subscribe((products: Product[]) => {
      //this.filterParams.productId = 0;
      // let itemAll: Product[] = [];
      // itemAll.push({
      //   id: 0,
      //   is_deleted: 'N',
      //   meat_typeId: 0,
      //   by_boxes:"",
      //   by_kilograms:"",
      //   by_pieces:"",
      //   description:"Todos",
      //   kg_by_boxes:0,
      //   calc_by:"",
      //   price:0
      // });

      this.products = products.filter(e=>e.is_deleted=="N");
      //this._productsFilter = itemAll.concat(products.filter(e=>e.is_deleted=="N"));
    });

    if(getTotalRows){
      this.pagesLength = 0;
      this.pages = [];
      this._productHttpService.findProducts(this.filterParams, true).subscribe((data: any[]) => {
        this.pagesLength = Math.ceil((data[0].TotalRows / this.filterParams.pageSize));
        for(let i = 0; i<this.pagesLength; i++){
          this.pages.push(i+1);
        }
      });
    }

  }

  getProductsFilter(): void{
    this._productHttpService.findProducts(this.filterParams, true).subscribe((products: Product[]) => {
      this.filterParams.productId = 0;
      let itemAll: Product[] = [];
      itemAll.push({
        id: 0,
        description: "Todos",
        by_kilograms: "",
        by_pieces: "",
        by_boxes: "",
        is_deleted: "selected",
        meat_typeId: 0,
        price: 0,
        calc_by: "",
        kg_by_boxes: 0
      });

      this._productsFilter = itemAll.concat(products.filter(x=>x.is_deleted=="N"));
    })
  }

  getProductsByMeatType(meat_typeId: number){
    if(meat_typeId==0){
      this.getProductsFilter();
      return;
    }

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
        meat_typeId: 0,
        price: 0,
        calc_by: "",
        kg_by_boxes: 0
      });

      this._productsFilter = itemAll.concat(products.filter(x=>x.is_deleted=="N"));
      //this._productsFilter = products.sort((a, b) => (a.description > b.description) ? 1 : -1);
    });
  }


  onSubmit(f) {
    this.filterParams.productId = f.value.productFilter;
    this.filterParams.meatTypeId = f.value.meatTypeFilter;

    //si los dos tienen todos
    //si los tipo es cero
    //sii los ds tienen un valor
    //tipo dfi cero y prod 0

    if(this.filterParams.productId == 0 && this.filterParams.meatTypeId == 0){
      //this.findProducts();
      this.products = this._productsFilter.filter(x=>x.id!=0);
    }else{
      if(this.filterParams.meatTypeId == 0){
        this.products = this._productsFilter.filter(x=>x.id==this.filterParams.productId);
      }
      else{
        if(this.filterParams.productId == 0){
          this.products = this._productsFilter.filter(x=>x.meat_typeId==this.filterParams.meatTypeId);
        }
        else{
          this.products = this._productsFilter.filter(x=>x.id==this.filterParams.productId && x.meat_typeId == this.filterParams.meatTypeId);
        }
      }
    }

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
    this.findProducts(false);
    this.currentPage = pageNum;
  }

  nextPage(){
    this.filterParams.pageNum += 1;
    this.findProducts(false);
    this.currentPage += 1;
  }

  previousPage(){
    this.filterParams.pageNum -= 1;
    this.findProducts(false);
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

  deleteProduct(id:number): void{

    Swal.fire({
      title: "¿Estás seguro de eliminar?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
          Swal.fire({
          html: 'espere...',
          title: 'Eliminando registro',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this._productHttpService.getProductId(id).subscribe((product: Product) => {
          product.is_deleted = "Y";

          this._productHttpService.updateProduct(id, product).subscribe((product: Product) => {
            Swal.close();

            if(product){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Registro eliminado',
                showConfirmButton: false,
                timer: 2000
              });

              this.products = this.products.filter(e=>e.id!==id);
              this._productsFilter = this._productsFilter.filter(e=>e.id!==id);
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

        });

      }
    });


  }

  setUpdateProductId(branchId: number): void{
    this.productId = branchId;
    this.visibleUpdProduct = true;
  }

}
