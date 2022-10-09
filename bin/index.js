#! /usr/bin/env node
const yargs = require("yargs");
const cli = require("./cli/index")
const usage = "\nUsage: hparser -i <input_file> -o <output_file> -f <format> -t <type> to parse a .conf file into JSON.";

const options = yargs  
      .usage(usage)  
      .option("i", {alias: "input", describe: "Path of input file", type: "string", demandOption: true})
      .option("o", {alias: "output", describe: "Path of output file", type: "string", demandOption: true})
      .option("f", {alias: "format", describe: "Format of the final output file (conf|json)", type: "string", demandOption: true})
      .option("t", {alias: "type", describe: "Type of .conf file (mob|item)", type: "string", demandOption: true})
      .help(true)  
      .argv;

cli(options)