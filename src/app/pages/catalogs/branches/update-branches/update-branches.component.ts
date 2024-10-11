import { Component, Renderer2, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Branch } from "src/app/models/branch.model";
import Swal from "sweetalert2";
import { ProductSent } from 'src/app/models/product_sent.model';
import { HttpService, BranchHttpService }  from 'src/app/services';

@Component({
  selector: 'app-update-branches',
  templateUrl: './update-branches.component.html',
  styleUrls: ['./update-branches.component.scss']
})
export class UpdateBranchesComponent implements OnInit {
  @Input() branchId: number;

  @Output() messageEvent = new EventEmitter<boolean>();

  sendMessage(saved: boolean) {
    this.messageEvent.emit(saved);
  }

 public target_branches: Branch[] = [];

 public branch: Branch = {
  id: 0,
  name: "",
  address: "",
  is_deleted: "",
  is_warehouse: ""
 };

  public pageSize: number = 10;
  public pageNum: number = 0;

  public noValidName = false;
  public noValidNameMsg = "";


  constructor(public _httpService: HttpService, private renderer:Renderer2, public _branchHttpService: BranchHttpService) { }

  ngOnInit() {

    this._branchHttpService.getBranchId(this.branchId).subscribe((branch: Branch) => {
      this.branch = branch;
    });

  }

  clearControls(){
    this.branch.name = null;
    this.branch.address = null;
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

        this._branchHttpService.updateBranch(this.branch.id, this.branch).subscribe((branch: Branch) => {

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
