import { Component, Renderer2, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MeatType } from "src/app/models/meat_type.model";
import { Product } from "src/app/models/product.model";
import { Branch } from "src/app/models/branch.model";
import Swal from "sweetalert2";
import { listCalcBy } from './../../../models/calc_by.model';
import { ProductSent } from 'src/app/models/product_sent.model';
import { HttpService, BranchHttpService }  from 'src/app/services';

@Component({
  selector: 'app-update-productsent',
  templateUrl: './update-product-sent.component.html',
  styleUrls: ['./update-product-sent.component.scss']
})
export class UpdateProductSentComponent implements OnInit {
  @Input() productSentId: number;

  @Output() messageEvent = new EventEmitter<boolean>();

  sendMessage(saved: boolean) {
    this.messageEvent.emit(saved);
  }

 public products: Product[] = [];
 public target_branches: Branch[] = [];

 public meat_type: MeatType = {
  id: 0,
  meat_name: "",
  is_deleted: ""
}


 public product: Product = {
  id: 0,
  meat_typeId: 0,
  description: "",
  by_kilograms: "",
  by_pieces: "",
  by_boxes: "",
  is_deleted: "",
  price: 0,
  calc_by: "",
  kg_by_boxes: 0
 };
 public ListCalcBy = listCalcBy;

 public pageSize: number = 10;
  public pageNum: number = 0;

     public product_sent: ProductSent = {
      id: null,
      ProductId: 0,
      kilograms: null,
      pieces: null,
      boxes: null,
      amount: null,
      date: new Date(),
      status: "P",
      BranchId: 0,
      input_outputId: null,
      branch_name: ""
     };

  private dcurrent = new Date();
  public dateString = this.dcurrent.getFullYear() + '-' + String(this.dcurrent.getMonth() + 1).padStart(2, '0') + '-' + String(this.dcurrent.getDate()).padStart(2, '0');

  public disabledKilograms = false;
  public disabledPieces = false;
  public disabledBoxes = false;
  public disabledDataCalc: boolean = true;

  public noValidAmount = false;
  public noValidAmountMsg = "";
  public noValidBoxes = false;
  public noValidBoxesMsg = "";
  public noValidPieces = false;
  public noValidPiecesMsg = "";
  public noValidKilograms = false;
  public noValidKilogramsMsg = "";
  public noValidDate = false;
  public noValidDateMsg = "";
  public noValidPrice = false;
  public noValidPriceMsg = "";

  public changeDataCalc: boolean = false;
  public previousPrice: number = 0;
  public previousCalcBy: string = "";


  constructor(public _httpService: HttpService, private renderer:Renderer2, public _branchHttpService: BranchHttpService) { }

  ngOnInit() {

    this._branchHttpService.getBranches().subscribe((branches: Branch[]) => {
      let branchNoOne : Branch = {
        id: 0,
        name: "-Ninguno-",
        address: "",
        is_deleted: "N",
        is_warehouse: "N"
      };
      this.target_branches.push(
       branchNoOne
      );

      this.target_branches = this.target_branches.concat(branches);
    });

    this._httpService.getProductSentById(this.productSentId).subscribe((productSent: ProductSent) => {
      this.product_sent = productSent;
      let dateProductSent = productSent.date.toString().split("T")[0].split("-");// new Date(Date.parse(productSent.date.toString()));
      //console.log(productSent.date);
      //this.dateString = dateProductSent.getFullYear() + '-' + String(dateProductSent.getMonth() + 1).padStart(2, '0') + '-' + String(dateProductSent.getDate()).padStart(2, '0');
      this.dateString = dateProductSent[0] + '-' + dateProductSent[1] + '-' + dateProductSent[2];

      this._httpService.getProductById(productSent.ProductId).subscribe((product: Product) => {

        this.disabledKilograms = !(product.by_kilograms=="Y");
        this.disabledPieces = !(product.by_pieces=="Y");
        this.disabledBoxes = !(product.by_boxes=="Y");
        this.product = product;

        this._httpService.getMeatTypeById(product.meat_typeId).subscribe((meatType: MeatType) => {
          this.meat_type = meatType;
        });
      });
    });
  }

  updateKgByBoxes(kg: number){
    this.product.kg_by_boxes = kg;
    this.clearControls();
  }

  clearControls(){
    this.product_sent.amount = null;
    this.product_sent.boxes = null;
    this.product_sent.kilograms = null;
    this.product_sent.pieces = null;
  }

