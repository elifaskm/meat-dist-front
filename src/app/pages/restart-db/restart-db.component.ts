import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpService }  from 'src/app/services/http.service';
import { BranchCashControlHttpService }  from 'src/app/services/branch-cash-control-http.service';

@Component({
  selector: 'app-restart-db',
  templateUrl: './restart-db.component.html',
  styleUrls: ['./restart-db.component.scss']
})
export class RestartDbComponent implements OnInit {

  public copy: string;
  constructor(public _httpService: HttpService, public _branchCashControlHttpService: BranchCashControlHttpService ) { }

  ngOnInit() {
  }

  deleteInfo(){
    Swal.fire({
      title: '¿Está seguro de eliminar la información?',
      text: "(esta operación no se puede revertir)",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._httpService.delAllInputsOutputs().subscribe(() => {
          this._httpService.delAllProductSents().subscribe(() => {
          this._httpService.delAllStock().subscribe(() => {
            Swal.fire(
              '¡Listo!',
              'La información ha sido eliminada.',
              'success'
            );
          });
        });
        });
      }
    })
  }

  deleteInfoBranches(){
    Swal.fire({
      title: '¿Está seguro de eliminar la información?',
      text: "(esta operación no se puede revertir)",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._branchCashControlHttpService.delAllBranchCashControl().subscribe(() => {
          this._branchCashControlHttpService.delAllStocksResidue().subscribe(() => {
          this._branchCashControlHttpService.delAllBranchProductsEntry().subscribe(() => {
            Swal.fire(
              '¡Listo!',
              'La información ha sido eliminada.',
              'success'
            );
          });
        });
        });
      }
    })
  }

}
