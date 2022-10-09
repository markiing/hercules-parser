const {parseToConf, writeData} = require('../../bin/parser/JsonToConf')
const mock_json = require('./../mock/mock_json')
const fs = require('fs')

jest.mock('fs');

describe("Conf to Json Test Battery", () => {

    beforeEach(() => {
        fs.createWriteStream = jest.fn().mockReturnValue({
            write: jest.fn(),
            close: jest.fn()
        }
    )})

    describe("parseToConf Test Battery", () => {
        describe("Input/Output file validations", () => {
            it("Should validate if input file exists", () => {
                const k = () => parseToConf(null);
                expect(k).toThrow(Error)
            })
            it("Should validate if output file exists", () => {
                const k = () => parseToConf("blah.json", null);
                expect(k).toThrow(Error)
            })
    
            it("Should validate input file extension as .json",() => {
                const y = () => parseToConf("blah.aqn", "null.conf");
                expect(y).toThrow(Error)
            })
    
            it("Should validate output file extension as .conf",() => {
                const y = () => parseToConf("blah.json", "null.acsq");
                expect(y).toThrow(Error)
            })
    
            it("Should validate output file without extension",() => {
                const y = () => parseToConf("blah.json", "null");
                expect(y).toThrow(Error)
            })
    
            it("Should validate input file without extension",() => {
                const y = () => parseToConf("blah", "null.conf");
                expect(y).toThrow(Error)
            })
        })

        it("Should write header data",() => {
            parseToConf("blah.json", "file.conf", "mob")
            expect(fs.createWriteStream).toHaveBeenCalled();
            expect(fs.createWriteStream().write).toHaveBeenCalledWith("mob_db: (\n")
        })

        it("Should write footer data", () => {
            parseToConf("blah.json", "file.conf", "mob")
            expect(fs.createWriteStream().write).toHaveBeenCalledTimes(2);
            expect(fs.createWriteStream().write.mock.calls[1][0]).toBe(")\n")
        })
    })

    describe("Data Write Test Battery", () => {
        //it
    })

})