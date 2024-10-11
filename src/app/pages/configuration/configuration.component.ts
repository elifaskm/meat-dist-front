import { Component, OnInit } from '@angular/core';
import { HttpService, ProductHttpService }  from 'src/app/services';
import { MeatType } from "src/app/models/meat_type.model";
import Swal from "sweetalert2";
import { Configuration } from '../../models/configuration.model';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  public configuration: Configuration;
  public objSemaphore = {green:{lessthanorequal:0},yellow:{greaterthan:0,lessthan:50},red:{greaterthanorequal:50}};

  public noValidSemaphoreGreen = false;
  public noValidSemaphoreGreenMsg = "";
  public noValidSemaphoreRed = false;
  public noValidSemaphoreRedMsg = "";
  public noValidSemaphoreYellow = false;
  public noValidSemaphoreYellowMsg = "";

  constructor(public _httpService: HttpService) { }

  ngOnInit() {

    this._httpService.getConfigurationByKey("SEMAPHORE").subscribe((configuration: Configuration) => {
      this.configuration = configuration;
      this.objSemaphore = JSON.parse(configuration.value);
    });

  }


  onSubmit(f) {

    if(f.invalid){
      // this.validateName(f);
      // this.validatePrice(f);

      return false;
    }
    //this.noValidName=false;

    if(!this.validateGreen()){
      return false;
    }

    if(!this.validateRed()){
      return false;
    }

    if(!this.validateYellow()){
      return false;
    }

    this.noValidSemaphoreGreen = false;
    this.noValidSemaphoreRed = false;
    this.noValidSemaphoreYellow = false;

    this.postBranch(f);

  }

  validateGreen() {
    if(this.objSemaphore.green.lessthanorequal>this.objSemaphore.yellow.greaterthan){
      this.noValidSemaphoreGreenMsg = "El valor del verde debe ser menor o igual al valor inicial del amarillo";
      this.noValidSemaphoreGreen=true;

      return false;
    }

    return true;
  }

  validateRed() {
    if(this.objSemaphore.red.greaterthanorequal<this.objSemaphore.yellow.lessthan){
      this.noValidSemaphoreRedMsg = "El valor del rojo debe ser mayor o igual al valor final del amarillo";
      this.noValidSemaphoreRed=true;

      return false;
    }

    return true;
  }

  validateYellow() {
    console.log(this.objSemaphore.yellow.lessthan);
    console.log(this.objSemaphore.yellow.greaterthan);
    if(this.objSemaphore.yellow.greaterthan>=this.objSemaphore.yellow.lessthan){
      this.noValidSemaphoreYellowMsg = "El valor inicial debe ser menor al valor final";
      this.noValidSemaphoreYellow=true;

      return false;
    }

    return true;
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

    this.configuration.value = JSON.stringify(this.objSemaphore);

    this._httpService.patchConfiguration(this.configuration.id, this.configuration).subscribe((config: Configuration) => {

    Swal.close();

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Registro guardado',
      showConfirmButton: false,
      timer: 1000
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

    //fin

  }

}
