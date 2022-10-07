const {parse} = require('../parser/ConfToJson')
const {showError, showWarn} = require('../util/logging')

const processCall = (args) => {
    const inputFile = args.i;
    const outputFile = args.o;
    const format = args.f;

    if(!["json", "conf"].includes(format)){
        showError("This format is invalid, we just accept `json` and `conf`.");
        return 1;
    }

    if(format === "json"){
        parse(inputFile, outputFile)
    }else{
        showWarn("We don't have parse for this yet. Wait for future releases");
        return 1
    }

}

module.exports = processCall;