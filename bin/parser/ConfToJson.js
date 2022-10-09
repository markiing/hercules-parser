const fs = require("fs")
const readline = require('readline')
const {convertToUTF8, deleteFileIfExists} = require('./util')
const {showInfo, showError} = require('../util/logging')
const set = require("lodash").set

const PARSE_RESULT = {
    START_PARSE: 0,
    CREATE_NEW_ENTRY: 1,
    ADD_ATOMIC_DATA_INTO_ENTRY: 2,
    ADD_OBJECT_DATA_INTO_ENTRY: 3,
    CLOSE_INTERNAL_ENTRY: 4,
    CLOSE_ENTRY: 5,
    IGNORE_LINE: 6,
}


const __handleStreamError = (error) => {
    console.log(error)
}


const getParseState = (data) => {
    if(data){
        const parts = data.split(":");
        //Read start the JSON entries
        if(data.trim().includes("//")){
            return PARSE_RESULT.IGNORE_LINE;
        }
        if(parts.length && (parts[0] === "mob_db")){
            return PARSE_RESULT.START_PARSE;
        }
        else if(data.trim() === "{" || data.trim() === "/*{"){
            //Create a new entry in array
            return PARSE_RESULT.CREATE_NEW_ENTRY;
        }else if(parts.length == 2 && (parts[parts.length -1].trim() !== "{")){
            //Should add an atomic data into array (key:value)
            return PARSE_RESULT.ADD_ATOMIC_DATA_INTO_ENTRY;
        }else if(parts.length == 2 && (parts[parts.length -1].trim() === "{")){
            //Should add an object inside object (key:value)
            return PARSE_RESULT.ADD_OBJECT_DATA_INTO_ENTRY;
        }
        else if(data.trim() === "}"){
            return PARSE_RESULT.CLOSE_INTERNAL_ENTRY
        }
        return PARSE_RESULT.CLOSE_ENTRY;
    }
}

const addAtomicData = (index, obj, data, innerkey) => {
    if(data){
        const parts = data.split(":")
        const key = parts[0].trim()
        let value = parts[1].trim()

        //Check if value is a number
        if(!isNaN(value)){
            //if value is a number, parse it into a number
            value = Number(value);
        }
        else if(isNaN(value) && value.startsWith("[")){
            //Check if starts with [ (array case), and remove double quotes
            value = value.replace("[","").replace("]","").split(",").map(x=>+x)
        } else if(isNaN(value) && (value === "false"|| value === "true")){
            value = Boolean(value)
        }   
        else{
            if(value.startsWith("\"")){
                value = value.replaceAll("\"","")
            }
        }

        if(parts.length == 2){
            if(!innerkey){
                set(obj, `[${index}][${key}]`, value)
            }else{
                set(obj, `[${index}][${innerkey}][${key}]`, value)
            }
        }
    }
}

const addObjectData = (index,obj,data) => {
    if(data) {
        const parts = data.split(":");
        const key = parts[0].trim()
        if(parts.length == 2){
            set(obj, `[${index}[${key}]`,{})
            return key;
        }
    }
}


const parse = (inputFilePath, outputFilePath) => {
    //Open  file stream
    let parseObj = []
    let index = 0;
    let innerKey = undefined;

    if(!inputFilePath) throw new Error("You need to specify the input file.")

    const readlineInterface = readline.createInterface({
        input: fs.createReadStream(inputFilePath, "latin1"),
        console: false
    })

    //readableStream.on('error',  __handleStreamError)
    readlineInterface.on('line', (data) => {
        try{
            const parseState = getParseState(data);
            if(parseState === PARSE_RESULT.CREATE_NEW_ENTRY){
                parseObj.push({})
            }else if(parseState === PARSE_RESULT.ADD_ATOMIC_DATA_INTO_ENTRY){
                addAtomicData(index, parseObj, data, innerKey);
            }else if(parseState === PARSE_RESULT.ADD_OBJECT_DATA_INTO_ENTRY){
                const objectKey = addObjectData(index, parseObj, data);
                innerKey = objectKey
            }else if(parseState == PARSE_RESULT.CLOSE_INTERNAL_ENTRY){
                innerKey = undefined;
            }else if(parseState == PARSE_RESULT.CLOSE_ENTRY){
                index++;
            }
        }catch(error){
            showError("We could not procced with parse due ",error)
        }
    })


    readlineInterface.on('close', () => {
        deleteFileIfExists(outputFilePath);
        fs.writeFile(outputFilePath, JSON.stringify(parseObj, null, '\t'), function(err) {
            if(err) {
                return console.log(err);
            }
            showInfo("The new file was generated successfully.");
        });
    })
}

module.exports = {
    parse,
    getParseState,
    addAtomicData,
    addObjectData
}
