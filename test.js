const ceval = require('./evaluator')

const inputs = [
    "3 + 4",
    "2 eur to mkd",
    "(2 eur to mkd) to gbp"
]

const log = (what) => { 
    console.log(what);
    if (what.body) log(what.body);
    if (what.left) log(what.left);
    if (what.right) log(what.right);
}
for (input of inputs) {
    var result = ceval.parse(input);

    console.log(input, ": ");
    log(result);
    console.log("-".repeat(100))
}
