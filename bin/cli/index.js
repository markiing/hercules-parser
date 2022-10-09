const {parse} = require('../parser/ConfToJson')
const { parseToConf } = require('../parser/JsonToConf')
const {showError, showWarn} = require('../util/logging')

const processCall = (args) => {
    const inputFile = args.i;
    const outputFile = args.o;
    const format = args.f;
    const type = args.t;

    if(!["json", "conf"].includes(format)){
        showError("This format is invalid, we just accept `json` and `conf`.");
        return 1;
    }

    if(format === "json"){
        parse(inputFile, outputFile)
    }else{
        parseToConf(inputFile, outputFile, type)
        return 1
    }

}

module.exports = processCall;