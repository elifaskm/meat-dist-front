import { Component, Renderer2, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from "src/app/models/product.model";
import Swal from "sweetalert2";
import { HttpService, ProductHttpService }  from 'src/app/services';
import { MeatType } from "src/app/models/meat_type.model";

@Component({
  selector: 'app-insert-products',
  templateUrl: './insert-products.component.html',
  styleUrls: ['./insert-products.component.scss']
})
export class InsertProductsComponent implements OnInit {
  //@Input() branchId: number;

  @Output() messageEvent = new EventEmitter<boolean>();

  sendMessage(saved: boolean) {
    this.messageEvent.emit(saved);
  }

 public product: Product = {
  id: 0,
  is_deleted: 'N',
  meat_typeId: 0,
  by_boxes:"N",
  by_kilograms:"Y",
  by_pieces:"N",
  description:"",
  kg_by_boxes:0,
  calc_by:"K",
  price:0
};

public meat_types: MeatType[] = [];

  public pageSize: number = 10;
  public pageNum: number = 0;

  public noValidName = false;
  public noValidNameMsg = "";
  public noValidPrice = false;
  public noValidPriceMsg = "";

  public disabledKgByBoxes = true;


  constructor(public _httpService: HttpService, public _productHttpService: ProductHttpService) { }

  ngOnInit() {

    this._httpService.getMeatTypes(10, 0).subscribe((meat_types: MeatType[]) => {
      this.meat_types = meat_types;

      this.product.meat_typeId = this.meat_types[0].id;
    });

  }

  clearControls(){
    this.product.id = 0;
    this.product.description = "";
    this.product.is_deleted = "N";
    this.product.meat_typeId = 0;
    this.product.by_boxes = "N";
    this.product.by_kilograms = "Y";
    this.product.by_pieces = "N";
    this.product.kg_by_boxes = 0;
    this.product.calc_by = "K";
    this.product.price = 0;
  }

  postBranch(f): void{

    //inicio
    Swal.fire({
      html: 'espere...',
      title: 'Guardando registro',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this._productHttpService.insertProduct(this.product).subscribe((product: Product) => {

    Swal.close();

    this.clearControls();

    this.sendMessage(true);
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

    }
    );
    //fin

  }

  onSubmit(f) {

    if(f.invalid){
      this.validateName(f);
      this.validatePrice(f);

      return false;
    }
    this.noValidName=false;

    this.postBranch(f);
  }

  validateName(f) {
    if(f.controls.description.errors && f.controls.description.errors.required){
      this.noValidNameMsg = "Este campo es requerido";
      this.noValidName=true;
      return;
    }

    this.noValidName = false;
    return;
  }

  validatePrice(f) {
    if(f.controls.price.errors && f.controls.price.errors.required){
      this.noValidPriceMsg = "Este campo es requerido";
      this.noValidPrice=true;
      return;
    }

    if(f.controls.price.errors && f.controls.price.errors.min){
      this.noValidPriceMsg = "El valor debe ser mayor a cero";
      this.noValidPrice=true;
      return;
    }

    this.noValidPrice = false;
    return;
  }

  cleanErrorMsgs(){
    this.noValidName = false;
    this.noValidNameMsg = "";
  }

  enableKgPorCajaControl(by_boxes){
    if (by_boxes=="Y"){
      this.disabledKgByBoxes = false;
    }else{
      this.disabledKgByBoxes = true;
    }
  }

}
