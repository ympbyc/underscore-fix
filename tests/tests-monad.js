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


test("val, isNone", function () {
    se(_.Maybe.isNothing(y), true, "Nothing is Nothing");
    se(_.Maybe.isNothing(null), true, "Null is Nothing");
    se(_.Maybe.isNothing("nothing"), false, "String isnt Nothing");
    se(_.Maybe.isNothing(x), false, "Just isnt Nothing");
    se(_.Maybe.val(x), 10, "val retrieves monadic value from just");
});
