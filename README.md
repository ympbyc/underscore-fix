Underscore-fix
==============

2013 Minori Yamashita <ympbyc@gmail.com>

Underscoreに足りない関数を全部乗せ。

Collection
----------

### _.conj

```
{} * {} * ... -> {}
[] * [] * ... -> []
[] * a  * ... -> []
"" * "" * ... -> ""
```

それぞれのデータ型にふさわしい合成を行う.

```javascript
_.conj({a:1, b:2}, {b:3, c:4}, {d:5}); //=> {a:1, b:3, c:4, d:5} //mergeと同じ
_.conj([1,2,3], [4,5]);                //=> [1,2,3,4,5]          //concatと同じ
_.conj([1,2,3], 4, 5);                 //=> [1,2,3,4,5]          //concatと同じ
_.conj("hel", "lo", "!");              //=> "hello!"             //concatと同じ
```

Sequence
--------

SequenceはStringやargumentsやArrayなど、lengthプロパティを持ったオブジェクト.

### _.slice ###

```
[a] * Number -> [a]
[a] * Number * Number -> [a]
```

シーケンスSを取り、そのsliceメソッドを適用するか、Arrayにキャストしてからsliceメソッドを適用する.

```javascript
_.slice([1,2,3,4,5], 2); //=> [3,4,5]
_.slice("abcde", 2, 4); //=> "cd"
_.slice({length: 4, 0:1, 1:2, 2:3, 3:4}, 2,4); //=> [3, 4]
```

### _.concat ###

```
[a] * [a] -> [a]
[a] * a -> [a]
[a] * a * a -> [a]
...
```

シーケンスSを取り、そのconcatメソッドを適用するか、Arrayにキャストしてからconcatメソッドを適用する.

```javascript
_.concat([1,2,3], 4, 5 6); //=> [1,2,3,4,5,6]
_.concat([1,2,3], [4,5,6]); //=> [1,2,3,4,5,6]
```

### _.len ###

```
[a] -> Number
```

シーケンスのlengthプロパティを読み出す

```javscript
_.len([1,2,3]); //=> 3
_.len("abcde"); //=> 5
```


Array
-----

### _.join ###

```
[String] * String -> String
```

配列のjoinメソッドを呼ぶ.

```javascript
_.join(["aaa", "bbb", "ccc"], "~"); => "aaa~bbb~ccc"
```

### _.splat ###

```
[a] * Number -> [[a]]
```

配列Aを数値N個ずつに切り分ける

```javascript
_.splat([1,2,3,4,5,6,7], 2); //=> [[1,2], [3,4], [5,6], [7]]
```

Object
------

### _.merge ###

```
{} * {} -> {}
{} * {} * {} -> {}
...
```

2つ以上のオブジェクトをマージした新しいオブジェクトを返す. スロット名が衝突した場合、後ろのものが優先される.

```javascript
_.merge({a:1, b:2, c:3},
        {c:"a", d:"b", e:"f"},
        {e: 8});

//=> {a:1, b:2, c:"a", d:"b", e:8}
```

### _.mapmap ###

```
{} -> Function a -> {a}
```

_.mapは配列を返すが、これはオブジェクトを返す.

```javascript
_.mapmap({a:1, b:2, c:3}, _['+'](5)); //=> {a:6, b:7, c:8}
```

### _.json ###

```
String -> {}
{} -> String
```

文字列が与えられたらJSON.parse、それ以外ならJSON.stringifyする.

```javascript
_.json({a:1, b:[2, 3]}); //=> '{"a":1, "b":[2, 3]}'
_.json('{"a": 1, "b": [2, 3]}', {a:1, b:[2, 3]});
```

### _.assoc ###

```
{} * String * a -> {}
{} * String * a * String * b -> {}
...
```

オブジェクトにプロパティを追加する

```javascript
_.assoc({a:1, b:2}, "c", 3, "d", 4, "a", 100); //=> {a:100, b:2, c:3, d:4}
```


Function
--------

### _.apply ###

```
Function a * [] -> a
Function a * [] * {} -> a
```

関数Fと配列Vを取り、`F.apply(null, V)`する.
第三引数にコンテキストCが与えられた場合は、 `F.apply(C, V)`する.

```javascript
_.apply(function (a, b, c) { return [a,b,c]; },
        [1,2,3]); //=> [1,2,3]
```

### _.flip ###

```
(a * b -> c) -> (b * a -> c)
(a * b * c -> d) -> (b * a * c -> d)
...
```

関数の第一引数と第二引数の位置を入れ替える.

```javascript
_.flip(_['-'])(10, 5); //=> -5
```

### _.flippar ###

```
Function -> Function
Function * a -> Function
Function * a * b -> Function
...
```

flipとpartialをひとまとめにしたもの.

```javascript
var join_with_sharp = _.flippar(_.join, "#");

join_with_sharp(["aaa", "bbb", "ccc"]); //=> "aaa#bbb#ccc"
```

