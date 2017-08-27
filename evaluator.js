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
jsep.addBinaryOp("=", 0);
jsep.addBinaryOp("of", 0);
jsep.addBinaryOp("to", 0);

var makeResult = function(value, valueType) {
    return {
        type: jsep.types.LITERAL,
        value: value,
        valueType
    }
}

var binops = {
	"+" : function(a, b) { return makeResult(a.value + b.value, a.valueType); },
	"-" : function(a, b) { return makeResult(a.value - b.value, a.valueType); },
	"*" : function(a, b) { return makeResult(a.value * b.value, a.valueType); },
	"/" : function(a, b) { return makeResult(a.value / b.value, a.valueType); },
    "%" : function(a, b) { return makeResult(a.value % b.value, a.valueType); },
    "of": function(a, b, env) {
        // console.log("FLOFFL", a, b);
        var vb = b.value;
        var result = null;
        
        if (a.valueType && a.valueType.id === "%") {
            result = a.value * (vb / 100.0);
        }
        result = makeResult(result, b.valueType)

        return result;
     }
};
var unops = {
	"-" : function(a) { return -a; },
	"+" : function(a) { return -a; }
};

var do_eval = function(node) {
	if(node.type === "BinaryExpression") {
		return binops[node.operator](do_eval(node.left), do_eval(node.right));
	} else if(node.type === "UnaryExpression") {
		return unops[node.operator](do_eval(node.argument));
	} else if(node.type === "Literal") {
        return node;
	}
};

function parse(str) {
    var parse_tree = jsep(str);
    return parse_tree;
}

function evaluate(ast, env) {
    var result = do_eval(ast, env);
    console.log(result);
    if (result.valueType) {
        return `${result.value} ${result.valueType.id}`
    }
    return result.value;
}

module.exports = {
    parse,
    evaluate
}