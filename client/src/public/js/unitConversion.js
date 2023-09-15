let jsonConvertion = {
  'und' : {
     'und' : 1
  },
  'gr' : {
    'kg' : 0.001,
    'mg' : 1000,
    'lb' : 0.00220462,
    'oz' : 0.035274,
    'gr' : 1
  },
  'mg' : {
    'kg': 0.000001,
    'lb': 0.000002204622621849,
    'oz': 0.00003527396194958,
    'gr': 0.001,
    'mg': 1
  },
  'lb' : {
    'kg': 0.45359237,
    'oz': 16,
    'gr': 453.59237,
    'mg': 453592.37,
    'lb': 1,
  },
  'kg':{
    'oz': 35.27396194958,
    'gr': 1000,
    'mg': 1000000,
    'lb': 2.204622621849,
    'kg': 1,
  },
  'oz':{
    'gr': 28.349523125,
    'mg': 28349.523125,
    'lb': 0.0625,
    'kg': 0.028349523125,
    'oz': 1,
  },
  'lt':{
    'ml': 1000,
    'cm3': 1000,
    'lt': 1,
  },
  'cm3':{
    'ml': 1,
    'lt': 0.001,
    'cm3': 1
  },
  'ml' :{
    'lt': 0.001,
    'cm3': 1,
    'ml': 1,
  }
};


export const convertion = (initialUnit, quantity , convertUnit) => {

  if (initialUnit == undefined){
    return quantity;
  }

  if (convertUnit == undefined){
    return quantity;
  }

  let valueToconvertion = jsonConvertion[initialUnit][convertUnit];
  let valueOperation = parseFloat(quantity * valueToconvertion);

  if (valueToconvertion == undefined){
    return quantity;
  }
  
  return parseFloat(valueOperation.toFixed(2));
}