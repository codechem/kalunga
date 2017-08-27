const jsep = require('./vendor/jsep/src/jsep');

const stopChars = [" "]
const operators = ["+", "-", "*", "/", "%", "**", '(', ')']
const types = ["eur", "mkd", "usd", "gbp"]
types.forEach(type => jsep.addValueType(type));
jsep.addBinaryOp("of", 0);
jsep.addBinaryOp("to", 0);
function parse(str) {
    var parse_tree = jsep(str);    
    return parse_tree;
}

module.exports = {
    parse
}