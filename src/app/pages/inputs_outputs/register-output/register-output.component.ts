import { InputsOutputs } from 'src/app/models/inputs_outputs.model';
import { Component, Input, OnInit } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';
import { MeatType } from "src/app/models/meat_type.model";
import { Product } from "src/app/models/product.model";
import { Branch } from "src/app/models/branch.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-register-output',
  templateUrl: './register-output.component.html',
  styleUrls: ['./register-output.component.scss']
})
export class RegisterOutputComponent implements OnInit {
 // @Input() user: any = {};
 public meat_types: MeatType[] = [];
 public products: Product[] = [];
 public branches: Branch[] = [];

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
      type: "O",
      BranchId: 0
     };

  private dcurrent = new Date();
  public dateString = this.dcurrent.getFullYear() + '-' + String(this.dcurrent.getMonth() + 1).padStart(2, '0') + '-' + String(this.dcurrent.getDate()).padStart(2, '0');

  public disabledKilograms = false;
  public disabledPieces = false;
  public disabledBoxes = false;

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


  constructor(public _httpService: HttpService) { }

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
    this._httpService.getProductsByMeatType(meat_typeId).subscribe((products: Product[]) => {
      this.input_output.ProductId = products[0].id;

      this.disabledKilograms = !(products[0].by_kilograms=="Y");
      this.disabledPieces = !(products[0].by_pieces=="Y");
      this.disabledBoxes = !(products[0].by_boxes=="Y");

      this.products = products;
    })
  }

  getProductByPk(productId: any): void{
    this._httpService.getProductById(productId).subscribe((product: Product) => {
      this.disabledKilograms = !(product.by_kilograms=="Y");
      this.disabledPieces = !(product.by_pieces=="Y");
      this.disabledBoxes = !(product.by_boxes=="Y");
    })
  }

  postInputsOutputs(f): void{
    Swal.fire({
      html: 'espere...',
      title: 'Guardando salida',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.input_output.date = new Date(this.dateString);
    this._httpService.postInputsOutputs(this.input_output).subscribe((product: Product) => {
      Swal.close();

      //f.reset();

      this.input_output.amount = null;
      this.input_output.boxes = null;
      this.input_output.kilograms = null;
      this.input_output.pieces = null;
      this.input_output.BranchId = 0;

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Salida registrada',
        showConfirmButton: false,
        timer: 2000
      });
    },
    error => {

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Error',
        html: error,
        showConfirmButton: false,
        timer: 2000
      });

    }
    );
  }

  onSubmit(f) {
    //console.log(f);
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

}
