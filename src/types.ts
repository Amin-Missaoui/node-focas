import type { FOCAS_ERROR_CODE } from "./errors.js";

export type Status = {
  aut: number;
  manual: number;
  run: number;
  edit: number;
  motion: number;
  mstb: number;
  emergency: number;
  write: number;
  labelskip: number;
  alarm: number;
  warning: number;
  battery: number;
};

export type Alarm = {
  data: number;
};

export type Program = {
  name: string;
  number: number;
};

export type Macro = {
  datano: number;
  value: number;
  raw: number;
  decimals: number;
};
