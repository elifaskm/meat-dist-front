import { Component, Renderer2, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from "src/app/models/product.model";
import Swal from "sweetalert2";
import { HttpService, ProductHttpService }  from 'src/app/services';

@Component({
  selector: 'app-update-products',
  templateUrl: './update-products.component.html',
  styleUrls: ['./update-products.component.scss']
})
export class UpdateProductsComponent implements OnInit {
  @Input() productId: number;

  @Output() messageEvent = new EventEmitter<boolean>();

  sendMessage(saved: boolean) {
    this.messageEvent.emit(saved);
  }

 public product: Product = {
  id: 0,
  is_deleted: 'N',
  meat_typeId: 0,
  by_boxes:"",
  by_kilograms:"",
  by_pieces:"",
  description:"",
  kg_by_boxes:0,
  calc_by:"",
  price:0
}

  public pageSize: number = 10;
  public pageNum: number = 0;

  public noValidName = false;
  public noValidNameMsg = "";


  constructor(public _productHttpService: ProductHttpService) { }

  ngOnInit() {

    this._productHttpService.getProductId(this.productId).subscribe((product: Product) => {
      this.product = product;
    });

  }

  clearControls(){
    this.product.id = 0;
    this.product.description = "";
    this.product.is_deleted = "N";
    this.product.meat_typeId = 0;
    this.product.by_boxes = "";
    this.product.by_kilograms = "";
    this.product.by_pieces = "";
    this.product.kg_by_boxes = 0;
    this.product.calc_by = "";
    this.product.price = 0;
  }

  postBranch(f): void{

    //inico
    Swal.fire({
      title: "¿Estás seguro de actualizar?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, actualizalo!"
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          html: 'espere...',
          title: 'Actualizando registro',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this._productHttpService.updateProduct(this.product.id, this.product).subscribe((product: Product) => {

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

      }
    });
    //fin


  }

  onSubmit(f) {

    if(f.invalid){
      this.validateName(f);

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

  cleanErrorMsgs(){
    this.noValidName = false;
    this.noValidNameMsg = "";
  }

}
