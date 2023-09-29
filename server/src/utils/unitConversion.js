let jsonConvertion = {
  und: {
    und: 1,
    min: 1,
  },
  gr: {
    kg: 0.001,
    mg: 1000,
    lb: 0.00220462,
    oz: 0.035274,
    gr: 1,
    min: 1,
  },
  mg: {
    kg: 0.000001,
    lb: 0.000002204622621849,
    oz: 0.00003527396194958,
    gr: 0.001,
    mg: 1,
    min: 1,
  },
  lb: {
    kg: 0.45359237,
    oz: 16,
    gr: 453.59237,
    mg: 453592.37,
    lb: 1,
    min: 453.59237,
  },
  kg: {
    oz: 35.27396194958,
    gr: 1000,
    mg: 1000000,
    lb: 2.204622621849,
    kg: 1,
    min: 1000,
  },
  oz: {
    gr: 28.349523125,
    mg: 28349.523125,
    lb: 0.0625,
    kg: 0.028349523125,
    oz: 1,
    min: 28.349523125,
  },
  lt: {
    ml: 1000,
    cm3: 1000,
    lt: 1,
    min: 1000,
  },
  cm3: {
    ml: 1,
    lt: 0.001,
    cm3: 1,
    min: 1,
  },
  ml: {
    lt: 0.001,
    cm3: 1,
    ml: 1,
    min: 1,
  },
};

/**
 *
 * @param {*} initialUnit unidad de medida inicial
 * @param {*} quantity cantidad a convertir
 * @param {*} convertUnit unidad de medida a convertir
 * @returns cantidad convertida
 */
const convertion = (initialUnit, quantity, convertUnit) => {
  if (initialUnit == undefined) {
    return quantity;
  }

  if (convertUnit == undefined) {
    return quantity;
  }

  if (initialUnit == convertUnit) {
    return quantity;
  }

  let valueToconvertion = jsonConvertion[initialUnit][convertUnit];
  let valueOperation = parseFloat(quantity * valueToconvertion);

  if (valueToconvertion == undefined) {
    return quantity;
  }

  return parseFloat(valueOperation.toFixed(2));
};

/**
 *
 * @param {*} initialUnit Unidad de medida que ingreso el usuario
 * @param {*} quantity  Costo unitario que ingreso el usuario
 * @param {*} convertUnit Unidad de medida que tiene el ingrediente
 * @returns El costo unitario por la unidad de medida del ingrediente
 */
const convertionPrice = (initialUnit, quantity, convertUnit) => {
  if (initialUnit == undefined) {
    return quantity;
  }

  if (convertUnit == undefined) {
    return quantity;
  }

  if (initialUnit == convertUnit) {
    return quantity;
  }

  let valueToconvertion = jsonConvertion[initialUnit][convertUnit];
  let valueOperation = parseFloat(quantity / valueToconvertion);

  if (valueToconvertion == undefined) {
    return quantity;
  }

  return parseFloat(valueOperation.toFixed(2));
};

module.exports = { convertion, convertionPrice };
