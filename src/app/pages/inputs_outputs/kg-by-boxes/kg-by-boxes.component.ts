import { Component, Renderer2, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { HttpService }  from 'src/app/services/http.service';
import { Product } from "src/app/models/product.model";
import Swal from "sweetalert2";

@Component({
  selector: 'app-kg-by-boxes',
  templateUrl: './kg-by-boxes.component.html',
  styleUrls: ['./kg-by-boxes.component.scss']
})
export class KgByBoxesComponent implements OnChanges {
 @Input() product: Product;
 @Output() newKgEvent = new EventEmitter<number>();

 public noValidKg = false;
 public noValidKgMsg = "";
 public previousKg = 0;

 public changeDataCalc: boolean = false;
 public disabledDataCalc: boolean = true;


  constructor(public _httpService: HttpService, private renderer:Renderer2) { }

  ngOnChanges() {
    //console.log(this.product);
  }

  setChangeDataCalc(changeDataCalc, disabledDataCalc){
    this.changeDataCalc=changeDataCalc;
    this.disabledDataCalc=disabledDataCalc;
    if(changeDataCalc){
      this.previousKg = this.product.kg_by_boxes;

      setTimeout(() => {
        var element = this.renderer.selectRootElement('#kgbyboxes');
        element.focus();
      }, 100);

    }else{
      this.product.kg_by_boxes = this.previousKg;
      this.noValidKg = false;
      this.noValidKgMsg = "";
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

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Datos guardados',
        showConfirmButton: false,
        timer: 1500
      });

      this.newKgEvent.emit(this.product.kg_by_boxes);
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

  onSubmit(f) {

    if(f.invalid){
      this.validateKg(f);

      return false;
    }
    this.noValidKg=false;

    this.saveDataCalc();
  }

  validateKg(f) {
    if(f.controls.kgbyboxes.errors && f.controls.kgbyboxes.errors.required){
      this.noValidKgMsg = "Este campo es requerido";
      this.noValidKg = true;
      return;
    }

    if(f.controls.kgbyboxes.errors && f.controls.kgbyboxes.errors.min){
      this.noValidKgMsg = "El valor debe ser mayor a cero";
      this.noValidKg=true;
      return;
    }

    this.noValidKg = false;
    return;
  }

  cleanErrorMsgs(){
    this.noValidKg = false;
    this.noValidKgMsg = "";
  }

  setFocus(){
    setTimeout(() => {
      var element = this.renderer.selectRootElement("#kgbyboxes");
      element.focus();
    }, 100);
  }

}
