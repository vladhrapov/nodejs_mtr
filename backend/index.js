import path from "path";
import { User, Product } from "./models";
import { DirWatcher, Importer, eventEmitter } from "./services";
import config from "./config/appconfig";

let user = new User();
let product = new Product();

console.log(config);

let csvDataPath = path.join(__dirname, "data");

DirWatcher.watch(csvDataPath, 1000);

eventEmitter.on("dirwatcher:changed", (event) => {
  let data = Importer.importSync(path.join(csvDataPath, event));

  console.log("-----------------------------------");
  console.log("dirwatcher:changed");
  console.log("Importer.importSync data: ", data);
  console.log("-----------------------------------");
});

eventEmitter.on("dirwatcher:changed", (event) => {
  Importer.import(path.join(csvDataPath, event))
  .then(data => {
    console.log("=================================");
    console.log("dirwatcher:changed async");
    console.log("Importer.import data: ", data);
    console.log("=================================");
  },
  error => {
    console.log("Bad error: ", error);
  });
});
