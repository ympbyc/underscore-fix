/*
 * Underscore-fix-monad
 *
 * Only what's useful in JS
 *
 * requires: JS-CLOS, underscore, underscore-fix
 */

if (typeof CLOS === "undefined") throw "JS-CLOS is missing";

(function (_) {

    /* Maybe */
    var Nothing = CLOS.define_class();
    var Just    = CLOS.define_class([], function (x) {
        return CLOS.slot_exists(x, '_monad_val');
    });
    _.Maybe = _.module(
        {},
        function nothing () {
            return CLOS.make(Nothing, {});
        },
        function just (x) {
            return CLOS.make(Just, {_monad_val: x});
        },
        function unit (x) {
            return _.Maybe.just(x);
        }
    );
    _.Maybe.bind = CLOS.define_generic();;
    CLOS.define_method(_.Maybe.bind, [Nothing, "function"], function (n, f) {
        return n;
    });
    CLOS.define_method(_.Maybe.bind, [null, "function"], function (n, f) {
        return n;
    });
    CLOS.define_method(_.Maybe.bind, [Just, "function"], function (j, f) {
        return f(j._monad_val);
    });
    _.Maybe.isNothing = CLOS.define_generic();
    CLOS.define_method(_.Maybe.isNothing, [Nothing], function () { return true; });
    CLOS.define_method(_.Maybe.isNothing, [null], function () { return true; });
    CLOS.define_method(_.Maybe.isNothing, [undefined], function () { return false; });
    _.Maybe.val = CLOS.define_generic();
    CLOS.define_method(_.Maybe.val, [Just], function (j) { return j._monad_val; });

    _.domonad = _.optarg(2, function (module, m, fns) {
        return _.foldl(fns, function (m, f) {
            return module.bind(m, f);
        }, m);
    });

}(_));
