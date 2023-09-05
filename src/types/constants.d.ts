export type ConstantRange = {
  from?: number;
  to?: number;
};

export type Constant = {
  type: string;
  name: string;
  value: string | number | boolean;
  valueString: string;
  range: ConstantRange;
  line: string;
};
