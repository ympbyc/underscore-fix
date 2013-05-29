var de = deepEqual,
    se = strictEqual;

/* collection  */
module("collection");

test("conj", function () {
    de(_.conj([1,2,3], 4, 5), [1,2,3,4,5], "array -> array");
    de(_.conj([1,2,3], [4, 5]), [1,2,3,4,5], "array -> array");
    de(_.conj("hello", ", ", "world"), "hello, world", "string -> string");
    (function () {
        de(_.conj(arguments, 4, 5), [1,2,3,4,5], "arguments -> array");
    })(1,2,3);
    de(_.conj({a:1, b:2}, {c:3, d:4}), {a:1, b:2, c:3, d:4}, "object -> object");
});

test("just_map", function () {
    de(_.just_map([{a:1}, {b:2}], _.flippar(_.conj, {x: 8})), [{a:1, x:8}, {b:2, x:8}], "this is useful when mapping a multi-arg functions");
});


/* sequence */
module("Sequence");

test("isSequence", function () {
    se(_.isSequence([1,2,3]), true, "array is sequence");
    se(_.isSequence("hello"), true, "string is sequence");
    (function () {
        se(_.isSequence(arguments), true, "arguments is sequence");
    })(1,2,3);
    se(_.isSequence({1:"a", 2:"b"}), false, "object isnt sequence");
    se(_.isSequence({length: 0}), true, "object with `length` defined is sequence");
});

test("slice", function () {
    de(_.slice([1,2,3,4,5], 0, 2), [1,2], "array lower upper");
    de(_.slice([1,2,3,4,5], 2), [3,4,5], "array lower");
    se(_.slice("abcde", 2), "cde", "string lower");
    (function () {
        de(_.slice(arguments, 1), [2,3], "arguments lower");
    })(1,2,3);
});

test("concat", function () {
    de(_.concat([1,2,3], 4, 5), [1,2,3,4,5], "array atom");
    de(_.concat([1,2,3], [4, 5]), [1,2,3,4,5], "array array");
    de(_.concat([1,2,3], [4], 5), [1,2,3,4,5], "array array atom");
    se(_.concat("aaa", "bbb"), "aaabbb", "string string");
    (function () {
        de(_.concat(arguments, 4, 5), [1,2,3,4,5], "arguments atom");
        de(_.concat(arguments, [4, 5]), [1,2,3,4,5], "arguments array");
    })(1,2,3);
});

test("len", function () {
    se(_.len([1,2,3]), 3, "array");
    se(_.len("abc"), 3, "string");
});

test("join", function () {
    se(_.join(["foo", "bar", "baz"], "**"), "foo**bar**baz", "ok");
});


/* Array  */
module("Array");

test("splat", function () {
    de(_.splat([1,2,3,4,5,6], 2), [[1,2], [3,4], [5,6]], "splat by two");
    de(_.splat([1,2,3,4,5,6, 7], 3), [[1,2,3], [4,5,6], [7]], "splat by three. one");
});

/* Object  */
module("Object");

test("merge", function () {
    de(_.merge({a:1, b:2, c:3},
               {c:"a", d:"b", e:"f"},
               {e: 8}),
       {a:1, b:2, c:"a", d:"b", e:8}, "later should replace former");
});

test("mapmap", function () {
    de(_.mapmap({a:1, b:2, c:3}, function (a) {
        return a + 5;
    }), {a:6, b:7, c:8}, "should return a map");
});

test("json", function () {
    de(JSON.parse(_.json({a:1, b:[2, 3]})), {a:1, b:[2, 3]}, "should parse");
    de(_.json('{"a": 1, "b": [2, 3]}'), {a:1, b:[2, 3]}, "should stringify");
});

test("assoc", function () {
    de(_.assoc({a: 1, b:2}, "c", 3, "d", 4), {a:1, b:2, c:3, d:4}, "associate");
});

/* Function */
module("Function");

test("apply", function () {
    _.apply(function (a,b,c) {
        se(a, 1);
        se(b, 2);
        se(c, 3);
    }, [1,2,3]);

    _.apply(function () {
        se(this.a, undefined, "context should be null");
    }, []);

    _.apply(function () {
        se(this.a, 500, "should capture context");
    }, [], {a: 500});
});

