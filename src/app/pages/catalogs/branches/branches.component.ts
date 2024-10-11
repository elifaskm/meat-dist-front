import { Branch } from './../../../models/branch.model';
import { Component, OnInit } from '@angular/core';
import { HttpService, BranchHttpService }  from 'src/app/services';
import Swal from "sweetalert2";

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {
  public branches: Branch[];
  public _branchesFilter: Branch[];
  private _branch: Branch;
  public branchId: number;

  public filterParams:any = {
    pageSize: 20,
    pageNum: 0,
    branchId: null
  }

  public visibleFilters = false;
  public visibleUpdBranch = false;
  public visibleInsBranch = false;
  private pagesLength: number = 0;
  public pages: number[] = [];
  public currentPage: number = 1;

  constructor(public _httpService: HttpService, public _branchHttpService: BranchHttpService) { }

  receiveMessage($event) {
    this.visibleUpdBranch = false;
    this.visibleInsBranch = false;

    if($event){
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Registro guardado',
        showConfirmButton: false,
        timer: 2000
      });
      this.findBranches();
    }

  }

  ngOnInit() {

    this.findBranches();

  }

  findBranches(getTotalRows: boolean = true){
    this._branchHttpService.findBranches(this.filterParams, true).subscribe((branches: Branch[]) => {
      this.filterParams.branchId = 0;
      let itemAll: Branch[] = [];
      itemAll.push({
        id: 0,
        is_deleted: 'N',
        name: 'Todas',
        address: "",
        is_warehouse: "N"
      });

      this.branches = branches.filter(e=>e.is_deleted=="N");
      this._branchesFilter = itemAll.concat(branches.filter(e=>e.is_deleted=="N"));
      // this.branches = this.branches.filter(e=>e.id!==id);
      //         this._branchesFilter = this._branchesFilter.filter(e=>e.id!==id);
    });

    if(getTotalRows){
      this.pagesLength = 0;
      this.pages = [];
      this._branchHttpService.findBranches(this.filterParams, true).subscribe((data: any[]) => {
        this.pagesLength = Math.ceil((data[0].TotalRows / this.filterParams.pageSize));
        for(let i = 0; i<this.pagesLength; i++){
          this.pages.push(i+1);
        }
      });
    }

  }


  onSubmit(f) {
    //this.filterParams.pageNum = 0;
    this.filterParams.branchId = f.value.branchFilter;
    if(this.filterParams.branchId == 0){
      this.findBranches();
    }else{
      this.branches = this._branchesFilter.filter(x=>x.id==this.filterParams.branchId);
    }

  }

  pageClass(numPage:number){
    if(numPage==this.currentPage){
      return "page-item active";
    }else{
      return "page-item";
    }
  }

  changePage(pageNum){
    this.filterParams.pageNum = pageNum - 1;
    this.findBranches(false);
    this.currentPage = pageNum;
  }

  nextPage(){
    this.filterParams.pageNum += 1;
    this.findBranches(false);
    this.currentPage += 1;
  }

  previousPage(){
    this.filterParams.pageNum -= 1;
    this.findBranches(false);
    this.currentPage -= 1;
  }

  nextPageClass(){
    if(this.pagesLength==this.currentPage){
      return "page-item disabled";
    }else{
      return "page-item";
    }
  }

  previousPageClass(){
    if(this.currentPage==1){
      return "page-item disabled";
    }else{
      return "page-item";
    }
  }

  deleteBranch(id:number): void{

    Swal.fire({
      title: "¿Estás seguro de eliminar?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminalo!"
    }).then((result) => {
      if (result.isConfirmed) {
          Swal.fire({
          html: 'espere...',
          title: 'Eliminando registro',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // public getBranchId(branchId: number){
        //   return this._http.get<Branch>(this.baseUrl + "/branch/" + branchId);
        // }

        this._branchHttpService.getBranchId(id).subscribe((branch: Branch) => {
          branch.is_deleted = "Y";

          this._branchHttpService.updateBranch(id, branch).subscribe((branch: Branch) => {
            Swal.close();

            if(branch){
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Registro eliminado',
                showConfirmButton: false,
                timer: 2000
              });

              this.branches = this.branches.filter(e=>e.id!==id);
              this._branchesFilter = this._branchesFilter.filter(e=>e.id!==id);
            }else{
              Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error',
                html: "Error al eliminar registro",
                showConfirmButton: false,
                timer: 2000
              });
            }
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

          });

        });

        // public updateBranch(id:number, body: any){
        //   return this._http.patch(this.baseUrl + "/branch/"+id.toString(), body);
        // }



      }
    });


  }

  setUpdateBranchId(branchId: number): void{
    this.branchId = branchId;
    this.visibleUpdBranch = true;
  }

}