### _.pipe ###

```
a * (a -> b) -> b
a * (a -> b) * (b -> c) -> c
...
```

F#の`|>`, Clojureの`->>`

```javascript
_.pipe("hello, ",
       _.flippar(_['+'], "world!"),
       _.str.capitalize); //=> "Hello, world!"
```

### _.iff ###

```
(a -> Boolean) * (a -> b) * (a -> b) -> (a -> b)
```

ifの関数版. 述語関数1つと関数2つをとり、関数を返す。

```javascript
f = _.iff(_.eq(5),
          _['*'](2),
          _.partial(_.identity, -1));

f(8); //=> -1
f(5); //=> 10
```

### _.optarg ###

```
Number * Function -> Function
```

数値Nと関数Fを取り、関数Fへの引数のN+1番目以降を配列にしてFに渡す関数Gを返す。argumentsのスライシングを抽象化する。

```javascript
var f = _.optarg(2, function (a, b, cs) {
  return cs;
});

f(1, 2, 3, 4, 5, 6, 7); //=> [3, 4, 5, 6, 7]
```

### _.bin_multi ###

```
(a * a -> a) -> (a * a * a * ... -> a)
```

`a * a -> a`な二引数関数を無限に引数を取れる関数に変換する.

```javascript
var add = _.bin_multi(function (a) { return a + b; });

add(1,2,3,4,5,6,7,8,9); //=> 45
```

### _.native_absent ###

```
String * Function -> Function
```

メソッド名Mと関数Fを取って、「オブジェクトOと引数Aを取って、オブジェクトOにメソッドMが定義されていれば引数Aにそれを適用し、そうでなければ関数FにオブジェクトOと引数Aを渡す関数」を返す.

```javascript
var slice = _.native_absent("slice", function (o, start, end) {
  var arr = _.toArray(o);
  return arr.slice(start, end);
});
```

### _.auto_partial

```
Number * Function -> Function
```

引数の数が数値Nより少なかったら関数Fに部分適用する。

```javascript
_.eq = _.auto_partial(2, function (a, b) {
  return a === b;
});
_.reject([1,5,2,5,3,5], _.eq(5)); //=> [1,2,3]
```


String
------

### _.simple_template ###

```
String * {} -> String
```

eval禁止などで_.templateが使えない時や、テンプレートにロジックがない場合に使いやすいテンプレーティング関数.

```javascript
_.simple_template("quick {{ color }} {{animal}} is {{color}}",
                  {color: "brown", animal: "fox"});

//=> "quick brown fox is brown"
```

Methods
-------

### _.fn ###

```
{} * String -> Function
```

オブジェクトとメソッド名を取り、メソッドを関数にして返す.

```
var toUpper = _.fn(String.prototype, "toUpperCase");
toUpper("hello"); //=> "HELLO"
```

Operator
--------

演算子は関数合成や部分適用のときに扱い辛いので関数を提供する. 全て勝手に部分適用される。

用意されている関数:

```
_["+"], _["-"], _["*"], _["/"], _["%"],
_.and, _.or, _.not,
_.eq, _.neq, _.lt, _.gt, _.lte, _.gte,
_.at
```

```javascript
_["+"](2,3); //=> 5
_.bin_multi(_["+"])(1,2,3,4,5); //=> 15
_.map([1,2,3,4], _["*"](2)); //=> [2,4,6,8]
_.filter([1,2,0,4,1,3,1], _.lt(2)); //=> [4,3]

_.bin_multi(_.at)({a: {b: {c: "xxx"}}}, "a", "b", "c"); //=> "xxx"
```


Module
------

```
{} * Function -> {}
{} * Function * Function -> {}
...
```

モジュールを作る

```javascript
var myModule = _.module(
  {},

  function hola () {
    return "Hola!"
  },

  function hi () {
    return "Hi!"
  }
);

myModule.hola(); //=> "Hola!"

module(
  myModule,

  function hehe () { return "hehe";  }
);

myModule.hehe();
```


LOG
---

### 2013/5/20

+ 演算子のデフォルトでの多引数化はやめた。これは_.mapなどとの兼ね合い。

```javascript
//before
_["+"](1,2,3,4,5); //=> 15
_.map([1,2,3], _.partial(_['+'], 5)); //=> ["61,2,3", "81,2,3", "101,2,3"]

//now
_["+"](1,2,3,4,5); //=> 3
_.bin_multi(_['+'])(1,2,3,4,5); /=> 15
_.map([1,2,3], _.partial(_['+'], 5)); //=> [6,7,8]
```

+ 代わりに演算子はデフォルトで部分適用を可能にした。

```javascript
//before
_.partial(_['+'], 4)(5); //=> 9

//now (in addition to the old method)
_['+'](4)(5); //=> 9
_.bin_multi(_['+'])(1)(2,3,4,5); //=> 15
```
