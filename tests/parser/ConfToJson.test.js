const parse = require('../../bin/parser/ConfToJson')

describe("Conf File Test Battery", () => {
    it("Should throw an exception if input file don't exists", ()=> {
        const t = () => parse(null);
        expect(t).toThrow(Error)
    })
})