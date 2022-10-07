#! /usr/bin/env node
const yargs = require("yargs");
const cli = require("./cli/index")
const usage = "\nUsage: hparser -t <type> -i <input_file> -o <output_file> to parse a .conf file into JSON.";

const options = yargs  
      .usage(usage)  
      .option("i", {alias: "input", describe: "Path of input file", type: "string", demandOption: true})
      .option("o", {alias: "output", describe: "Path of output file", type: "string", demandOption: true})
      .option("toJson", {alias: "json", describe: "Convert .conf file into .json file", type: "boolean", demandOption: false})
      .option("toConf", {alias: "conf", describe: "Convert .json file into .conf file", type: "string", demandOption: false})
      .help(true)  
      .argv;

cli(options)