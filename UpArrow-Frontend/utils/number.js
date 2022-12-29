export const numberComma = (num) => {
  let [integer, fraction] = String(num).split('.');

  integer = Number(integer);
  fraction = fraction?.padEnd(2, '0');
  if (typeof integer === 'number' && String(integer).length > 3) {
    integer = [...String(integer)].reverse().join('');
    let newNum = '';
    for (let i = 0; i < integer.length; i++) {
      if (i % 3 === 0 && i !== 0) {
        newNum += ',';
      }
      newNum = newNum + integer[i]; //8
    }
    if (fraction) {
      return [...newNum].reverse().join('') + '.' + fraction;
    }
    return [...newNum].reverse().join('');
  }
  if (fraction) {
    return integer + '.' + fraction;
  }
  return integer;
};