test("flip", function () {
    _.flip(function (a, b, c, d) {
        se(a, 2, "second -> first");
        se(b, 1, "first -> second");
        se(c, 3, "third -> third");
        se(d, 4, "fourth -> fourth");
    })(1,2,3,4);

    var o = {
        x: 500,
        foo: _.flip(function (a, b) {
            return this.x;
        })};

    se(o.foo(1,2), 500, "should be able to be used as methods");
});

test("flippar", function () {
    se(_.flippar(function (a, b) {
        return a - b;
    }, 2)(3), 1, "should flip and partialy apply");

    de(_.filter([1,2,0,4,1,3,1], _.flippar(_.gt, 2)), [4,3], "doublecheck");

    var o = {
        x: 500,
        foo: _.flippar(function (a, b) {
            se(a, 2, "usual");
            se(b, 1, "usual");
            se(this.x, 500, "should be able to be used as methods");
        }, 1)
    };

    o.foo(2);
});

test("pipe", function () {
 se(_.pipe(2,
           _["+"](3),
           _["*"](4)), 20, "tripple");
});

test("iff", function () {
    var f = _.iff(_.lt(2), _.identity, function () { return "noo"; });
    se(f(5), 5, "Should select true branch");
    se(f(5), 5, "Branch should receive the argument");
    se(f(1), "noo", "Should select false branch");
    se(_.iff(_.eq(5), _['*'](2))(5), 10, "Should work without false branch");
});

test("optarg", function () {
    _.optarg(2, function (a, b, cs) {
        se(a, 1, "first arg");
        se(b, 2, "second arg");
        de(cs, [3,4,5], "should capture rest arg");
    })(1,2,3,4,5);

    de(_.optarg(0, function (args) {
        return args;
    })(1,2,3), [1,2,3], "zero required args");

    var o = {
        x: 500,
        f: _.optarg(0, function (args) {
            de(args, [1,2,3], "usual");
            se(this.x, 500, "should be able to be used as methods");
        })};

    o.f(1,2,3);

    _.optarg(function (a, b, rest) {
        de(rest, [3,4,5], "Take Function#length when called with one argument");
    })(1,2,3,4,5);
});

test("bin_multi", function () {
    se(_.bin_multi(function (a, b) { return a - b;  })(10, 1, 2),
       7, "should accept many args in order");
});

test("auto_partial", function () {
    var eq = _.auto_partial(2, function (a, b) {
        return a == b;
    });
    se(_.eq(2,2), true, "full application should work");
    se(_.eq(2)(2), true, "should be partialy applied");
    se(_.eq(2)(5), false, "just checking");
});

test("funname", function () {
    se(_.funname(function hello () {}), "hello", "funname retrieves the name of a given function");
    se(_.funname(function () {}), "", "anonimous function sould result in empty string");
    se(_.funname("function    foo    () {}"), "foo", "should trim the name");
});

/* String  */
module("String");

test("simple_template", function () {
    se(_.simple_template("quick {{ color  }} {{animal}} is {{color}}",
                         {color: "brown", animal: "fox"}),
       "quick brown fox is brown", "should ignore spaces. should replace all occurance");
});

/* Methods  */
module("Method");

test("fn", function () {
    var to_upper = _.fn(String.prototype, "toUpperCase");
    se(to_upper("hello"), "HELLO", "should work");
});


/* Operator */
module("Operator");

test("operator", function () {
    notEqual(_["+"](1,2,3,4,5), 15, "should not accept many args");

    de(_.map([1,2,3,4], _['+'](2)), [3,4,5,6], "multiarg function with map might fail...");

    de(_.filter([1,2,0,4,1,3,1], _.neq(1)), [2,0,4,3], "Should automatically partialy apply");

    se(_.bin_multi(_.at)({a:{b:{c:3}}}, "a", "b", "c"), 3, "should dive deep");
});



/* Module */
module("module")

test("module", function () {
    var m = _.module(
        {},

        function myFun1 (a) {
            return a * 2;
        },

        function myFun2 () {
            return "Hola!";
        }
    );

    se(m.myFun1(5), 10, "okay");
    se(m.myFun2(), "Hola!", "Hola!");
});
