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

var makeResult = function (value, valueType) {
    return {
        type: jsep.types.LITERAL,
        value: value,
        valueType
    }
}

const VALUE_CURRENCY = "currency";

var valueConversion = {
    "usd": {
        "eur": 0.84,
        "mkd": 51.64
    }
}

var typeBases = {
    
}
typeBases[VALUE_CURRENCY] = "usd";

var typeTypes = {
    "mkd": VALUE_CURRENCY,
    "usd": VALUE_CURRENCY,
    "eur": VALUE_CURRENCY
} // TODO: name and implement this better

function getTypeOfValue(type) {
    return typeTypes[type];
}

function getBaseOfValueType(vt) {
    var t = getTypeOfValue(vt);
    console.log(t, typeBases);
    return typeBases[t];
}

function getFactor(vtA, vtB) {
    var baseOfType = getBaseOfValueType(vtA);
    var factor = null;
    if (baseOfType == vtB) {
        factor = 1 / valueConversion[baseOfType][vtA];
    } else if (baseOfType == vtA) {
        factor = valueConversion[baseOfType][vtB];  
    } else {
        factor = valueConversion[baseOfType][vtB] * (1 / valueConversion[baseOfType][vtA]);
    }
    
    return factor;
}

var binops = {
    "+": function (a, b) { return makeResult(a.value + b.value, a.valueType); },
    "-": function (a, b) { return makeResult(a.value - b.value, a.valueType); },
    "*": function (a, b) { return makeResult(a.value * b.value, a.valueType); },
    "/": function (a, b) { return makeResult(a.value / b.value, a.valueType); },
    "%": function (a, b) { return makeResult(a.value % b.value, a.valueType); },
    "=": function (a, b, env) {
        console.log("ASSIGN ", a, b);
        a.assignedValue = b;
        // env[a.value] = b;
        jsep.addLiteral(a.value, b);
        return b;
    },
    "of": function (a, b, env) {
        // console.log("FLOFFL", a, b);
        var vb = b.value;
        var result = null;

        if (a.valueType && a.valueType.id === "%") {
            result = a.value * (vb / 100.0);
        }
        result = makeResult(result, b.valueType)

        return result;
    },
    "to": function (a, b, env) {
        var isConversion = b.type == jsep.types.VALUE_TYPE;
        var aType = a.valueType && a.valueType.id;
        var bType = b.valueType && b.valueType.id || (b.type == jsep.types.VALUE_TYPE && b.id);
        var factor = null;
        if (isConversion) {
            factor = getFactor(aType, bType);
        }
        console.log("FACTOR ", factor);
        return makeResult(a.value * factor, b);
    },
};
var unops = {
    "-": function (a) { return -a; },
    "+": function (a) { return -a; }
};

var do_eval = function (node, env) {
    if (node.type === "BinaryExpression") {
        return binops[node.operator](do_eval(node.left), do_eval(node.right), env);
    } else if (node.type === "UnaryExpression") {
        return unops[node.operator](do_eval(node.argument), env);
    } else if (node.type === jsep.types.LITERAL || node.type == jsep.types.VALUE_TYPE
        || node.type === jsep.types.VARIABLE) {
        return node;
    }

    throw new Error("Can't evaluate ", node);
};

function parse(str) {
    var parse_tree = jsep(str);
    return parse_tree;
}

function evaluate(ast, env) {
    console.log("ast ", ast);
    var result = do_eval(ast, env);
    console.log("result ", result);
    if (result.valueType) {
        return `${result.value} ${result.valueType.id}`
    }
    return result.value;
}

module.exports = {
    parse,
    evaluate
}