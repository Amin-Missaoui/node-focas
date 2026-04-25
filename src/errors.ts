export enum FOCAS_ERROR_CODE {
  EW_PROTOCOL = -17,
  EW_SOCKET = -16,
  EW_NODLL = -15,
  EW_BUS = -11,
  EW_SYSTEM2 = -10,
  EW_HSSB = -9,
  EW_HANDLE = -8,
  EW_VERSION = -7,
  EW_UNEXP = -6,
  EW_SYSTEM = -5,
  EW_PARITY = -4,
  EW_MMCSYS = -3,
  EW_RESET = -2,
  EW_BUSY = -1,
  EW_OK = 0,
  EW_FUNC = 1,
  EW_LENGTH = 2,
  EW_NUMBER = 3,
  EW_ATTRIB = 4,
  EW_DATA = 5,
  EW_NOOPT = 6,
  EW_PROT = 7,
  EW_OVRFLOW = 8,
  EW_PARAM = 9,
  EW_BUFFER = 10,
  EW_PATH = 11,
  EW_MODE = 12,
  EW_REJECT = 13,
  EW_DTSRVR = 14,
  EW_ALARM = 15,
  EW_STOP = 16,
  EW_PASSWD = 17,
}

const MESSAGES: Record<FOCAS_ERROR_CODE, string> = {
  [-17]:
    "Data from Ethernet Board is incorrect.\nContact with the service section or the section in charge.",
  [-16]: "Investigate CNC power supply, Ethernet cable and I/F board.",
  [-15]:
    "There is no DLL file for each CNC series corresponding to specified node.",
  [-11]:
    "A bus error of CNC system occurred.\nContact with the service section or the section in charge.",
  [-10]:
    "A system error of CNC system occurred.\nContact with the service section or the section in charge.",
  [-9]: "Investigate the serial line or I/F board of HSSB.",
  [-8]: "Get the library handle number.",
  [-7]: "The CNC/PMC version does not match that of the library.\nReplace the library or the CNC/PMC control software.",
  [-6]: "An unanticipated error occurred.\nContact with the section in charge.",
  [-5]: "A system error of CNC occurred.\nContact with the service section or the section in charge.",
  [-4]: "A hardware error occurred.\nContact with the service section.",
  [-3]: "The drivers required for execution are not installed.",
  [-2]: "The RESET or STOP button was pressed.\nCall the termination function.",
  [-1]: "Wait until the completion of CNC processing, or retry.",
  [0]: "",
  [1]: "Specific function which must be executed beforehand has not been executed.\nOtherwise that function is not available.",
  [2]: "Check and correct the data block length or number of data.",
  [3]: "Check and correct the data number.",
  [4]: "Check and correct the data attribute.",
  [5]: "Check and correct the data.\nFor the following operations, this code indicates that the specified program cannot be found.\n\nDelete specified program\nSearch specified program\nStart uploading NC program",
  [6]: "There is no corresponding CNC option.",
  [7]: "Write operation is prohibited.",
  [8]: "CNC tape memory is overflowed.",
  [9]: "CNC parameter is set incorrectly.",
  [10]: "The buffer is empty or full.\nWait until completion of CNC processing, or retry.",
  [11]: "A path number is incorrect.",
  [12]: "The CNC mode is incorrect.\nCorrect the CNC mode.",
  [13]: "The execution at the CNC is rejected.\nCheck the condition of execution.",
  [14]: "Some errors occur at the data server.",
  [15]: "The function cannot be executed due to an alarm in CNC.\nRemove the cause of alarm.",
  [16]: "CNC status is stop or emergency.",
  [17]: "Data is protected by the CNC data protection function.",
};

export function getFocasMessage(code: FOCAS_ERROR_CODE): string {
  return MESSAGES[code] ?? `Unknown error code: ${code}`;
}

export class FocasLibError extends Error {
  constructor(code: FOCAS_ERROR_CODE) {
    super(`FOCAS ERROR (${code}): ${getFocasMessage(code)}`);
  }
}
