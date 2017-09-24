import csv from "csvtojson";
import fs from "fs";
import loader from "csv-load-sync";
import { eventEmitter } from "../dirwatcher/DirWatcher";

export default class Importer {
  constructor() {}

  static import(path) {
    return new Promise((resolve, reject) => {
      csv({ noheader: false })
        .fromFile(path)
        .on("end_parsed", (data) => {
          return resolve(data);
        })
        .on("error", (error) => {
          return reject(error);
        });
    });
  }

  static importSync(path) {
    try {
      let file = fs.readFileSync(path);
      let [ headers, ...lines ] = file.toString().split("\n");

      headers = headers.split(",");

      return lines.map((line, index) => {
        return line.split(",").reduce((acc, field, i) => {
          return { ...acc, [headers[i]]: field };
        }, {});
      })
      .slice(0, -1);
    }
    catch(err) {
      console.log(err);
      return [];
    }
  }
}
