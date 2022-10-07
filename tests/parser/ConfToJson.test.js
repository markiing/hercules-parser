const {parse, getParseState, addAtomicData, addObjectData} = require('../../bin/parser/ConfToJson')
const path = require('path')

describe("Conf File Test Battery", () => {

    describe("parse Test Cases", () => {
        it("Should throw an exception if input file is null", () => {
            const t = () => parse(null);
            expect(t).toThrow(Error)
        })
    })

    describe("Parse State Battery Teste", () => {
        it("Should return START_PARSE state", () => {
            const data = "mob_db: (";
            expect(getParseState(data)).toEqual(0);
        })

        it("Should return CREATE_NEW_ENTRY state", () => {
            const data = "{";
            expect(getParseState(data)).toEqual(1);
        })

        it("Should return ADD_ATOMIC_DATA_INTO_ENTRY", () => {
            const data = "Id: 6445";
            expect(getParseState(data)).toEqual(2);
        })

        it("Should return ADD_OBJECT_DATA_INTO_ENTRY", () => {
            const data = "Stats: {";
            expect(getParseState(data)).toEqual(3);
        })

        it("Should return CLOSE_INTERNAL_ENTRY", () => {
            const data = "}";
            expect(getParseState(data)).toEqual(4);
        })

        it("Should return CLOSE_ENTRY", () => {
            const data = "},";
            expect(getParseState(data)).toEqual(5);
        })

        it("Should return IGNORE_LINE", () => {
            const data = "//Teste:{";
            expect(getParseState(data)).toEqual(6);
        })
    })

    describe("Data Modifications Battery Tests", () => {
        describe("Atomic Data Testing", () => {
            it("should should do nothing if data is empty", () => {
                let obj = [{}]
                const index = 0;
                addAtomicData(index, obj, "");
                expect(obj[0]).toEqual({});
            })
    
            it("should add integer AtomicData into object", () => {
                let obj = [{}]
                const index = 0;
                addAtomicData(index, obj, "Id: 4445");
                expect(obj[0].Id).toEqual(4445)
            })
    
            it("should add string AtomicData into object", () => {
                let obj = [{}]
                const index = 0;
                addAtomicData(index, obj, "Name: Maçã Vermelha");
                expect(obj[0].Name).toEqual("Maçã Vermelha")
            })
    
            it("should add string with parenthesis AtomicData into object", () => {
                let obj = [{}]
                const index = 0;
                addAtomicData(index, obj, "Element: (\"Ele_Fire\", 1)");
                expect(obj[0].Element).toEqual("(\"Ele_Fire\", 1)")
            })

            it("should add array AtomicData into object", () => {
                let obj = [{}]
                const index = 0;
                addAtomicData(index, obj, "Attack: [80, 135]");
                expect(obj[0].Attack).toEqual([80,135])
            })

            it("should add atomic data with innerKey data", () => {
                let obj = [{Id: 4445, Name: "Teste", State: {}}]
                const index = 0;
                addAtomicData(index, obj, "Int: 10", "State");
                expect(obj[0]).toEqual({Id: 4445, Name: "Teste", State: {Int: 10}});
            })
        })
        describe("Object Data Testing", () => {
            it("Should add an Object data inside object", () => {
                let obj = [{Id: 4445, Name: "Teste"}]
                const index = 0;
                addObjectData(index, obj, "State: {");
                expect(obj[0]).toEqual({Id: 4445, Name: "Teste", State: {}});
            })
            it("Should do nothing if data is undefinde",() => {
                let obj = [{Id: 4445, Name: "Teste"}]
                const index = 0;
                addObjectData(index, obj, undefined);
                expect(obj[0]).toEqual({Id: 4445, Name: "Teste"});
            })
            it("Should do nothing if data is empty",() => {
                let obj = [{Id: 4445, Name: "Teste"}]
                const index = 0;
                addObjectData(index, obj, "");
                expect(obj[0]).toEqual({Id: 4445, Name: "Teste"});
            })

        })

    })
})