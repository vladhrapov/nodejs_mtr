import fs from "fs";
import EventEmitter from "events";

export const eventEmitter = new EventEmitter();

export default class DirWatcher {
  constructor() {}

  static watch(path, delay) {
    fs.watch(path, (event, file) => {
      if(event === "change") {
        eventEmitter.emit("dirwatcher:changed", file);
      }
    });
  }
}
