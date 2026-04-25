import koffi, { type IKoffiLib } from "koffi";

koffi.struct("ODBST", {
  dummy: "short[2]" /* Not used                           */,
  aut: "short" /* AUTOMATIC mode selection           */,
  manual: "short" /* MANUAL mode selection              */,
  run: "short" /* Status of automatic operation      */,
  edit: "short" /* Status of program editing          */,
  motion: "short" /* Status of axis movement,dwell      */,
  mstb: "short" /* Status of M,S,T,B function         */,
  emergency: "short" /* Status of emergency                */,
  write: "short" /* Status of writing backupped memory */,
  labelskip: "short" /* Status of label skip               */,
  alarm: "short" /* Status of alarm                    */,
  warning: "short" /* Status of warning                  */,
  battery: "short" /* Status of battery                  */,
});

koffi.struct("ODBALM", {
  dummy: "short[2]" /* Not used. */,
  data: "short" /* Alarm status */,
});

koffi.struct("ODBEXEPRG", {
  name: "char[36]" /* the program name being executed */,
  o_num: "long" /* the program number being executed */,
});

koffi.struct("ODBM", {
  datano: "short" /* custom macro variable number */,
  dummy: "short" /* (not used) */,
  mcr_val: "long" /* value of custom macro variable */,
  dec_val: "short" /* number of places of decimals */,
});

export function getFunctions(lib: IKoffiLib) {
  //prettier-ignore
  return {
    allclibhndl3: lib.func("short __stdcall cnc_allclibhndl3(const char *ipaddr, unsigned short port, long timeout, unsigned short *FlibHndl)"),
    freelibhndl:  lib.func("short __stdcall cnc_freelibhndl(unsigned short FlibHndl)"),
    statinfo:     lib.func("short __stdcall cnc_statinfo(unsigned short FlibHndl, ODBST *statinfo)"),
    alarm:        lib.func("short __stdcall cnc_alarm(unsigned short FlibHndl, ODBALM *alarm)"),
    exeprgname:   lib.func("short __stdcall cnc_exeprgname(unsigned short FlibHndl, ODBEXEPRG *exeprg)"),
    rdmacro:      lib.func("short __stdcall cnc_rdmacro(unsigned short FlibHndl, short number, short length, ODBM *macro)"),
}
}

export type FocasFunctions = ReturnType<typeof getFunctions>;
