export const numberComma = (num) => {
  return (num || 0).toLocaleString();
};

export const isNumber = (v) => {
  return !Number.isNaN(Number(v));
};

export const getNumberUnit = (labelValue) => {
  console.log('label value : ', labelValue);
  // Nine Zeroes for Billions
  const unit =
    Math.abs(Number(labelValue)) >= 1.0e12
      ? 'T'
      : Math.abs(Number(labelValue)) >= 1.0e9
      ? 'B'
      : // Six Zeroes for Millions
      Math.abs(Number(labelValue)) >= 1.0e6
      ? 'M'
      : // Three Zeroes for Thousands
      Math.abs(Number(labelValue)) >= 1.0e3
      ? 'K'
      : Math.abs(Number(labelValue));

  return (
    parseFloat(
      Math.abs(Number(labelValue)) >= 1.0e12
        ? (Math.abs(Number(labelValue)) / 1.0e12).toFixed(2)
        : Math.abs(Number(labelValue)) >= 1.0e9
        ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2)
        : // Six Zeroes for Millions
        Math.abs(Number(labelValue)) >= 1.0e6
        ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2)
        : // Three Zeroes for Thousands
        Math.abs(Number(labelValue)) >= 1.0e3
        ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2)
        : Math.abs(Number(labelValue))
    ) + unit
  );
};
