const jsep = require('./vendor/jsep/src/jsep');

const stopChars = [" "]
const operators = ["+", "-", "*", "/", "**", '(', ')']
const types = [
    {
        "id": "eur",
        "aliases": [
            "eur",
            "euro"
        ]
    },
    {
        "id": "mkd",
        "aliases": [
            "den",
            "mkd"
        ]
    },
    {
        "id": "usd",
        "aliases": [
            "usd",
            "dollars",
            "$"
        ]
    },
    {
        "id": "gbp",
        "aliases": [
            "gpb",
        ]
    },
    {
        "id": "%",
        "aliases": [
            "%",
            "percent"
        ]
    }
]
types.forEach(type => jsep.addValueType(type));
jsep.removeBinaryOp("%");
jsep.addBinaryOp("of", 0);
jsep.addBinaryOp("to", 0);
function parse(str) {
    var parse_tree = jsep(str);
    return parse_tree;
}

module.exports = {
    parse
}