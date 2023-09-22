//export const CalcByList = () => {

type CalcBy = {
  key: string;
  value: string;
}

const calcByK: CalcBy = {
  key: 'K',
  value: 'Kilos',
};

const calcByP: CalcBy = {
  key: 'P',
  value: 'Piezas',
};

const calcByB: CalcBy = {
  key: 'B',
  value: 'Cajas',
};

//type CalcBy: { key: string; value: string; } = {key:"", value:""};
const LstCalcBy: CalcBy[] = [];

// CalcBy.key = "K";
// CalcBy.value = "Kilos";
LstCalcBy.push(calcByK);
LstCalcBy.push(calcByP)
LstCalcBy.push(calcByB);;


// CalcBy.key = "P";
// CalcBy.value = "Piezas";
// CalcBy.key = "B";
// CalcBy.value = "Cajas";

// export interface CalcBy{
//   key: number;
//   value: string;
// }
export const listCalcBy = LstCalcBy;
// return LstCalcBy;
// };
