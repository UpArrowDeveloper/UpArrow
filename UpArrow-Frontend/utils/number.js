export const numberComma = (num) => {
  return num.toLocaleString();
};

export const isNumber = (v) => {
  return !Number.isNaN(Number(v));
};
