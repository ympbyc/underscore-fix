var se = strictEqual;
var de = deepEqual;
var nse = notStrictEqual;

module("maybe");


var x = _.Maybe.bind(
    _.Maybe.unit(5),
    function (x) {
        return _.Maybe.just(x * 2);
    });


var y = _.Maybe.bind(
    x,
    function (x) {
        return _.Maybe.nothing();
    },
    function (x) {
        return "Aghhh";
    });

test("unit, bind, just, nothing", function () {
    se(_.Maybe.bind(x, _.identity), 10, "unit, bind, just");
    nse(y, "Aghh", "nothing ignores rest of the chain");
});
