/**
 * The Ease class provides a collection of easing functions for use with tween.js.
 */
declare var Easing: Readonly<{
    Linear: Readonly<{
        None: (amount: any) => any;
        In: (amount: any) => any;
        Out: (amount: any) => any;
        InOut: (amount: any) => any;
    }>;
    Quadratic: Readonly<{
        In: (amount: any) => number;
        Out: (amount: any) => number;
        InOut: (amount: any) => number;
    }>;
    Cubic: Readonly<{
        In: (amount: any) => number;
        Out: (amount: any) => number;
        InOut: (amount: any) => number;
    }>;
    Quartic: Readonly<{
        In: (amount: any) => number;
        Out: (amount: any) => number;
        InOut: (amount: any) => number;
    }>;
    Quintic: Readonly<{
        In: (amount: any) => number;
        Out: (amount: any) => number;
        InOut: (amount: any) => number;
    }>;
    Sinusoidal: Readonly<{
        In: (amount: any) => number;
        Out: (amount: any) => number;
        InOut: (amount: any) => number;
    }>;
    Exponential: Readonly<{
        In: (amount: any) => number;
        Out: (amount: any) => number;
        InOut: (amount: any) => number;
    }>;
    Circular: Readonly<{
        In: (amount: any) => number;
        Out: (amount: any) => number;
        InOut: (amount: any) => number;
    }>;
    Elastic: Readonly<{
        In: (amount: any) => number;
        Out: (amount: any) => number;
        InOut: (amount: any) => number;
    }>;
    Back: Readonly<{
        In: (amount: any) => number;
        Out: (amount: any) => number;
        InOut: (amount: any) => number;
    }>;
    Bounce: Readonly<{
        In: (amount: any) => number;
        Out: (amount: any) => number;
        InOut: (amount: any) => number;
    }>;
    generatePow: (power: any) => {
        In: (amount: any) => number;
        Out: (amount: any) => number;
        InOut: (amount: any) => number;
    };
}>;
declare var now: () => number;
/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tween
 */
declare var Group: () => void;
/**
 *
 */
declare var Interpolation: {
    Linear: (v: any, k: any) => any;
    Bezier: (v: any, k: any) => number;
    CatmullRom: (v: any, k: any) => any;
    Utils: {
        Linear: (p0: any, p1: any, t: any) => any;
        Bernstein: (n: any, i: any) => number;
        Factorial: (n: any) => number;
        CatmullRom: (p0: any, p1: any, p2: any, p3: any, t: any) => any;
    };
};
/**
 * Utils
 */
declare var Sequence: () => void;
declare var mainGroup: any;
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */
declare var Tween: (object: any, group: any) => void;
declare var VERSION: string;
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */
declare var nextId: any;
/**
 * Controlling groups of tweens
 *
 * Using the TWEEN singleton to manage your tweens can cause issues in large apps with many components.
 * In these cases, you may want to create your own smaller groups of tweens.
 */
declare var TWEEN: any;
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
declare var getAll: any;
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
declare var removeAll: any;
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
declare var add: any;
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
declare var remove: any;
/**
 * @deprecated The global TWEEN Group will be removed in a following major
 * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
 * group.
 *
 * Old code:
 *
 * ```js
 * import * as TWEEN from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new TWEEN.Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   TWEEN.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 *
 * New code:
 *
 * ```js
 * import {Tween, Group} from '@tweenjs/tween.js'
 *
 * //...
 *
 * const tween = new Tween(obj)
 * const tween2 = new TWEEN.Tween(obj2)
 *
 * //...
 *
 * const group = new Group()
 * group.add(tween)
 * group.add(tween2)
 *
 * //...
 *
 * requestAnimationFrame(function loop(time) {
 *   group.update(time)
 *   requestAnimationFrame(loop)
 * })
 * ```
 */
