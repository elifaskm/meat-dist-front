import { Branch } from './../../models/branch.model';
import { ProductSent } from './../../models/product_sent.model';
import { Product } from './../../models/product.model';
import { Component, OnInit } from '@angular/core';
import { HttpService, BranchHttpService }  from 'src/app/services';
import { MeatType } from "src/app/models/meat_type.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-product-sents',
  templateUrl: './product_sents.component.html',
  styleUrls: ['./product_sents.component.scss']
})
export class ProductSentsComponent implements OnInit {
  public meat_types: MeatType[] = [];
  public products: Product[] = [];
  public branches: Branch[];
  private _producSent: ProductSent;
  public producSents: ProductSent[];
  public productSentId: number;

  public filterParams:any = {
    pageSize: 20,
    pageNum: 0,
    movType: null,
    meatType: null,
    productId: null,
    iniDate: null,
    finDate: null,
    branchId: null
  }

  public visibleFilters = false;
  public visibleUpdProdSent = false;
  private pagesLength: number = 0;
  public pages: number[] = [];
  public currentPage: number = 1;

  constructor(public _httpService: HttpService, public _branchHttpService: BranchHttpService) { }

  receiveMessage($event) {
    this.visibleUpdProdSent = false;

    if($event){
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Salida registrada',
        showConfirmButton: false,
        timer: 2000
      });
      this.finProductSents();
    }

  }

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

    this.finProductSents();

    this._branchHttpService.getBranches().subscribe((branches: Branch[]) => {
      this.filterParams.branchId = 0;
      let itemAll: Branch[] = [];
      itemAll.push({
        id: 0,
        is_deleted: 'N',
        name: 'Todas',
        adress: "",
        is_warehouse: "N"
      });

      this.branches = itemAll.concat(branches);
    });
  }

  finProductSents(getTotalRows: boolean = true){
    this._httpService.getProductSents(this.filterParams).subscribe((productSent: ProductSent[]) => {
      this.producSents = productSent;
    });

    if(getTotalRows){
      this.pagesLength = 0;
      this.pages = [];
      this._httpService.getProductSents(this.filterParams, true).subscribe((data: any[]) => {
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
        meat_typeId: 0,
        price: 0,
        calc_by: "",
        kg_by_boxes: 0
      });

      this.products = itemAll.concat(products);

    })
  }

  onSubmit(f) {

    this.filterParams.pageNum = 0;
    this.filterParams.movType = f.value.movement;
    this.filterParams.meatType = f.value.meatType;
    this.filterParams.productId = f.value.product;
    this.filterParams.iniDate = f.value.dateIni;
    this.filterParams.finDate = f.value.dateFin;
    console.log(f.value);
    this.filterParams.branchId = f.value.branchFilter;

    this.finProductSents();
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
    this.finProductSents(false);
    this.currentPage = pageNum;
  }

  nextPage(){
    this.filterParams.pageNum += 1;
    this.finProductSents(false);
    this.currentPage += 1;
  }

  previousPage(){
    this.filterParams.pageNum -= 1;
    this.finProductSents(false);
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

  deleteProductSent(id:number): void{

    Swal.fire({
      title: "¿Estás seguro de eliminar?",
      text: "¡También se eliminará la salida del almacén!",
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

        this._httpService.deleteProductSent(id).subscribe((resp: boolean) => {
          Swal.close();

          if(resp){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Registro eliminado',
              showConfirmButton: false,
              timer: 2000
            });

            this.producSents = this.producSents.filter(e=>e.id!==id);
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
    });


  }

  asignarSucursalDestino(id:number): void{
    let obj=new Object();
    this._branchHttpService.getProductSentToBranch(id).subscribe((prodSent: ProductSent) => {
      if(prodSent){
        this._producSent = prodSent;

        let branchSelected = this.branches.find(x => x.id == prodSent.BranchId);

        obj["id-"+branchSelected.id] = branchSelected.name;

        this.branches.forEach(element => {
          if(element.id!=prodSent.BranchId){
            obj["id-"+element.id] = element.name;
          }
        });

        if(prodSent.input_outputId>0){
          obj["id-0"] = "-Ninguno-";
        }
      }else{
        this._producSent = null;
        obj["id-0"] = "-Ninguno-";
        this.branches.forEach(element => {
          obj["id"+element.id] = element.name;
        });
      }

      Swal.fire({
        title: "Sucursal Destino",
        input: "select",
        inputOptions: obj,

        showCancelButton: true,
        inputValidator: (value) => {
          let _id = value.split("-")[1];
          console.log(_id);
           //guardar cuando se seleccione
           //if tenía asignado una sucursal entonces se update
           if(this._producSent){
            //si lo cambia por cero entonces es eliminar
            if(Number(_id)==0){
              this._branchHttpService.deleteProductSentToBranch(this._producSent.id).subscribe((resp: any) => {
                Swal.close();

                if(resp){
                }else{
                  Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Error',
                    html: "Error al guardar registro",
                    showConfirmButton: false,
                    timer: 2000
                  });
                }
              },
              error => {
                Swal.close();
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
            else{
              this._producSent.BranchId = Number(_id);
              this._branchHttpService.updateProductSentToBranch(this._producSent.id, this._producSent).subscribe((resp: any) => {
                Swal.close();

                if(resp){
                }else{
                  Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Error',
                    html: "Error al guardar registro",
                    showConfirmButton: false,
                    timer: 2000
                  });
                }
              },
              error => {
                Swal.close();
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
           }else{
            let output = this.producSents.find(e=>e.id===id);
            this._producSent = {
              id: 0,
              ProductId: output.ProductId,
              kilograms: output.kilograms,
              pieces: output.pieces,
              boxes: output.boxes,
              amount: output.amount,
              date: output.date,
              status: "P",
              BranchId: Number(_id),
              input_outputId: output.id,
              branch_name: output.branch_name
            }
            this._branchHttpService.saveProductSentToBranch(this._producSent).subscribe((resp: any) => {
              Swal.close();

              if(resp){
              }else{
                Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: 'Error',
                  html: "Error al guardar registro",
                  showConfirmButton: false,
                  timer: 2000
                });
              }
            },
            error => {
              Swal.close();
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
           //if no tenía entonces se insert
          return new Promise((resolve) => {
            //if (value === "oranges") {
              resolve();
            // } else {
            //   resolve("You need to select oranges :)");
            // }
          });
        }
      });
    });



    //const { value: fruit } =


    // if (fruit) {
    //   Swal.fire(`You selected: ${fruit}`);
    // }
  }

  setUpdateProductSentId(prodSentId: number): void{
    this.productSentId = prodSentId;
    this.visibleUpdProdSent = true;
  }
}
