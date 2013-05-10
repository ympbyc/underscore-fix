var de = deepEqual,
    se = strictEqual;

test("optarg test", function () {
    _.optarg(2, function (a, b, cs) {
        se(a, 1);
        se(b, 2);
        de(cs, [3,4,5]);
    })(1,2,3,4,5);
});

test("sequence test", function () {
    de(_.slice([1,2,3,4,5], 0, 2), [1,2]);
    de(_.slice([1,2,3,4,5], 2), [3,4,5]);
    se(_.slice("abcde", 2), "cde");

    de(_.concat([1,2,3], 4, 5), [1,2,3,4,5]);
    de(_.concat([1,2,3], [4], 5), [1,2,3,4,5]);
    se(_.concat("aaa", "bbb"), "aaabbb");

    se(_.len([1,2,3]), 3);
    se(_.len("abc"), 3);
});


test("array test", function () {
    se(_.join(["foo", "bar", "baz"], "**"), "foo**bar**baz");
});

test("object test", function () {
    de(_.merge({a:1, b:2, c:3},
               {c:"a", d:"b", e:"f"},
               {e: 8}),
       {a:1, b:2, c:"a", d:"b", e:8});

    de(_.mapmap({a:1, b:2, c:3}, function (a) {
        return a + 5;
    }), {a:6, b:7, c:8});

    de(JSON.parse(_.json({a:1, b:[2, 3]})), {a:1, b:[2, 3]});
    de(_.json('{"a": 1, "b": [2, 3]}'), {a:1, b:[2, 3]});
});

test("function test", function () {
    _.apply(function (a,b,c) {
        se(a, 1);
        se(b, 2);
        se(c, 3);
    }, [1,2,3]);

    _.flip(function (a, b, c, d) {
        se(a, 2);
        se(b, 1);
        se(c, 3);
        se(d, 4);
    })(1,2,3,4);

    se(_.flippar(function (a, b) {
        return a - b;
    }, 2)(3), 1);

    se(_.pipe(2,
              _.partial(_["+"], 3),
              _.partial(_["*"], 4)), 20);

    se(_.iff(true,
             _.partial(_.identity, "yes"),
             _.partial(_.identity, "no")), "yes");
    se(_.iff(false,
             _.partial(_.identity, "yes"),
             _.partial(_.identity, "no")), "no");
});


test("string test", function () {
    se(_.simple_template("quick {{ color }} {{animal}} is {{color}}",
                         {color: "brown", animal: "fox"}),
      "quick brown fox is brown");
});


test("methods test", function () {
    var to_upper = _.fn(String.prototype, "toUpperCase");
    se(to_upper("hello"), "HELLO");
});


test("operator test", function () {
    se(_.bin_multi(function (a, b) { return a - b;  })(10, 1, 2),
         7);

    se(_["+"](1,2,3,4,5), 15);

    se(_.at({a:{b:{c:3}}}, "a", "b", "c"), 3);
});
