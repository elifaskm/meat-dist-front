import { Component, Renderer2, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Branch } from "src/app/models/branch.model";
import Swal from "sweetalert2";
import { HttpService, BranchHttpService }  from 'src/app/services';

@Component({
  selector: 'app-insert-branches',
  templateUrl: './insert-branches.component.html',
  styleUrls: ['./insert-branches.component.scss']
})
export class InsertBranchesComponent implements OnInit {
  //@Input() branchId: number;

  @Output() messageEvent = new EventEmitter<boolean>();

  sendMessage(saved: boolean) {
    this.messageEvent.emit(saved);
  }

 public branch: Branch = {
  id: 0,
  name: "",
  address: "",
  is_deleted: "N",
  is_warehouse: "N"
 };

  public pageSize: number = 10;
  public pageNum: number = 0;

  public noValidName = false;
  public noValidNameMsg = "";


  constructor(public _httpService: HttpService, private renderer:Renderer2, public _branchHttpService: BranchHttpService) { }

  ngOnInit() {
  }

  clearControls(){
    this.branch.name = null;
    this.branch.address = null;
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

    this._branchHttpService.insertBranch(this.branch).subscribe((branch: Branch) => {

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

      return false;
    }
    this.noValidName=false;

    this.postBranch(f);
  }

  validateName(f) {
    if(f.controls.name.errors && f.controls.name.errors.required){
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