  postInputsOutputs(f): void{

    //inico
    Swal.fire({
      title: "¿Estás seguro de actualizar?",
      text: "¡También se actualizará la Salida del Almacén!",
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

        this._branchHttpService.updateProductSentToBranch(this.product_sent.id, this.product_sent).subscribe((productSent: ProductSent) => {

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
      this.validatePieces(f);
      this.validateBoxes(f);
      this.validateAmount(f);
      this.validateKilograms(f);
      this.validateDate(f);

      return false;
    }
    this.noValidDate=false;
    this.noValidKilograms=false;
    this.noValidPieces = false;
    this.noValidBoxes = false;
    this.noValidAmount = false;

    this.postInputsOutputs(f);
  }

  validateDate(f) {
    if(f.controls.date.errors && f.controls.date.errors.required){
      this.noValidDateMsg = "Este campo es requerido";
      this.noValidDate=true;
      return;
    }

    this.noValidDate = false;
    return;
  }

  validateKilograms(f) {
    if(f.controls.kilograms.errors && f.controls.kilograms.errors.required){
      this.noValidKilogramsMsg = "Este campo es requerido";
      this.noValidKilograms=true;
      return;
    }
    if(f.controls.pieces.errors && f.controls.pieces.errors.min){
      this.noValidKilogramsMsg = "El valor debe ser mayor a cero";
      this.noValidKilograms=true;
      return;
    }

    this.noValidKilograms = false;
    return;
  }

  validatePieces(f) {
    if(f.controls.pieces.errors && f.controls.pieces.errors.required){
      this.noValidPiecesMsg = "Este campo es requerido";
      this.noValidPieces=true;
      return;
    }
    if(f.controls.pieces.errors && f.controls.pieces.errors.min){
      this.noValidPiecesMsg = "El valor debe ser mayor a cero";
      this.noValidPieces=true;
      return;
    }

    this.noValidPieces = false;
    return;
  }

  validateBoxes(f) {
    if(f.controls.boxes.errors && f.controls.boxes.errors.required){
      this.noValidBoxesMsg = "Este campo es requerido";
      this.noValidBoxes=true;
      return;
    }
    if(f.controls.boxes.errors && f.controls.boxes.errors.min){
      this.noValidBoxesMsg = "El valor debe ser mayor a cero";
      this.noValidBoxes=true;
      return;
    }

    this.noValidBoxes = false;
    return;
  }

  validateAmount(f) {
    if(f.controls.amount.errors && f.controls.amount.errors.required){
      this.noValidAmountMsg = "Este campo es requerido";
      this.noValidAmount=true;
      return;
    }
    if(f.controls.amount.errors && f.controls.amount.errors.min){
      this.noValidAmountMsg = "El valor debe ser mayor a cero";
      this.noValidAmount=true;
      return;
    }

    this.noValidAmount = false;
    return;
  }

  setChangeDataCalc(changeDataCalc, disabledDataCalc){
    this.changeDataCalc=changeDataCalc;
    this.disabledDataCalc=disabledDataCalc;
    if(changeDataCalc){
      this.previousPrice = this.product.price;
      this.previousCalcBy = this.product.calc_by;

      setTimeout(() => {
        var element = this.renderer.selectRootElement('#price');
        element.focus();
      }, 100);
    }else{
      this.product.price = this.previousPrice;
      this.product.calc_by = this.previousCalcBy;
      this.noValidPrice = false;
      this.noValidPiecesMsg = "";
    }
  }

  saveDataCalc(): void{
    Swal.fire({
      html: 'espere...',
      title: 'Guardando datos',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this._httpService.patchProduct(this.product.id, this.product).subscribe((product: Product) => {
      Swal.close();

      this.changeDataCalc = false;
      this.disabledDataCalc = true;

      this.clearControls();

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Datos guardados',
        showConfirmButton: false,
        timer: 1500
      });
    },
    error => {

      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Error',
        html: error,
        showConfirmButton: false,
        timer: 1500
      });

    }
    );
  }

  onSubmitDataCalc(f) {

    if(f.invalid){
      this.validatePrice(f);

      return false;
    }
    this.noValidPrice=false;

    this.saveDataCalc();
  }

  validatePrice(f) {
    if(f.controls.price.errors && f.controls.price.errors.required){
      this.noValidPriceMsg = "Este campo es requerido";
      this.noValidPrice = true;
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

  calculateAmount(calcBy, value){
    if(calcBy == this.product.calc_by){
      if(value!=""){
        this.product_sent.amount = value * this.product.price;
      }
    }

    if(calcBy=="K" && this.product.by_boxes=="Y" && this.product.kg_by_boxes){
      this.product_sent.boxes = value / this.product.kg_by_boxes;
    }
  }

  cleanErrorMsgs(){
    this.noValidAmount = false;
    this.noValidAmountMsg = "";
    this.noValidBoxes = false;
    this.noValidBoxesMsg = "";
    this.noValidPieces = false;
    this.noValidPiecesMsg = "";
    this.noValidKilograms = false;
    this.noValidKilogramsMsg = "";
    this.noValidDate = false;
    this.noValidDateMsg = "";
    this.noValidPrice = false;
    this.noValidPriceMsg = "";
  }

  setFocus(calcByK, calcByP, calcByB){
    let control: string;
    if(calcByK=="Y"){
      control = '#kilograms';
    }else if(calcByP=="Y"){
      control = '#pieces';
    }
    else if(calcByB=="Y"){
      control = '#boxes';
    };

    setTimeout(() => {
      var element = this.renderer.selectRootElement(control);
      element.focus();
    }, 100);
  }

}
