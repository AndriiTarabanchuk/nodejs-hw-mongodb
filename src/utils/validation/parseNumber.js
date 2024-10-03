export const parseNumber = (value, defaultValue) => {
  if (!value) return defaultValue;

  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) return defaultValue;

  return parsedValue;
};

// const parseNumber = (number, defaultValue) => {
//   const isString = typeof number === 'string';
//   if (!isString) return defaultValue;
//   const parsedNumber = parseInt(number);
//   if (Number.isNaN(parsedNumber)) {
//     return defaultValue;
//   }
//   return parsedNumber;
// }; //vertion lections
