const ceval = require('./evaluator')

var inputs = [
    "3 + 4",
    "2 eur to mkd",
    "(2 eur to mkd) to gbp",
    "5 %",
    "10% of (5 % of 1000)",
    "5$ to eur",
    "(25 eur to mkd) to usd",
    "sum(123)",
    `
        x = 15; x + 6;
        123 + 4224;
        sum(124, 422);
    `
]

inputs = [
    "(5 % of 100 usd) + 15",
    "5% of 100"
]

const log = (what) => { 
    console.log(what);
    if (what.body) log(what.body);
    if (what.left) log(what.left);
    if (what.right) log(what.right);
}
for (input of inputs) {
    var result = ceval.parse(input);
    var eresult = ceval.evaluate(result, {});

    console.log(input, ": ", eresult);
    log(result);
    console.log("-".repeat(100))
}
