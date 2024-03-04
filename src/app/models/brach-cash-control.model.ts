export interface BranchCashControl{
  id: number;
  branchId: number;
  name: string;
  entry: number;
  selled: number;
  residue: number;
  adicionalInfo: string;
  dateOfCapture: Date;
  status: string;
  calcEntry: number;
  previousResidue: number;
}
