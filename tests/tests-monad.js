var se = strictEqual;
var de = deepEqual;
var nse = notStrictEqual;

module("maybe");


var x = _.domonad(
    _.Maybe,
    _.Maybe.unit(5),
    function (x) {
        return _.Maybe.just(x * 2);
    });


var y = _.domonad(
    _.Maybe,
    x,
    function (x) {
        return _.Maybe.nothing();
    },
    function (x) {
        return "Aghhh";
    });

test("unit, bind, just, nothing", function () {
    se(_.Maybe.bind(x, _.identity), 10, "domonad, unit, bind, just");
    nse(y, "Aghh", "nothing ignores rest of the chain");
});
