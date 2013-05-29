/*
 * additional utils
 *
 * requires: [underscore]
 */

(function (_) {

    /* Make a function that receives optional arguments as an array */
    _.optarg = function (n, f) {
        if (_.isFunction(n)) {
            f = n;
            n = n.length - 1;
        }
        return function (/* & arguments  */) {
            var required = Array.prototype.slice.call(arguments, 0, n);
            var optional = Array.prototype.slice.call(arguments, n);
            required.push(optional);
            return _.apply(f, required, this);
        };
    };

    /* Turn a binary function into multi argument function */
    _.bin_multi = function (binary_f) {
        return _.auto_partial(2, _.optarg(2, function (x, y, zs) {
            return _.foldl(zs, function (acc, a) {
                return binary_f(acc, a);
            }, binary_f(x, y));
        }));
    };

    /* Return a function that calls an alternative function if the method is not defined on the object */
    _.native_absent = function (method, f) {
        return _.optarg(1, function (obj, args) {
            if (_.isFunction(obj[method]))
                return _.apply(obj[method], args, obj);
            return _.apply(_.partial(f, obj), args);
        });
    };

    /* Return a partiali-applicable function */
    _.auto_partial = function (n, f) {
        var aux = function () {
            if (arguments.length < n)
                return _.apply(_.partial, _.concat([aux], _.toArray(arguments)));
            return _.apply(f, _.toArray(arguments));
        };
        return aux;
    };

    /* Convenient way to create a functional module */
    _.module = _.optarg(1, function module (m, fns) {
        _.each(fns, function (f) {
            m[_.funname(f)] = f;
        });
        return m;
    });

    /* Collection */
    /* Collection is what implements _.each and _.conj */

    _.conj = _.bin_multi(_.native_absent("conj", function (x, y) {
        if (_.isSequence(x))
            return _.concat(x, y);
        if (_.isObject(x))
            return _.merge(x, y);
        throw "Unrecognized type given to _.conj";
    }));

    //map with no extra arguments
    _.just_map = function (coll, f) {
        return _.map(coll, function (x) {
            return f(x);
        });
    };


    /* Sequence (Array, String, arguments, ...) */

    _.isSequence = function (x) {
        return _.isNumber(x.length);
    };

    _.slice = _.native_absent("slice", function (arr, start, end) {
        var xs = _.toArray(arr);
        return xs.slice(start, end);
    });

    _.concat = _.bin_multi(_.native_absent("concat", _.optarg(1, function (xs, ys) {
        var arr = _.toArray(xs);
        return arr.concat.apply(arr, ys);
    })));


    //DEPRECATED
    _.len = _.size;

    _.join = _.native_absent("join", function (a,b) {
        return _.toArray(a).join(b);
    });


    /* Array */

    _.splat = function (xs, n) {
        var ys = [],
            i = 0, l = _.size(xs);
        for (; i < l; i += n)
            ys.push(_.slice(xs, i, i + n));
        return ys;
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

    _.assoc = _.optarg(1, function (o, kvs) {
        return _.merge(o, _.object(_.splat(kvs, 2)));
    });

    /* Function */
    _.apply = function (f, args, context) {
        return f.apply(context ? context : null, args);
    };

    _.flip = function (f) {
        return _.optarg(2, function (x, y, zs) {
            return _.apply(_.partial(f, y, x), zs, this);
        });
    };

    _.flip_partial = _.flippar = _.optarg(1, function (f, args) {
        return _.apply(_.partial, _.concat([_.flip(f)], args));
    });


    _.pipe = _.optarg(2, function (val, fn, fns) {
        if (_.isEmpty(fns)) return fn(val);
        return _.apply(_.pipe, _.concat([fn(val)], fns));
    });

    _.iff = function (pred, th, el) {
        return function (x) {
            if (pred(x)) return th(x);
            if (el) return el(x);
            return undefined;
        };
    };

    _.funname = function (f) {
        if ( ! _.isUndefined(f.name)) return f.name;
        var results = (/function\s([^(]{1,})\(/).exec(f.toString());
        return (results && results.length > 1) ? results[1].trim() : "";
    };

    /* String */
    //simple_template :: "" -> {"":""} -> ""
    _.simple_template = _.simplate = function (tmpl, filler) {
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

    _["+"] = _.auto_partial(2, function (a, b) {
        return a + b;
    });

    _["-"] = _.auto_partial(2, function (a, b) {
        return a - b;
    });

    _["*"] = _.auto_partial(2, function (a, b) {
        return a * b;
    });

    _["/"] = _.auto_partial(2, function (a, b) {
        return a / b;
    });

    _["%"] = _.auto_partial(2, function (a, b) {
        return a % b;
    });

    _.and = _.auto_partial(2, function (a, b) {
        return a && b;
    });

    _.or = _.auto_partial(2, function (a, b) {
        return a || b;
    });

    _.not = function (a) {
        return ! a;
    };

    _.eq = _.auto_partial(2, function (a, b) {
        return a === b;
    });

    _.neq = _.auto_partial(2, function (a, b) {
        return a !== b;
    });

    _.lt = _.auto_partial(2, function (a, b) {
        return a < b;
    });

    _.gt = _.auto_partial(2, function (a, b) {
        return a > b;
    });

    _.lte = _.auto_partial(2, function (a, b) {
        return a <= b;
    });

    _.gte = _.auto_partial(2, function (a, b) {
        return a >= b;
    });

    _.at = _.auto_partial(2, function (a, b) {
        return a[b];
    });


}(_));
