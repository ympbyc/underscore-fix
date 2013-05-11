/*
 * additional utils
 *
 * requires: [underscore]
 */

(function (_) {

    _.optarg = function (n, f) {
        return function (/* & arguments  */) {
            var required = Array.prototype.slice.call(arguments, 0, n);
            var optional = Array.prototype.slice.call(arguments, n);
            required.push(optional);
            return _.apply(f, required);
        };
    };

    _.bin_multi = function (binary_f) {
        return _.optarg(2, function (x, y, zs) {
            return _.foldl(zs, function (acc, a) {
                return binary_f(acc, a);
            }, binary_f(x, y));
        });
    };

    /* Sequence (Array, String, arguments, ...) */

    _.slice = _.optarg(1, function (arr, args) {
        if (_.isFunction(arr.slice)) return arr.slice.apply(arr, args);
        return Array.prototype.slice.apply(arr, args);
    });

    _.concat = _.bin_multi(function (xs, ys) {
        if (_.isFunction(xs.concat)) return xs.concat(ys);
        return Array.prototype.concat.apply(xs, ys);
    });

    _.len = function (a) {
        return a.length;
    };

    /* Array  */

    _.join = function (a,b) {
        return a.join(b);
    };

    /* Object */

    _.merge = _.bin_multi(function (a, b) {
        var x = {};
        _.extend(x, a);
        _.extend(x, b);
        return x;
    });

    _.mapmap = function (map, f) {
        var res = {};
        _.each(map, function (v, k) {
            res[k] = f(v, k);
        });
        return res;
    };

    _.json = function (x) {
        if (_.isString(x)) return JSON.parse(x);
        return JSON.stringify(x);
    };

    /* Function */
    _.apply = function (f, args) {
        return f.apply(null, args);
    };

    _.flip = function (f) {
        return _.optarg(2, function (x, y, zs) {
            return _.apply(_.partial(f, y, x), zs);
        });
    };

    _.flip_partial = _.flippar = _.optarg(1, function (f, args) {
        return _.apply(_.partial, _.concat([_.flip(f)], args));
    });


    _.pipe = _.optarg(2, function (val, fn, fns) {
        if (_.isEmpty(fns)) return fn(val);
        return _.apply(_.pipe, _.concat([fn(val)], fns));
    });

    _.iff = function (cond, th, el) {
        if (cond) return th();
        return el();
    };

    /* String */
    //simple_template :: "" -> {"":""} -> ""
    _.simple_template = function (tmpl, filler) {
        return _.foldl(filler, function (tmpl, val, key) {
            return tmpl.replace(new RegExp("{{ *"+key+" *}}", "g"), val);
        }, tmpl);
    };

    /* Methods  */

    //turn a method into a function
    _.fn = function (proto, method) {
        return _.optarg(1, function (rec, args) {
            return proto[method].apply(rec, args);
        });
    };


    /* Operators */

    _["+"] = _.bin_multi(function (a, b) {
        return a + b;
    });

    _["-"] = _.bin_multi(function (a, b) {
        return a - b;
    });

    _["*"] = _.bin_multi(function (a, b) {
        return a * b;
    });

    _["/"] = _.bin_multi(function (a, b) {
        return a / b;
    });

    _["%"] = _.bin_multi(function (a, b) {
        return a % b;
    });

    _.and = _.bin_multi(function (a, b) {
        return a && b;
    });

    _.or = _.bin_multi(function (a, b) {
        return a || b;
    });

    _.not = function (a) {
        return ! a;
    };

    _.eq = _.bin_multi(function (a, b) {
        return a === b;
    });

    _.neq = _.bin_multi(function (a, b) {
        return a !== b;
    });

    _.lt = function (a, b) {
        return a < b;
    };

    _.gt = function (a, b) {
        return a > b;
    };

    _.lte = function (a, b) {
        return a <= b;
    };

    _.gte = function (a, b) {
        return a >= b;
    };

    _.at = _.bin_multi(function (a, b) {
        return a[b];
    });

}(_));
