const number2Digit = (num: number | string) => {
  const chars = num.toString().split('');
  const digit = ['０', '１', '２', '３', '４', '５', '６', '７', '８', '９'];
  const convert = chars.map((char) => digit[parseInt(char)]);
  return convert.join('');
};

export { number2Digit };
