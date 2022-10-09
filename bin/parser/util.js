const Iconv  = require('iconv').Iconv;
const fs = require('fs')

const convertToUTF8 = (body, fromEncoding = 'iso-8859-1') => {
    const ic = new Iconv(fromEncoding, 'iso-8859-1')
    const buf = ic.convert(body)
    return buf.toString('utf-8')
}

const convertToISO = (body, fromEncoding = "utf-8") => {
    const ic = new Iconv(fromEncoding,  'ISO-8859-1')
    const buf = ic.convert(String(body))
    return buf.toString('latin1')
}


const deleteFileIfExists = (filepath) => {
    try {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
        }
    } catch(err) {
        console.error(err)
    }
}

module.exports = {
    convertToUTF8,
    convertToISO,
    deleteFileIfExists
}