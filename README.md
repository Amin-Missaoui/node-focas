# Node-Focas

Node.js wrapper for the [FOCAS protocol](https://www.inventcom.net/fanuc-focas-library/general/overview).
It allows for simple communication with Fanuc CNCs.
Uses [koffi](https://koffi.dev/) to load the FOCAs DLL at runtime.

> [!IMPORTANT]  
> The FOCAS DLLs are not provided.
> You must first obtain the neceesary DLLs from Fanuc or your machine distribuitor.
> When loading the `Fwlib32.dll` you will need to use the 32-bit version of node.
> All the DLLs including `Fwlib32.dll` or `Fwlib64.dll` need to be in the same directory as the main javascript program.

> [!WARNING]  
> This package is experimental and has not yet been tested in a real enviroment.
> Use in production only after thorough testing on your end.
> Future updates may break existing functionality.

## Why

At my current job i implement [MES](https://en.wikipedia.org/wiki/Manufacturing_execution_system) system for large manufacturing companies.  
A big part of my job requires interconnecting with various machines all with different protocols.  
Industry standard applications like [Ignition](https://inductiveautomation.com/) and [Kepware](https://www.ptc.com/en/products/kepware) are usually the goto but sometimes we are required to find other solutions.  
We recently started using [Node-RED](https://nodered.org/) for our automation needs and although it has been great, also thanks to vast amount of packages available for protcols like [Modbus](https://en.wikipedia.org/wiki/Modbus), [TCP/IP](https://en.wikipedia.org/wiki/TCP/IP), [Serial](https://en.wikipedia.org/wiki/Serial_port) and [OPCua](https://en.wikipedia.org/wiki/OPC_Unified_Architecture), when it comes to [FOCAS](https://www.inventcom.net/fanuc-focas-library/general/overview), we found nothing that could help. This package serves as a the underlying implementation for what could then be a Node-RED package. It is still in experimental and i welcome any suggestion

## Installation

```bash
#npm
npm install node-focas
#pnpm
pnpm add node-focas
```

## Usage

```ts
import NodeFocas from "node-focas";

const focas = new NodeFocas("./path/to/Fwlib32.dll");

//Connect to a Fanuc CNC
focas.connect("192.168.1.1", 8193, 10); //port and timeout can be ommited

console.log(focas.isConnected);

const status = focas.getStatus();
console.log(status.aut, status.manual, status.run); //Various statu flags of the CNC

const alarm = focas.getAlarm();
console.log(alarm.data); //Alarm status

const program = focas.getProgramName();
console.log(program.name, program.o_num); //Program name and number

const macro = focas.readMacro(5000);
console.log(macro.raw, macro.decimals); //raw macro value and decimals
console.log(macro.value); //macro value already processed

//Disconnect from the CNC
focas.disconnect();

//Unload the library
focas.destroy();
```
