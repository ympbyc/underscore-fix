var de = deepEqual,
    se = strictEqual;

/* sequence */
module("Sequence");

test("slice", function () {
    de(_.slice([1,2,3,4,5], 0, 2), [1,2], "array lower upper");
    de(_.slice([1,2,3,4,5], 2), [3,4,5], "array lower");
    se(_.slice("abcde", 2), "cde", "string lower");
});

test("concat", function () {
    de(_.concat([1,2,3], 4, 5), [1,2,3,4,5], "array atom");
    de(_.concat([1,2,3], [4], 5), [1,2,3,4,5], "array array");
    se(_.concat("aaa", "bbb"), "aaabbb", "string string");
});

test("len", function () {
    se(_.len([1,2,3]), 3, "array");
    se(_.len("abc"), 3, "string");
});

/* Array  */
module("Array");

test("join", function () {
    se(_.join(["foo", "bar", "baz"], "**"), "foo**bar**baz");
});

/* Object  */
module("Object");

test("merge", function () {
    de(_.merge({a:1, b:2, c:3},
               {c:"a", d:"b", e:"f"},
               {e: 8}),
       {a:1, b:2, c:"a", d:"b", e:8});
});

test("mapmap", function () {
    de(_.mapmap({a:1, b:2, c:3}, function (a) {
        return a + 5;
    }), {a:6, b:7, c:8});
});

test("json", function () {
    de(JSON.parse(_.json({a:1, b:[2, 3]})), {a:1, b:[2, 3]});
    de(_.json('{"a": 1, "b": [2, 3]}'), {a:1, b:[2, 3]});
});

/* Function */
module("Function");

test("apply", function () {
    _.apply(function (a,b,c) {
        se(a, 1);
        se(b, 2);
        se(c, 3);
    }, [1,2,3]);
});

test("flip", function () {
    _.flip(function (a, b, c, d) {
        se(a, 2);
        se(b, 1);
        se(c, 3);
        se(d, 4);
    })(1,2,3,4);
});

test("flippar", function () {
    se(_.flippar(function (a, b) {
        return a - b;
    }, 2)(3), 1);
});

test("pipe", function () {
 se(_.pipe(2,
           _.partial(_["+"], 3),
           _.partial(_["*"], 4)), 20);
});

test("iff", function () {
    se(_.iff(true,
             _.partial(_.identity, "yes"),
             _.partial(_.identity, "no")), "yes");
    se(_.iff(false,
             _.partial(_.identity, "yes"),
             _.partial(_.identity, "no")), "no");
});

test("optarg", function () {
    _.optarg(2, function (a, b, cs) {
        se(a, 1, "first arg");
        se(b, 2, "second arg");
        de(cs, [3,4,5], "rest arg");
    })(1,2,3,4,5);
});

test("bin_multi", function () {
    se(_.bin_multi(function (a, b) { return a - b;  })(10, 1, 2),
       7);
});

/* String  */
module("String");

test("simple_template", function () {
    se(_.simple_template("quick {{ color }} {{animal}} is {{color}}",
                         {color: "brown", animal: "fox"}),
       "quick brown fox is brown");
});

/* Methods  */
module("Method");

test("fn", function () {
    var to_upper = _.fn(String.prototype, "toUpperCase");
    se(to_upper("hello"), "HELLO");
});


/* Operator */
module("Operator");

test("operator", function () {
    se(_["+"](1,2,3,4,5), 15);

    se(_.at({a:{b:{c:3}}}, "a", "b", "c"), 3);
});
