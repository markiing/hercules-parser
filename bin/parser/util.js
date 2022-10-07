const Iconv  = require('iconv').Iconv;

const convertToUTF8 = (body, fromEncoding = 'iso-8859-1') => {
    const ic = new Iconv(fromEncoding, 'iso-8859-1')
    const buf = ic.convert(String(body))
    return buf.toString('utf-8')
}
module.exports = convertToUTF8