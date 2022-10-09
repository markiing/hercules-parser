const fs = require('fs')
const {convertToISO, deleteFileIfExists} = require('./util')
const {showInfo} = require('../util/logging')

const HEADER_TYPE = {
    "mob": "mob_db: (\n",
    "item": "item_db: (\n"
}

function cleanIt(obj) {
    const cleaned = convertToISO(JSON.stringify(obj, null, 2));
    return cleaned.replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, function (match) {
        return match.replace(/"/g, "");
    }) + ",\n";
}


const writeData = (logger, data) => {
    const cleaned = cleanIt(data);
    logger.write(cleaned)
    showInfo(`Writting data [${data.Name}] into file.`)
}


const parseToConf = (inputFile, outputFile, type) => {
    //Open  file stream
    if(!inputFile) throw new Error("You need to specify the input file.");
    if(!outputFile) throw new Error("You need to specify the output file.");

    if(inputFile.split(".")[1] !== "json"){
        throw new Error("The input file needs to be a .json file.");
    }

    if(outputFile.split(".")[1] !== "conf"){
        throw new Error("The output file needs to be a .conf file.");
    }

    deleteFileIfExists(outputFile);

    const logger = fs.createWriteStream(outputFile, { flags: 'a' });   
    const header = HEADER_TYPE[type]
    logger.write(convertToISO(header))

    try{
        const rawdata = fs.readFileSync(inputFile);
        const data = JSON.parse(rawdata);
        data.forEach(data => writeData(logger, data));
    }catch(error){

    }finally{
        logger.write(")\n");
        logger.close();
    }

}


module.exports = {
    parseToConf,
    writeData
}