declare var update: any;
declare var exports$1: {
    Easing: Readonly<{
        Linear: Readonly<{
            None: (amount: any) => any;
            In: (amount: any) => any;
            Out: (amount: any) => any;
            InOut: (amount: any) => any;
        }>;
        Quadratic: Readonly<{
            In: (amount: any) => number;
            Out: (amount: any) => number;
            InOut: (amount: any) => number;
        }>;
        Cubic: Readonly<{
            In: (amount: any) => number;
            Out: (amount: any) => number;
            InOut: (amount: any) => number;
        }>;
        Quartic: Readonly<{
            In: (amount: any) => number;
            Out: (amount: any) => number;
            InOut: (amount: any) => number;
        }>;
        Quintic: Readonly<{
            In: (amount: any) => number;
            Out: (amount: any) => number;
            InOut: (amount: any) => number;
        }>;
        Sinusoidal: Readonly<{
            In: (amount: any) => number;
            Out: (amount: any) => number;
            InOut: (amount: any) => number;
        }>;
        Exponential: Readonly<{
            In: (amount: any) => number;
            Out: (amount: any) => number;
            InOut: (amount: any) => number;
        }>;
        Circular: Readonly<{
            In: (amount: any) => number;
            Out: (amount: any) => number;
            InOut: (amount: any) => number;
        }>;
        Elastic: Readonly<{
            In: (amount: any) => number;
            Out: (amount: any) => number;
            InOut: (amount: any) => number;
        }>;
        Back: Readonly<{
            In: (amount: any) => number;
            Out: (amount: any) => number;
            InOut: (amount: any) => number;
        }>;
        Bounce: Readonly<{
            In: (amount: any) => number;
            Out: (amount: any) => number;
            InOut: (amount: any) => number;
        }>;
        generatePow: (power: any) => {
            In: (amount: any) => number;
            Out: (amount: any) => number;
            InOut: (amount: any) => number;
        };
    }>;
    Group: () => void;
    Interpolation: {
        Linear: (v: any, k: any) => any;
        Bezier: (v: any, k: any) => number;
        CatmullRom: (v: any, k: any) => any;
        Utils: {
            Linear: (p0: any, p1: any, t: any) => any;
            Bernstein: (n: any, i: any) => number;
            Factorial: (n: any) => number;
            CatmullRom: (p0: any, p1: any, p2: any, p3: any, t: any) => any;
        };
    };
    now: () => number;
    Sequence: () => void;
    nextId: any;
    Tween: (object: any, group: any) => void;
    VERSION: string;
    /**
     * @deprecated The global TWEEN Group will be removed in a following major
     * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
     * group.
     *
     * Old code:
     *
     * ```js
     * import * as TWEEN from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new TWEEN.Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   TWEEN.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     *
     * New code:
     *
     * ```js
     * import {Tween, Group} from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * const group = new Group()
     * group.add(tween)
     * group.add(tween2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   group.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     */
    getAll: any;
    /**
     * @deprecated The global TWEEN Group will be removed in a following major
     * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
     * group.
     *
     * Old code:
     *
     * ```js
     * import * as TWEEN from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new TWEEN.Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   TWEEN.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     *
     * New code:
     *
     * ```js
     * import {Tween, Group} from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * const group = new Group()
     * group.add(tween)
     * group.add(tween2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   group.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     */
    removeAll: any;
    /**
     * @deprecated The global TWEEN Group will be removed in a following major
     * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
     * group.
     *
     * Old code:
     *
     * ```js
     * import * as TWEEN from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new TWEEN.Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   TWEEN.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     *
     * New code:
     *
     * ```js
     * import {Tween, Group} from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * const group = new Group()
     * group.add(tween)
     * group.add(tween2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   group.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     */
    add: any;
    /**
     * @deprecated The global TWEEN Group will be removed in a following major
     * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
     * group.
     *
     * Old code:
     *
     * ```js
     * import * as TWEEN from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new TWEEN.Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   TWEEN.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     *
     * New code:
     *
     * ```js
     * import {Tween, Group} from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * const group = new Group()
     * group.add(tween)
     * group.add(tween2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   group.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     */
    remove: any;
    /**
     * @deprecated The global TWEEN Group will be removed in a following major
     * release. To migrate, create a `new Group()` instead of using `TWEEN` as a
     * group.
     *
     * Old code:
     *
     * ```js
     * import * as TWEEN from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new TWEEN.Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   TWEEN.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     *
     * New code:
     *
     * ```js
     * import {Tween, Group} from '@tweenjs/tween.js'
     *
     * //...
     *
     * const tween = new Tween(obj)
     * const tween2 = new TWEEN.Tween(obj2)
     *
     * //...
     *
     * const group = new Group()
     * group.add(tween)
     * group.add(tween2)
     *
     * //...
     *
     * requestAnimationFrame(function loop(time) {
     *   group.update(time)
     *   requestAnimationFrame(loop)
     * })
     * ```
     */
    update: any;
};
