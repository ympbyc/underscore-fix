/*
 * additional utils
 *
 * requires: [underscore]
 */

// trim() for IE8
// via https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
if(!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g,'');
    };
}


(function (_) {

    var __ = {};

    /* Make a function that receives optional arguments as an array */
    __.optarg = function (n, f) {
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
    __.bin_multi = function (binary_f) {
        return __.auto_partial(2, __.optarg(2, function (x, y, zs) {
            return _.foldl(zs, function (acc, a) {
                return binary_f(acc, a);
            }, binary_f(x, y));
        }));
    };

    /* Return a function that calls an alternative function if the method is not defined on the object */
    __.native_absent = function (method, f) {
        return __.optarg(1, function (obj, args) {
            if (_.isFunction(obj[method]))
                return _.apply(obj[method], args, obj);
            return _.apply(_.partial(f, obj), args);
        });
    };

    /* Return a partiali-applicable function */
    __.auto_partial = function (n, f) {
        var aux = function () {
            if (arguments.length < n)
                return _.apply(_.partial, _.concat([aux], _.toArray(arguments)));
            return _.apply(f, _.toArray(arguments));
        };
        return aux;
    };

    /* Convenient way to create a functional module */
    __.module = __.optarg(1, function module (m, fns) {
        _.each(fns, function (f) {
            m[_.funname(f)] = f;
        });
        return m;
    });

    /* Collection */
    /* Collection is what implements _.each and _.conj */

    __.conj = __.bin_multi(__.native_absent("conj", function (x, y) {
        if (_.isSequence(x))
            return _.concat(x, y);
        if (_.isObject(x))
            return _.merge(x, y);
        throw "Unrecognized type given to _.conj";
    }));

    //map with no extra arguments
    __.just_map = function (coll, f) {
        return _.map(coll, function (x) {
            return f(x);
        });
    };

    //map + find + merge
    __.update_many = function (coll, f, patch, g) {
        return _.map(coll, function (x) {
            if (f(x)) return (g || _.conj)(x, patch);
            return x;
        });
    };

    /* Sequence (Array, String, arguments, ...) */

    __.isSequence = function (x) {
        return _.isNumber(x.length);
    };

    __.slice = __.native_absent("slice", function (arr, start, end) {
        var xs = _.toArray(arr);
        return xs.slice(start, end);
    });

    __.concat = __.bin_multi(__.native_absent("concat", __.optarg(1, function (xs, ys) {
        var arr = _.toArray(xs);
        return arr.concat.apply(arr, ys);
    })));


    //DEPRECATED
    __.len = _.size;

    __.join = __.native_absent("join", function (a,b) {
        return _.toArray(a).join(b);
    });


    //map + flatten
    __.flat_map = __.flatMap = function (coll, f) {
        return _.flatten(_.map(coll, f));
    };



    /* Array */

    __.splat = function (xs, n) {
        var ys = [],
            i = 0, l = _.size(xs);
        for (; i < l; i += n)
            ys.push(_.slice(xs, i, i + n));
        return ys;
    };

    /* Object */

    __.merge = __.bin_multi(function (a, b) {
        var x = _.reduce(b, function (acc, v, k) {
            acc[k] = v;
            return acc;
        }, _.clone(a));

        return x;
    });

    __.mapmap = function (map, f) {
        var res = {};
        _.each(map, function (v, k) {
            res[k] = f(v, k);
        });
        return res;
    };

    __.json = function (x) {
        if (_.isString(x)) return JSON.parse(x);
        return JSON.stringify(x);
    };

    __.assoc = __.optarg(1, function (o, kvs) {
        return _.merge(o, _.object(_.splat(kvs, 2)));
    });

    /* Function */
    __.apply = function (f, args, context) {
        return f.apply(context ? context : null, args);
    };

    __.flip = function (f) {
        return _.optarg(2, function (x, y, zs) {
            return _.apply(_.partial(f, y, x), zs, this);
        });
    };

    __.flip_partial = __.flippar = __.optarg(1, function (f, args) {
        return _.apply(_.partial, _.concat([_.flip(f)], args));
    });


    __.pipe = __.optarg(2, function (val, fn, fns) {
        if (_.isEmpty(fns)) return fn(val);
        return _.apply(_.pipe, _.concat([fn(val)], fns));
    });


    __.domonad = __.optarg(function (m, mv, fns) {
        if (_.size(fns) < 1) return m.return(mv);
        return _.apply(_.domonad, _.concat([m, m.bind(mv, _.first(fns))], _.rest(fns)));
    });


    __.iff = function (pred, th, el) {
        return function (x) {
            if (pred(x)) return th(x);
            if (el) return el(x);
            return undefined;
        };
    };

    __.funname = function (f) {
        if ( ! _.isUndefined(f.name)) return f.name;
        var results = (/function\s([^(]{1,})\(/).exec(f.toString());
        return (results && results.length > 1) ? results[1].trim() : "";
    };

    /* String */
    //simple_template :: "" -> {"":""} -> ""
    __.simple_template = __.simplate = function (tmpl, filler) {
        return _.foldl(filler, function (tmpl, val, key) {
            return tmpl.replace(new RegExp("{{ *"+key+" *}}", "g"), val);
        }, tmpl);
    };

    /* Methods  */

    //[{foo:function(){return 1}}].map(_.callMethod("foo"))
    __.callMethod = __.optarg(function (method, args) {
        return function (x) { return x[method].apply(x, args); };
    });

    //turn a method into a function
    __.fn = function (proto, method) {
        return _.optarg(1, function (rec, args) {
            return proto[method].apply(rec, args);
        });
    };


    /* Operators */

    __["+"] = __.auto_partial(2, function (a, b) {
        return a + b;
    });

    __["-"] = __.auto_partial(2, function (a, b) {
        return a - b;
    });

    __["*"] = __.auto_partial(2, function (a, b) {
        return a * b;
    });

    __["/"] = __.auto_partial(2, function (a, b) {
        return a / b;
    });

    __["%"] = __.auto_partial(2, function (a, b) {
        return a % b;
    });

    __.and = __.auto_partial(2, function (a, b) {
        return a && b;
    });

    __.or = __.auto_partial(2, function (a, b) {
        return a || b;
    });

    __.not = function (a) {
        return ! a;
    };

    __.eq = __.auto_partial(2, function (a, b) {
        return a === b;
    });

    __.neq = __.auto_partial(2, function (a, b) {
        return a !== b;
    });

    __.lt = __.auto_partial(2, function (a, b) {
        return a < b;
    });

    __.gt = __.auto_partial(2, function (a, b) {
        return a > b;
    });

    __.lte = __.auto_partial(2, function (a, b) {
        return a <= b;
    });

    __.gte = __.auto_partial(2, function (a, b) {
        return a >= b;
    });

    __.at = __.auto_partial(2, function (a, b) {
        if (_.isNull(a) || _.isUndefined(a)) return null;
        return a[b];
    });

    _.mixin(__);

}(_));
