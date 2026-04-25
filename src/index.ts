import koffi, { type IKoffiLib } from "koffi";
import { getFunctions, type FocasFunctions } from "./bindings.js";
import { FOCAS_ERROR_CODE, FocasLibError, getFocasMessage } from "./errors.js";
import type { Alarm, Macro, Program, Status } from "./types.js";
import { applyDecimals } from "./utils.js";

class NodeFocasError extends Error {
  constructor(message: string) {
    super(`NodeFocasError: ${message}`);
    this.name = "NodeFocasError";
  }
}

/**
 * This class wraps around functionalites of the FOCAS protocol.
 * @example
 * const focas = new NodeFocas("./path/to/Fwlib32.dll");
 * focas.connect("237.84.2.178");
 * const status = focas.getStatus();
 * const alarm = focas.getAlarm();
 * focas.disconnect();
 * focas.destroy(); //cannot be used after
 */
class NodeFocas {
  #lib: IKoffiLib;
  #functions: FocasFunctions;
  #handle: number | null = null;
  #destroyed = false;

  constructor(pathToDll: string) {
    try {
      this.#lib = koffi.load(pathToDll);
    } catch (error) {
      throw new NodeFocasError(
        `Failed to load FOCAS library at "${pathToDll}": ${error instanceof Error ? error.message : error}`,
      );
    }

    this.#functions = getFunctions(this.#lib);
  }

  get isConnected() {
    return this.#handle !== null;
  }

  /**
   *
   * @param ip - IP address of the CNC
   * @param port - Port of the CNC (8193 by default)
   * @param timeout - Connection timeout in seconds (10 by default)
   * @throws {FocasLibError | NodeFocasError}
   */
  connect(ip: string, port = 8193, timeout = 10): void {
    if (this.#destroyed)
      throw new NodeFocasError("Cannot connect to CNC after destruction");
    if (this.#handle)
      throw new NodeFocasError(`Already connected to ${ip}:${port}`);

    const ptr = [null];
    const ret = this.#functions.allclibhndl3(ip, port, timeout, ptr);

    if (ret !== FOCAS_ERROR_CODE.EW_OK) throw new FocasLibError(ret);

    this.#handle = ptr[0] as any;
  }

  /**
   * Disconnects from the CNC and releases the handle
   * @throws {FocasLibError | NodeFocasError}
   */
  disconnect(): void {
    const handle = this.#getHandle();

    const ret = this.#functions.freelibhndl(handle);

    if (ret !== FOCAS_ERROR_CODE.EW_OK) throw new FocasLibError(ret);

    this.#handle = null;
  }

  /**
   * Get the current status of the CNC
   * @returns
   * @throws {FocasLibError | NodeFocasError}
   */
  getStatus(): Status {
    const handle = this.#getHandle();

    const ptr = [null];
    const ret = this.#functions.statinfo(handle, ptr);

    if (ret !== FOCAS_ERROR_CODE.EW_OK) throw new FocasLibError(ret);

    const res = ptr[0] as any;
    return {
      aut: res.aut,
      manual: res.manual,
      run: res.run,
      edit: res.edit,
      motion: res.motion,
      mstb: res.mstb,
      emergency: res.emergency,
      write: res.write,
      labelskip: res.labelskip,
      alarm: res.alarm,
      warning: res.warning,
      battery: res.battery,
    };
  }

  /**
   * Get the current alarm status
   * @returns
   * @throws {FocasLibError | NodeFocasError}
   */
  getAlarm(): Alarm {
    const handle = this.#getHandle();

    const ptr = [null];
    const ret = this.#functions.alarm(handle, ptr);

    if (ret !== FOCAS_ERROR_CODE.EW_OK) throw new FocasLibError(ret);

    const res = ptr[0] as any;
    return {
      data: res.data,
    };
  }

  /**
   * Get the current program name and number
   * @returns
   * @throws {FocasLibError | NodeFocasError}
   */
  getProgramName(): Program {
    const handle = this.#getHandle();

    const ptr = [null];
    const ret = this.#functions.exeprgname(handle, ptr);

    if (ret !== FOCAS_ERROR_CODE.EW_OK) throw new FocasLibError(ret);

    const res = ptr[0] as any;

    return {
      name: res.name,
      number: res.o_num,
    };
  }

  /**
   *
   * @param datano - Macro number
   * @returns An object containg the raw macro value and decimals as well as the value already processed into a float
   * @throws {FocasLibError | NodeFocasError}
   * @example
   * const macro = focas.getMacro(5000);
   * console.log(macro.raw, macro.decimals); //raw macro value and decimals
   * console.log(macro.value); //macro value already processed
   */
  readMacro(datano: number): Macro {
    const handle = this.#getHandle();

    const ptr = [null];
    const ret = this.#functions.rdmacro(handle, datano, 10, ptr);

    if (ret !== FOCAS_ERROR_CODE.EW_OK) throw new FocasLibError(ret);

    const res = ptr[0] as any;

    return {
      datano,
      raw: res.mcr_val,
      decimals: res.dec_val,
      value: applyDecimals(res.mcr_val, res.dec_val),
    };
  }

  /**
   * Disconnects from the CNC if connected and unloads the library.
   * Attempting to call any method after destruction, will throw an error.
   */
  destroy() {
    if (this.#destroyed) return;
    try {
      this.disconnect();
    } catch {
    } finally {
      this.#lib?.unload();
      this.#destroyed = true;
    }
  }

  /**
   * @returns
   * @throws {NodeFocasError}
   */
  #getHandle() {
    if (this.#destroyed) throw new NodeFocasError("Already destroyed");
    if (!this.#handle) throw new NodeFocasError("Not connected");
    return this.#handle;
  }
}

export {
  NodeFocas,
  NodeFocasError,
  FOCAS_ERROR_CODE,
  FocasLibError,
  getFocasMessage,
};
export default NodeFocas;
