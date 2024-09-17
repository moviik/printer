const PrinterAdapter = require("./printer_adapter");
const nodePrinter = require("@thiagoelg/node-printer");
const NodePrinterError = require("lib/node_printer/node_printer_error");
const NodePrinterStatusParser = require("lib/node_printer/status_parser");
const browser = require("lib/helpers/browser");
const { set, get } = require("lodash");
const mustache = require("mustache");
const fs = require("fs");

const nodePrinterErrorCodes = NodePrinterError.codes();
const handle = {};
const relativeRenderLocation = "lib/ticket_template";

const pdfFile = `${relativeRenderLocation}/cups_temp.pdf`;

function getPdfOptionsByPrinterName(printerName, pageHeight) {
  if (printerName == "NII_2INCH") {
    return {
      path: pdfFile,
      pageRanges: "1-1",
    };
  }
  if (printerName == "NII_3INCH") {
    return {
      path: pdfFile,
      margin: { left: 34 },
      pageRanges: "1-1",
    };
  }
  if (printerName == "BIXOLON_BK3-3") {
    return {
      path: pdfFile,
      margin: { left: 34 },
      pageRanges: "1-1",
    };
  }
  if (printerName == "ms-58"){
    return {
      path: pdfFile,
      width: '48mm',
      margin: { left : 2},
      pageRanges: "1-1",
    };
  }
  if (printerName == "KP-300H"){
    return {
      path: pdfFile,
      width: '48mm',
      margin: { left : 8},
      pageRanges: "1-1",
    };
  }
}
class CupsAdapter extends PrinterAdapter {  
  static getName () {
    return 'cups'
  }

  static _resetHandle() {
    set(handle, "fileContent", "");
    set(handle, "options", {});
    set(handle, "printerName", "");
    set(handle, "printerOptions", {});
  }

  static openPrinter(printerName) {
    if (!printerName) {
      this._resetHandle()
      return nodePrinterErrorCodes.SUCCESS
    }
    const printers = nodePrinter.getPrinters();
    for (const printer of printers) {
      if (printer.name === printerName) {
        this._resetHandle();
        handle.printerName = printerName;
        handle.printerOptions = getPdfOptionsByPrinterName(printerName);
        return nodePrinterErrorCodes.SUCCESS;
      }
    }
    throw new NodePrinterError(
      "nodePrinter.getPrinters error",
      nodePrinterErrorCodes.NOT_FOUND
    );
  }

  static closePrinter() {
    handle.browser.close();
    return nodePrinterErrorCodes.SUCCESS;
  }

  static printerStatus(buffer, size, status) {
    return nodePrinterErrorCodes.SUCCESS;
  }

  static getStatusError() {
    return NodePrinterError;
  }

  static getStatusParser() {
    return NodePrinterStatusParser;
  }

  static getHandle() {
    return handle;
  }

  static freeHandle(handle) {
    this._resetHandle();
    return nodePrinterErrorCodes.SUCCESS;
  }

  static setFile(handle, filename) {
    const fileContent = fs.readFileSync(filename, { encoding: "utf8" });
    set(handle, "fileContent", fileContent);
  }

  static setParamsFile(handle, filename) {
    throw new Error("not supported");
  }

  static setTagValue(handle, tag, value) {
    set(handle, `options.${tag}.value`, value);
  }

  static async print(handle) {
    const mustacheOptions = {};
    const options = get(handle, "options");
    for (const option in options) {
      const optionObject = get(options, option);
      const optionEnabled = get(optionObject, "enabled", false);
      const optionValue = get(optionObject, "value", false);
      if (optionEnabled) {
        set(mustacheOptions, option, optionValue);
      } else {
        set(mustacheOptions, option, "");
      }
    }

    const fileContent = get(handle, "fileContent");
    const rendered = mustache.render(fileContent, mustacheOptions);
    const browserInstance = await browser();
    const page = await browserInstance.newPage();
    await page.setContent(rendered);
    const pageHeight = await page.evaluate(
      () => document.anchorOffsetTopBecausePuppeteerSucksCocks
    );

    await page.pdf({
      ...handle.printerOptions,
      height: `${pageHeight * 2.07}px`,
      //height: `${pageHeight * 1.07}px`,
      // For MS-58 printer, height is equal to pageHeight*2 -> height: `${pageHeight * 2.07}px`,
    });

    return new Promise((resolve, reject) => {
      try {
        nodePrinter.printFile({
          printer: handle.printerName,
          filename: pdfFile,
          type: "AUTO",
          error: (error) => {
            reject(
              new NodePrinterError(
                "nodePrinter.printDirect error",
                nodePrinterErrorCodes.ERROR
              )
            );
          },
          success: (jobId) => {
            page.close().then(() => {
              resolve(jobId);
            });
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static toggleTagValue(handle, tag, enable) {
    set(handle, `options.${tag}.enabled`, enable);
  }

  static getPrinterError() {
    return NodePrinterStatusParser;
  }
}

module.exports = CupsAdapter;
