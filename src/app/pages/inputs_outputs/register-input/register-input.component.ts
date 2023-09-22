import { listCalcBy } from './../../../models/calc_by.model';
import { InputsOutputs } from 'src/app/models/inputs_outputs.model';
import { Component, Renderer2, OnInit } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';
import { MeatType } from "src/app/models/meat_type.model";
import { Product } from "src/app/models/product.model";
import { Branch } from "src/app/models/branch.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-register-input',
  templateUrl: './register-input.component.html',
  styleUrls: ['./register-input.component.scss']
})
export class RegisterInputComponent implements OnInit {

 public meat_types: MeatType[] = [];
 public products: Product[] = [];
 public branches: Branch[] = [];
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
 };
 public ListCalcBy = listCalcBy;//[{key:"", value:""}];

 public pageSize: number = 10;
  public pageNum: number = 0;

  public input_output: InputsOutputs = {
      id: null,
      ProductId: 0,
      kilograms: null,
      pieces: null,
      boxes: null,
      amount: null,
      date: new Date(),
      type: "I",
      BranchId: 0
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


  constructor(public _httpService: HttpService, private renderer:Renderer2) { }

  ngOnInit() {
    this._httpService.getMeatTypes(this.pageSize, this.pageNum).subscribe((meat_types: MeatType[]) => {
      this.meat_types = meat_types;
      this.getProductsByMeatType(this.meat_types[0].id);
    });

    this._httpService.getAllWarehouse().subscribe((branches: Branch[]) => {
      this.input_output.BranchId = branches[0].id;
      this.branches = branches;
    });

  }

  getProductsByMeatType(meat_typeId: number): void{
    this.clearControls();
    this._httpService.getProductsByMeatType(meat_typeId).subscribe((products: Product[]) => {
      this.input_output.ProductId = products[0].id;

      this.disabledKilograms = !(products[0].by_kilograms=="Y");
      this.disabledPieces = !(products[0].by_pieces=="Y");
      this.disabledBoxes = !(products[0].by_boxes=="Y");

      this.product = products[0];
      this.cleanErrorMsgs();


      if(!this.disabledDataCalc){
        this.previousCalcBy = products[0].calc_by;
        this.previousPrice = products[0].price;
        this.setChangeDataCalc(false,true);
      }

      this.products = products.sort((a, b) => (a.description > b.description) ? 1 : -1);

      this.setFocus(this.product.by_kilograms, this.product.by_pieces, this.product.by_boxes);
    })
  }

  clearControls(){
    this.input_output.amount = null;
    this.input_output.boxes = null;
    this.input_output.kilograms = null;
    this.input_output.pieces = null;
  }

  getProductByPk(productId: any): void{
    this.clearControls();

    this._httpService.getProductById(productId).subscribe((product: Product) => {
      this.disabledKilograms = !(product.by_kilograms=="Y");
      this.disabledPieces = !(product.by_pieces=="Y");
      this.disabledBoxes = !(product.by_boxes=="Y");

      this.product = product;
      this.cleanErrorMsgs();

      if(!this.disabledDataCalc){
        this.previousCalcBy = product.calc_by;
        this.previousPrice = product.price;
        this.setChangeDataCalc(false,true);
      };

      this.setFocus(product.by_kilograms, product.by_pieces, product.by_boxes);
    })
  }

  postInputsOutputs(f): void{
    Swal.fire({
      html: 'espere...',
      title: 'Guardando entrada',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.input_output.date = new Date(this.dateString);
    this._httpService.postInputsOutputs(this.input_output).subscribe((product: Product) => {
      Swal.close();

      this.clearControls();

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Entrada registrada',
        showConfirmButton: false,
        timer: 2000
      });
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
        this.input_output.amount = value * this.product.price;
      }
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
