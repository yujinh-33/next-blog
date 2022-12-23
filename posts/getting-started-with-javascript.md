---
title: JavaScript入门
excerpt: JavaScript is the most important programming language for web development. You probably don't know it well enough!
image: getting-started-javascript.jpg
isFeatured: false
date: "2021-10-30"
---

# this

> 作用: 让我们的代码编写更方便.
>
> js 引擎会根据函数调用方式帮助我们绑定不同的 this

### 1 this 指向

> 大多数情况下 this 出现在 _**函数**_ 中

全局函数

```javascript
// 浏览器
console.log(this); // window
console.log(window); // window

// node
console.log(this); // {}
```

函数中

```js
function foo() {
  console.log("this is: ", this);
}

// 1. 直接调用foo函数: this is: window
foo();

var obj = {foo: foo};
obj.foo(); // this is: obj

// 3. apply调用: this is: hi'
foo.apply("hi");
```

this 指向什么, 跟函数所处的位置没有关系, 和函数**调用方式**和**调用位置**有关系

### 2 绑定规则

默认绑定: **独立函数调用**`foo()`, 指向**window**

```javascript
// 案例1
function foo() {
  console.log(this);
}

function bar() {
  console.log(this);
  foo(); // window
}

function baz() {
  console.log(this);
  bar(); // window
}

baz(); // window

// 案例2
var obj = {
  foo: function () {
    console.log(this);
  },
};

var bar = obj.foo;
bar(); // window
```

隐式绑定: 通过对象调用`obj.foo()`, 指向 obj 对象

```javascript
// 案例1
function foo() {
  console.log(this);
}
var obj = {foo: foo};
obj.foo(); // obj
```

显示绑定(apply、call、bind)

- apply

  ```javascript
  function foo() {
    console.log(this.name);
  }

  var obj = {name: "hi"};

  // foo() // 两种方式的调用区别在于this绑定的不同, call和bind同理
  foo.apply(obj); // hi
  ```

- call

  ```javascript
  function foo() {
    console.log(this.name);
  }
  var obj = {name: "hi"};
  foo.call(obj); // hi
  ```

  > apply 和 call 有什么区别呢?
  >
  > ```javascript
  > function sum(num1, num2) {
  >   console.log(num1 + num2, this);
  > }
  >
  > sum.apply("apply", 20, 30);
  > sum.call("call", [20, 30]);
  > ```
  >
  > 区别在于: 参数传递形式不一样
  >
  > - call: 剩余参数
  > - apply: 将函数放在 args 数组中

- bind

  ```javascript
  function foo() {
    console.log(this);
  }
  var bar = foo.bind("hi");
  bar(); // hi
  bar(); // hi

  // ??? 相当于默认绑定和显示绑定bind冲突了, 显示绑定优先级更高
  ```

  > 通过 bind 函数调用会返回一个函数, this 绑定是我们传的值

1. new 绑定

   > JS 中的函数可以当作一个类的构造函数来使用, 也就是 new 关键字
   >
   > 使用 new 关键字来调用函数时, 会执行如下的操作:
   >
   > 1. 创建一个全新的对象;
   > 2. 这个新对象会被执行 prototype 连接;
   > 3. 这个新对象会绑定到函数调用的 this 上(this 的绑定在这个步骤完成);
   > 4. 如果函数没有返回其他对象, 表达式会返回这个新对象;

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

var p = new Person("hi", 19);
console.log(p.name, p.age); // hi 19
```

> 通过 new 关键字调用一个函数时(构造器), 这个时候 this 是在调用这个构造器时创建出来的对象
>
> this = 创建出来的对象
>
> 这个绑定过程就是 new 绑定

### 3 规则优先级

> new 绑定 > 显示绑定 > 隐式绑定 > 默认绑定

- 结论 1: 默认绑定优先级最低

- 结论 2: 显示绑定优先于隐式绑定

  ```javascript
  var obj = {
    foo: function () {
      console.log(this);
    },
  };

  // apply、call
  obj.foo.call("hi"); // string ['hi']
  obj.foo.apply("hi"); // string ['hi']

  // bind
  function foo() {
    console.log(this);
  }
  var obj = {foo: foo.bind("hi")};
  obj.foo(); // string ['hi']
  ```

- 结论 3: new 绑定的优先级高于隐式绑定

  ```javascript
  var obj = {
    foo: function () {
      console.log(this);
    },
  };
  var f = new obj.foo(); // foo {}
  ```

- 结论 4: new 绑定的优先级高于显示绑定

  > new 关键字不能和 apply/call 一起使用

  ```javascript
  // 比较new和bind
  function foo() {
    console.log(this);
  }
  var bar = foo.bind("hi");
  var baz = new bar(); // foo {}
  ```

### 4 this 规则之外

忽略显示绑定

```javascript
function foo() {
  console.log(this);
}
foo.apply(null); // window
foo.call(undefined); // window

var bar = foo.bind(null);
bar(); // window
```

间接函数引用

```javascript
var obj1 = {
  foo: function () {
    console.log(this);
  },
};
var obj2 = {};

(obj2.bar = obj1.foo)(); // 独立函数调用 ...
```

箭头函数(arrow function)

> 不绑定 _**this/arguments**_ 属性
>
> _**不能作为构造函数**_ 使用
>
> <font color="red">箭头函数不使用 this 的四种标准规则(也就是不绑定 this), 而是很具外层作用域来决定 this</font>

```javascript
var foo = () => {
  console.log(this);
};

var obj = {foo: foo};

foo(); // window
obj.foo(); // window
foo.call("hi"); // window
```

### 5 面试题

> <https://mp.weixin.qq.com/s/hYm0JgBI25grNG_2sCRlTA>

### 6 实现 apply/call/bind

==hiCall 函数实现==

```javascript
Function.prototype.hiCall = function (thisArg, ...args) {
  var fn = this;

  thisArg = thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;

  thisArg.fn = fn;

  return thisArg.fn(...args);
};

function foo(...args) {
  return args.reduce((previous, current) => {
    return previous + current;
  }, 0);
}

foo.hiCall({}, 10, 20);
```

==hiApply 函数实现==

```javascript
Function.prototype.hiApply = function (thisArg, args = []) {
  var fn = this;

  thisArg = thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;

  thisArg.fn = fn;

  return thisArg.fn(...args);
};

function foo(...args) {
  return args.reduce((previous, current) => {
    return previous + current;
  }, 0);
}

foo.hiApply({}, [10, 20]); // 不传数组时,有默认值
```

==hiBind 函数实现==

```javascript
Function.prototype.hiBind = function (thisArg, ...args1) {
  var fn = this;
  thisArg = thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;
  thisArg.fn = fn;
  return function (...args2) {
    var _args = [...args1, ...args2];
    return thisArg.fn(..._args);
  };
};

function foo(...args) {
  return args.reduce((previous, current) => {
    return previous + current;
  }, 0);
}

var bar = foo.hiBind({}, 10, 20);
bar(30, 40);
```

# ES6~ES12

### 1 ES6

##### 1.1 class 定义类

> 类(class)本质上是构造函数和原型链的 _**语法糖**_ 而已
>
> 声明类的方式: 类声明和类的表达式
>
> 类和构造函数的特性其实是一致的

```javascript
// 类的声明(常用)
class Person {}

// 类的表达式
var Animal = class {};
```

- 类的构造函数

  ```javascript
  class Person {
    constructor(name, age) {} // 类的构造方法
  }

  // 当new这个类的时候就会调用这个类的构造方法
  var p = new Person("hi", 19);
  ```

  > 一个类只能由一个构造函数

- 类的方法定义

  ```javascript
  class Person {
    constructor(name, age) {}
    sayHi() {
      console.log(name, age);
    }
  }

  var p = new Person("hi", 19);
  p.sayHi();
  ```

- 类的访问器方法

  ```javascript
  class Person {
    constructor() {
      this._address = "guangxi";
    }
    get address() {
      // ...
      return this._address;
    }
    set address(value) {
      // ...
      this._address = value;
    }
  }

  var p = new Person("hi", 19);
  p.address = "xxx";
  console.log(p.adderss);
  ```

- 类的静态方法

  ```javascript
  class Person {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }

    // 类的静态方法(类方法)
    static randomPerson() {
      return new Person();
    }
  }

  var p = Person.randomPerson();
  ```

  > 普通实例方法需要 new 才可以调用

- class 中实现继承

  ```javascript
  class Person {}

  class Student extends Person {}
  ```

  - super 关键字

    ```js
    class Person {
      constructor(name, age) {
        this.name = name;
        this.age = age;
      }

      sayHi() {
        console.log(this.name, this.age);
      }
    }

    class Student extends Person {
      constructor(name, age, sno) {
        // 子类构造器中this使用之前必须调用一下super方法
        super(name, age);
        this.sno = sno;
      }
    }
    ```

  - 重写父类方法

    ```js
    class Person {
      constructor(name, age) {
        this.name = name;
        this.age = age;
      }

      sayHi() {
        console.log(this.name, this.age);
      }

      sayIyunyu() {}
      static foo() {}
    }
    class Student extends Person {
      constructor(name, age, sno) {
        super(name, age);
        this.sno = sno;
      }
      // 子类对父类方法的重写
      sayHi() {
        /**/
      }
      // 复用父类方法的逻辑
      sayIyunyu() {
        super.sayIyunyu();
        // ...
      }
      // 重写父类静态方法和复用
      static foo() {
        super.foo();
        // ...
      }
    }

    var stu = new Student("hi", 19);
    ```

- 类继承自内置类

  ```js
  class HiArray extends Array {
    firstItem() {
      return this[0];
    }
    lastItem() {
      return this[this.length - 1];
    }
  }

  var arr = new HiArray(1, 2, 3);
  console.log(arr.firstItem()); // 1
  console.log(arr.lastItem()); // 3
  ```

- 类的混入(技巧)

  ```js
  /**
   * 为什么我们想要实现类的混入呢?
   * 因为JS中只能继承一个父类, 当我们需要实现多继承..
   */
  class Person {}

  function mixinEater(BaseClass) {
    return class extends BaseClass {
      eating() {
        console.log("eating~");
      }
    };
  }

  class Student extends Person {}

  var NewStudent = mixinEater(mixinRunner(Student));
  var ns = new NewStudent();
  ns.running();
  ns.eating();
  ```

##### 1.2 多态

> 不同的数据类型进行同一个操作, 表现出不同的行为, 就是多态的表现.

```js
function calcArea(foo) {
  console.log(foo.getArea());
}

var obj = {
  getArea: function () {
    return 1000;
  },
};

class Person {
  getArea() {
    return 100;
  }
}

var p = new Person();

calcArea(obj);
calcArea(p);
```

> 传统面向对象语言有要求:
>
> 1. 要有继承
> 2. 有重写
> 3. 有父类引用子类对象

##### 1.3 对象字面量的增强

1. 属性简写

   ```js
   var name = "hi";
   var obj = {
     name,
     name: name, // 上面是这里的简写
   };
   ```

2. 方法简写

   ```js
   var obj = {
     foo() {},
     foo: function () {}, // 上面是这里的简写, 注意不是箭头函数的简写
   };
   ```

3. 计算属性名

   ```js
   var foo = "hi";
   var obj = {
     [foo + "iyunyu"]: "hi, iyunyu",
   };
   ```

##### 1.4 解构

- 数组解构: `const [...] = // ...`

  ```js
  var names = ["hi", "iyunyu", "flower"];

  // 值有顺序
  const [hi, iyunyu, flower] = names; // 'hi', 'iyunyu', 'flower'
  // 只解构第一个
  const [hi] = names; // 'hi'
  // 只解构最后一个
  const [, , flower] = names; // 'flower'
  // 解构第一个, 剩下的放在新数组
  const [hi, ...newNames] = names; // 'hi', ['iyunyu', 'flower']
  // 默认值
  const [a, b, c, d = "hello"] = names; // 'hi', 'iyunyu', 'flower', 'hello'
  ```

- 对象解构: `const {...} = //...`

  ```js
  var obj = {
    name: "hi",
    age: 19,
    height: 1.65,
  };
  // 无关顺序
  var {name, age, height} = obj;
  // 只解构一个
  var {age} = obj;
  // 别名
  var {name: newName} = obj;
  // 别名+默认值
  var {address: newAddress = "guangxi"} = obj;

  function foo({name}) {
    console.log(name);
  }
  foo(obj);
  ```

##### 1.5 let/const

```js
let hi = "hi";
const iyunyu = {
  // ...
};
```

> 注意事项:
>
> 1. let/const 声明过的变量不可再次声明
> 2. const 声明的基本类型不可重新赋值, 引用类型可以对其中的子项重新赋值但不可以对整个引用重新赋值
> 3. 在声明之前不能访问, 初始化之前也不能访问
>
> 在执行上下文的词法环境创建出来的时候, 变量事实上已经被创建了, 只是这个变量是不能被访问

##### 1.6 块级作用域

```js
{
  let foo = "hi";
  function demo() {}
  class Person {}
}
```

> 对 let/const/function/class 声明的类型有效, 对 var 声明的类型无效
>
> if 语句/for 语句/swith 语句都是块级作用域

##### 1.7 模板字符串

```js
const name = "iyunyu";
console.log(`I am ${name}`); // I am iyunyu
```

> 可以做什么:
>
> 1. 函数调用
> 2. 表达式
> 3. 换行

##### 1.8 函数的默认参数

```js
function foo(a = 1, b = 10) {
  console.log(a, b);
}

function bar({name, age} = {name: "hi", age: 19}) {}

function baz({name = "hi", age = 19} = {}) {}
```

> 默认值只能写在最后, `function foo(a = 1, b) {} // 会报错`
>
> 函数默认值会改变`函数.length`得到的长度

##### 1.9 剩余参数

> 当函数中最后一个形参<font color="red">以...开头</font>, 函数调用时多传的参数会放在最后一个形参中, 是一个数组
>
> `function foo(name, age, ...args) {} // args为一个数组`

##### 1.10 箭头函数

> 不存在: 1. this 2.arguments 3. 显示原型

##### 1.11 展开语法

- 函数调用时

  ```js
  const arr = ["hi", "iyunyu", "flower"];
  const hi = "I an iyunyu";

  function foo(...args) {
    args.forEach((item) => console.log(item));
  }

  foo(...arr); // 展开数组
  foo(...hi); // 展开字符串
  ```

- 构造数组时

  ```js
  const arr = ["hi", "iyunyu", "flower"];
  const newArr = [...arr]; // ['hi', 'iyunyu', 'flower']
  ```

- 构建对象字面量时

  ```js
  const obj = {name: "hi", age: 19};
  const newObj = {...obj, height: 1.65};
  ```

  > 注意: 展开语法是 _**浅拷贝**_

##### 1.12 表示数值

- 十进制: `const num1 = 100`
- 二进制: const num2 = 0b100
- 八进制: const num3 = 0o100
- 十六进制: const num4 = 0x100
- 大数值: const num = 10_100_100_100_100_100_100

##### 1.13 symbol

> 用于生成一个独一无二的值

```js
const s1 = Symbol();
const s2 = Symbol("hi");

const obj = {[s1]: "iyunyu"};
obj[s2] = "flower";

const s3 = Symbol();
Object.definePropery(obj, s3, {
  // ...
});
```

> 获取方式`obj[s1]`, 不能使用.语法
>
> 遍历:
>
> ```js
> // 只能通过 getOwnPropertySymbols API的方式获取key
> const skeys = Object.getOwnPropertySymbols(obj);
> for (const sKey of SKeys) {
>   console.log(obj[s]);
> }
> ```

##### 1.14 新增数据结构

- Set(强引用)

  > 类似数组, 但是元素不可以重复
  >
  > Set 常见的属性和方法:
  >
  > 1. size 返回元素个数
  > 2. add(元素): 添加元素
  > 3. delete(元素): 删除元素
  > 4. has(元素): 判断元素存不存在
  > 5. clear(): 清空元素
  > 6. forEach((item) => {}): 遍历

  ```js
  const set = new Set();
  set.add("hi"); // 添加元素方法
  set.add("hi"); // 添加失败
  set.add({});
  set.add({}); // 添加成功

  const foo = {};
  set.add(foo);
  set.add(foo); // 添加失败

  // 数组去重
  const arr = [10, 10, 20, 20];
  // Set可以传入一个可迭代对象
  const arrSet = new Set(arr); // [10, 20]
  const newArr = [...arrSet];
  ```

- WeakSet(弱引用)

  > 和 Set 类似, 但存在区别:
  >
  > 1. WeakSet 中只能存放对象类型, 不能存放基本数据类型;
  > 2. WeakSet 对元素的引用是弱引用, 如果没有其他引用对某个对象进行引用, 那么 GC 可以对对象进行回收;
  >
  > 常见方法:
  >
  > 1. add(元素): 添加元素
  > 2. delete(元素): 删除元素
  > 3. has(元素): 判断元素是否存在

  ```js
  const weakSet = new WeakSet();
  weakSet.add("hi"); // 报错-不可以存放基本数据类型

  // 应用场景(少见)
  const personSet = new WeakSet();
  class Person {
    constructor() {
      personSet.add(this);
    }

    sayHi() {
      if (!personSet.has(this)) {
        throw new Error("不能通过非构造方法创建出来的对象调用sayHi方法");
      }

      console.log("hi", this);
    }
  }

  const p = new Person();
  p.sayHi.call({name: "hi"});
  ```

- Map(强引用)

  > 用于存取映射关系, 与对象相似, 但有区别:
  >
  > - 对象存取映射关系, key 只能是字符串和 Symbol,
  > - 而 Map 可以使用基本数据类型作为 key, 也可以对象作 key
  >
  > 常用方法:
  >
  > 1. size: 返回元素个数
  > 2. set(key, value): 添加键值对
  > 3. get(key): 获取值
  > 4. has(key): 判断是否存在
  > 5. delete(key): 删除值
  > 6. clear(): 清除
  > 7. forEach((value, key) => {}): 遍历

  ```js
  const obj1 = {hi: "hi"};
  const obj2 = {iyunyu: "hi"};

  // 方式1
  const map = new Map();
  map.set(obj1, obj2);
  console.log(map); // Map(1) { { hi: 'hi' } => { iyunyu: 'hi' } }

  const map2 = new Map([
    [obj1, "hi"],
    [obj2, "iyunyu"],
  ]);
  ```

- WeakMap(弱引用)

  > 和 Map 相似, 区别:
  >
  > - 只能使用对象作为 key
  >
  > - WeakMap 是弱引用
  >
  > 常用方法:
  >
  > 1. set(key, value): 添加键值对
  > 2. get(key): 获取值
  > 3. has(key): 判断是否存在

  ```js
  const obj = { name: 'hi' }
  const weakMap = new WeakMap()
  weakMap.set(obj, 'hi')

  // 应用场景: vue3响应式一部分逻辑 (伪代码, 不要复制)
  const weakMap = new WeakMap()
  const map = new Map()
  map.set(name, [objNameFn1, objNameFn2])
  map.set(age, [objAgeFn1, objAgeFn2])
  weakMap.set(obj, map)
  obj.name = '...' -> weakMap.get(obj) -> Map -> map
  map.get(name) -> [fn1, fn2]
  forEach((item) => item())
  ```

<font color="red">es6 其他的重要知识点**_Promise, proxy 等_** 后面单独写</font>

### 2 ES7

##### 2.1 Array Includes

> es7 之前我们判断一个数组中是否包含一个元素时, 使用 indexOf
>
> es7 之后我们可以使用 includes
>
> 它们的区别: 对 NaN 的检索, indexOf 不能正确的检索

```js
const names = ["hi", "iyunyu", "flower"];

// indexOf: 获取索引值, -1不包含
console.log(names.indexOf("hi"));

// includes(值, 索引): 如果有第二个参数, 将从对应的索引值开始检索
console.log(names.includes("hi"));
```

##### 2.2 指数(乘方)运算符

> es7 之前我们使用: Math.pow(3, 3)
>
> es7 之后可以使用: \*\*运算符

```js
const result1 = Math.pow(3, 3);
const result2 = 3 ** 3;

console.log(result1, result2);
```

### 3 ES8

##### 3.1 object values

> 获取一个对象的所有 value

```js
const obj = {name: "hi"};

// ES8之前
Object.keys(obj).forEach((item) => console.log(obj[item]));

// ES8
Object.values(obj);
Object.values(["hi", "iyunyu", "flower"]); // ['hi', 'iyunyu', 'flower']
```

##### 3.2 Object entries

> 获取一个对象的 key 和 value, 返回形式为: [[key, value], [key, value], [key, value], ...]

```js
const obj = {name: "hi", age: 19};

const objEntries = Object.entries(obj);

console.log(objEntries); // [ [ 'name', 'hi' ], [ 'age', 19 ] ]

// 使用索引做数组的第一个元素
Object.entries(["hi", "iyunyu", "flower"]); // [['0', 'hi'], ['1', 'iyunyu'], ['2','flower']]

console.log(Object.entries("hi")); // [['0', 'h'], ['1', 'i']]
```

##### 3.3 String Padding

> 字符串填充
>
> 1. padStart: 首部填充
> 2. padEnd: 尾部填充

```js
const message = "Hello World";
message.padStart(15, "-"); //----Hello World 一共长15位, 第一个参数不传默认空格
message.padEnd(15, "-"); // Hello World----

// 身份证隐藏部分案例
const ID = "450802200000000000";
const disID = ID.slice(-4).padStart(ID.length, "*");
console.log(disID);
```

##### 3.4 Trailing commas

> 结尾逗号... (我怀疑这个开发着摸鱼出的新功能)

```js
function foo(m, n) {}
foo(1, 2);

// 以前多加逗号会报错, es8之后不会...
```

##### 3.5 Object Descriptors

> 获取对象属性的所有描述符`Object.getOwnPropertyDescriptors(obj)`

##### 3.6 async/await

> promise 后讲

### 4 ES9

##### 4.1 Async iterators

> 迭代器

##### 4.2 Object spread operators

> 对象的展开运算

```js
const obj1 = {name: "hi"};
const obj2 = {...obj1};
```

##### 4.3 Promise finally

### 5 ES10

##### 5.1 flat

> 降维(flat): 会按照一个可指定的深度递归遍历数组, 并将所有元素与遍历到的组数组中的元素合并位一个新数组返回

```js
const nums = [10, 20, [2, 9], [[30, 40]], 78, [55, 88]];
const newNumsArr = nums.flat(1); // 数字: 降几维, 默认1
console.log(newNumsArr); // [ 10, 20, 2, 9, [ 30, 40 ], 78, 55, 88 ]
```

##### 5.2 flatMap

> 首先使用映射函数映射每个元素, 然后再将结果压缩成一个新数组
>
> 注意:
>
> 1. flatMap 是先进行 map 操作, 再做 flat 的操作
> 2. flatMap 中的 flat 相当于深度为 1

```js
const nums = [10, 20, 30];
nums.flatMap((item) => item * 2); // [20, 40, 60] // 这样看来和map函数没有区别

// 应用场景: 把所有单词放到数组里
const names = ["hi iyunyu", "I am iyunyu", "hi flower"];
const words = names.flatMap((item) => item.split(" "));
console.log(words);

// 过程
// map => [['hi', 'iyunyu'], ['I', 'am', 'iyunyu'], ['hi', 'flower']]
// flat => ['hi', 'iyunyu', 'I', 'am', 'iyunyu', 'hi', 'flower']
```

##### 5.3 Object formEntries

> 把 entries 格式的数据转为普通数组

```js
const info = {name: "hi", age: 19};
const entries = Object.entries(info);
console.log(entries); // [['name', 'hi'], ['age', 19]]

const formEntries = Object.fromEntries(entries);
console.log(formEntries); // { name: 'hi', age: 19 }

// 应用场景
const queryString = "name=hi&age=19";
const queryParams = new URLSearchParams(queryString);
const paramObj = Object.fromEntries(queryParams);
console.log(paramObj); // { name: 'hi', age: '19' }
```

##### 5.4 trimStart/trimEnd

> 去除首尾的空格

```js
const message = "    Hi, iyunyu    ";
console.log(message.trimStart().trimEnd());
```

##### 5.5 Symbol Description

> 获取 Symbol 的属性描述

```js
const s = Symbol("hi");
console.log(s.description);
```

##### 5.6 Optional catch binding

### 6 ES11

##### 6.1 BigInt

> 早期的 JS 中我们不能正确的表示过大的数字, 大于 MAX_SAFE_INTEGER, 可能表示不正确
>
> 注意:
>
> 1. BigInt 与数字不是一个类型
> 2. bigInt + 数字, 报错
> 3. bigInt + 10n, 才可以

```js
// ES11之前 max_safe_integer
const maxInt = Number.MAX_SAFE_INTEGER;
console.log(maxInt); // 9007199254740991
console.log(maxInt + 1); // 9007199254740992
console.log(maxInt + 2); // 9007199254740992

// ES11: 最后一位+n
const bigInt = 9007199254740992n;
const num = 100;

// console.log(bigInt + 10) // 报错
console.log(bigInt + 10n); // 9007199254741002n
console.log(bigInt + BigInt(num)); // 9007199254741092n
```

##### 6.2 Nullish Coalescing Operator

> 空值合并运算(运算符??) `const bar = foo ?? 'default'`

```js
const foo = 0;
// ES11之前
const bar = foo || "default";
console.log(bar); // default

const bar = foo ?? "default";
console.log(bar); // 0, 只有undefined和null的时候才使用右边的值
```

##### 6.3 Optional Chaining

> 可选链(?): 主要作用是让我们的代码在进行 null 和 undefined 判断时更加清晰和简洁
>
> `info.friend.girlFriend?.name`当 info.friend 中没有 girlFriend 时不会报错, 返回 undefined
>
> 在判断属性不存在之后, 语句中 ? 后面的代码就不执行了
>
> 语法: **判断一个属性是否存在, 在属性之后加 ?号**

```js
const info = {
  name: "iyunyu",
  friend: {
    name: "hi",
    // girlFriend: {
    //   name: 'iyunyu'
    // }
  },
};

console.log(info.friend.girlFriend?.name); // undefined
```

##### 6.4 Global This

> 获取某一个环境下的全局对象: 当同一份代码运行在不同的环境, 全局对象会不一样

```js
// 浏览器中
console.log(window); // window
console.log(this); // window
console.log(globalThis); // window

// node中
// console.log(window) // 报错: window is not defined
console.log(this); // {}
console.log(globalThis); // global对象
```

##### 6.5 for...in 标准化

> `const obj = { name: 'hi' }` 不同浏览器使用 for...in 遍历时可能是 key, 可能是 value. 现在规范都是 key 了

##### 6.6 Dynamic Import

> 动态导入:`import('../').then()`

##### 6.7 import allSettled

##### 6.8 import mete

### 7 ES12

##### 7.1 FinalizationRegistry

> 监听对象销毁

```js
const finalRegistry = new FinalizationRegistry((objectName) => {
  console.log(`注册对象${objectName}被销毁`);
});

let foo = {name: "hi"};

finalRegistry.register(foo, "foo");

foo = null; // GC回收时执行回调
```

##### 7.2 WeakRef

> 弱引用赋值
>
> WeakSet 和 WeakMap 可以达到弱引用的效果, 但是数据类型会改变, es12 之后出现了 weakRef
>
> 常用方法:
>
> - deref(): 获取弱引用对象中的属性`bar.deref().name`

```js
const finalRegistry = new FinalizationRegistry((objectName) => {
  console.log(`注册对象${objectName}被销毁`);
});

let foo = {name: "hi"};
let bar = new WeakRef(foo);

finalRegistry.register(foo, "foo");

foo = null; // GC回收时执行回调

// deref: 获取弱引用对象中的属性
setTimeout(() => console.log(bar.deref()?.name), 10000);
```

##### 7.3 logical assignment operators

> 逻辑赋值运算:
>
> - ||=: 逻辑或
> - &&=: 逻辑与
> - ??=: 逻辑空

```js
// ||=
let message = undefined;
message ||= "default"; // 等价于 message = message || 'default

// && 一种应用场景
const obj = {
  foo() {
    console.log("hi iyunyu");
  },
};
obj.foo && obj.foo();

// &&=
let info = {name: "hi"};
info &&= info.name; // 等价于 info = info && info.name
console.log(info);

// ??=
let fooString = "";
fooString ??= "default"; // 等价于 fooString = fooString ?? 'default'
console.log(fooString);
```

##### 7.4 Numeric Swparator

> 数字分割符: `const num = '10_000_000'`

##### 7.5 String replaceAll

> 字符串替换

```js
const foo = "hi";
const bar = foo.replaceAll("i", "h");
```

# 纯函数

> 函数式编程中有一个非常重要的概念: 纯函数, JS 符合函数式编程范式, 所以也有纯函数的概念
>
> 定义:
>
> 1. 确定的输入, 一定会产生确定的输出
> 2. 函数在执行过程中, 不能产生副作用
>
> 不是绝对要编写纯函数的

### 1 副作用的理解

> 在计算机科学中, 也引用了副作用的概念, 表示在执行一个函数时, 除了返回函数值之外, 还对调用函数缠上了附加的影响, 比如修改了全局变量, 修改参数或者改变外部的存储
>
> 副作用往往时产生 bug 的**_温床_**

### 2 数组两个函数对比

##### 2.1 slice

> 符合纯函数的要求
>
> 传入一个 start/end, 那么对于同一个数组, **都会**返回确定的值
>
> slice 函数不会修改原来的数组

```javascript
var names = ["hi", "iyunyu", "flower"];
var newName = names.slice(0, 3);

console.log(names); // [ 'hi', 'iyunyu', 'flower' ]
console.log(newName); // [ 'hi', 'iyunyu' ]
```

##### 2.2 splice

> 不符合纯函数的要求
>
> 传入一个 start/end, 那么对于同一个数组, **不会**返回确定的值

```js
var names = ["hi", "iyunyu", "flower"];
var newNames = names.splice(2);

console.log(newNames); // [ 'flower' ]
console.log(names); // [ 'hi', 'iyunyu' ] // 改变了原来的数组
```

### 3 案例

> add 函数不是一个纯函数

```js
let foo = 5;
function add(num) {
  return foo + num;
}

console.log(add(5));
foo = 10;
console.log(add(5));
```

> printInfo 函数, 严格意义上说不是一个纯函数, 因为有格外输出, 但一般来说是一个纯函数, 因为没有产生副作用, 相同的输入执行结果都是一样的

```js
function printInfo(info) {
  console.log(info.name, info.age);
}
```

### 5 纯函数优势

1. 安心编写和安心使用
2. 写的时候不需要关心传入的内容是如何获得的或者依赖其他的外部变量是否发生了修改
3. 用的时候确定输入内容不会被修改, 并且自己确定的输入, 一定会有确定的输出

# 柯里化函数

> 柯里化是函数式编程里面一个非常重要的概念
>
> 1. 只传递给函数一部分参数来调用它, 让它返回一个函数去处理剩余的参数
> 2. 这个过程就称为柯里化
>
> 函数转为柯里化函数之后, 执行性能会低一点, 但是柯里化有自己的优势
>
> 作用: 一个函数处理的问题尽可能单一(单一职责原则)

### 1 结构

- 函数声明式

  ```js
  function add(x) {
    return function (y) {
      return function (z) {
        return x + y + z;
      };
    };
  }

  var result = add(1)(2)(3);
  console.log(result);
  ```

- 函数表达式

  ```js
  var sum = (x) => (y) => (z) => x + y + z;
  var result = sum(1)(2)(3);
  console.log(result);
  ```

### 2 案例

> 第一个参数+2, 第二个参数\*2, 第三个参数\*\*2, 再相加返回

```js
// 没有柯里化
function add(x, y, z) {
  x = x + 2; // 100行代码逻辑
  y = y * 2; // 100行代码逻辑
  z = z ** 2; // 100行代码逻辑
  return x + y + z;
}

// 柯里化
function sum(x) {
  x = x + 2; // 100行代码逻辑
  return function (y) {
    y = y * 2; // 100行代码逻辑
    return function (z) {
      z = z ** 2; // 100行代码逻辑
      return x + y + z;
    };
  };
}

console.log(add(1, 2, 3));
console.log(sum(1)(2)(3));
```

### 3 优势

1. 函数功能单一

2. 逻辑复用

   ```js
   function makeAdder(count) {
     // 100行代码逻辑
     return function (num) {
       return count + num;
     };
   }

   var add5 = makeAdder(5);
   console.log(add(10)); // 15
   console.log(add(20)); // 25
   console.log(add(30)); // 35
   ```

### 4 实现

> 小案例: 定义一个函数, 使它接收的函数自动转化为柯里化

```js
// 自动柯里化函数
function hiCurrying(fn) {
  return function curried(...args1) {
    if (args1.length >= fn.length) {
      return fn.apply(this, args1);
    } else {
      return function (...args2) {
        // 疑点: 不加return会报错 => sumCurrying(...)(...) is not a function
        return curried.apply(this, [...args1, ...args2]);
      };
    }
  };
}

function sum(x, y, z) {
  console.log(x + y + z);
}

var sumCurrying = hiCurrying(sum);
sumCurrying(10)(20)(30);
sumCurrying(10, 20)(30);
sumCurrying(10)(20)(30);
```

# 组合函数

> 将多个函数组合起来, 自动依次调用, 这就是组合函数

通用的组合函数实现

```js
function hiCompose(...fns) {
  fns.forEach((fn) => {
    if (typeof fn !== "function") {
      throw new TypeError("期望类型为函数类型");
    }
  });

  return function (...args) {
    let result = args;
    fns.forEach((fn) => {
      result = fn.call(this, result);
    });

    return result;
  };
}

function m(count) {
  return count * 2;
}

function n(count) {
  return count ** 2;
}

const compose = hiCompose(m, n);
console.log(compose(10));
```

# with、eval、严格模式

### 1 with

> with 有自己的作用域, 是传入的对象(不建议使用)

```js
const name: 'iyunyu'
const obj = { name: 'hi' }

function foo() {
  with(obj) {
    console.log(name) // hi
  }
}
```

### 2 eval

> 将传入的字符串当成 JS 代码执行(开发中不推荐使用)

```js
var string = 'var message = "hi, iyunyu"; console.log(message);';
eval(string);
```

### 3 严格模式

> 'use strict'

# 面向对象

面向对象是现实的抽象方式

对象可以将多个相关联的数据封装到一起, 更好的描述一个事物. 用对象来描述事物, 更有利于我们将现实的事物, 抽离成代码中某一个数据结构

面向对象编程: 创建一个类, 根据类创建对象

JavaScript 的面向对象:

JavaScript 其实支持多种编程范式, 包括函数时编程和面向对象编程:

JS 中的对象被设计成一组属性的无序集合, 像是一个哈希表, 有 key 和 value 组成

key 是一个标识符名称, value 可以是任意类型, 也可以是其他对象或者函数类型

如果值是一个函数, 那么我们可以称之为是对象的方法

### 1 创建对象方式

通过 new Object() 创建

```js
const info = new Object();
info.name = "hi";
info.age = 19;
// ...
```

字面量创建

```js
const info = {
  name: "hi",
  age: 19,
  sayHi: function () {
    // ...
  },
};
```

### 2 对对象属性的操作

获取属性

```js
const obj = {name: "hi"};
console.log(obj.name);
```

修改属性

```js
const obj = {name: "hi"};
obj.name = "iyunyu";
```

删除属性

```js
const obj = {name: "hi"};
delete obj.name;
```

### 3 属性描述符

> 前面我们的属性都是直接定义再对象内部的, 或者直接添加到对象内部的, 这样做的时候我们就不能对这个属性进行一些限制
>
> 如果我们想要对一个属性进行比较精准的操作控制, 那么我们可以使用属性描述符

Object.defineProperty()

> 会在一个对象上定义一个新属性, 或者修改一个对象的吸纳有属性, 并返回此对象
>
> `Object.defineProperty(obj, prop, descriptor)`
>
> 返回值: 被传递给函数的对象

```js
const obj = {name: "hi", age: 19};

// 属性描述符是一个对象
Object.defineProperty(obj, "height", {
  value: 1.65,
});

console.log(obj); // { name: 'hi', age: 19 } => why? 有的, 不过不可枚举

console.log(obj.height); // 1.65
```

Object.defineProperties()

```js
var obj = {_age: 19};

Object.defineProperties(obj, {
  name: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: "hi",
  },
  age: {
    configurable: false,
    enumerable: false,
    get() {
      return this._age;
    },
    set(value) {
      this._age = value;
    },
  },
});
```

### 5 属性描述符分类

- 数据属性描述符
- 存取属性(访问器)描述符

| 数据属性描述符 | 作用                                             | 默认值    | 存取属性描述符 | 作用                                             | 默认值    |
| :------------- | :----------------------------------------------- | :-------- | :------------- | :----------------------------------------------- | :-------- |
| configurable   | 是否可以 delete 属性, 是否可以重新定义属性描述符 | false     | configurable   | 是否可以 delete 属性, 是否可以重新定义属性描述符 | false     |
| enumerable     | 是否可枚举                                       | false     | enumerable     | 是否可以枚举                                     | false     |
| writeable      | 是否可以修改                                     | false     | get            | 获取属性时会执行的函数                           | undefined |
| value          | 属性的 value 值                                  | undefined | set            | 设置属性时会执行的函数                           | undefined |

```js
// 案例1.数据属性描述符
var info = {name: "hi", age: 19};
Object.defineProperty(info, "height", {
  value: 1.65,
  configurable: false,
  enumerable: false,
  writable: false,
});

// 案例2.存取属性描述符
Object.defineProperty(info, "address", {
  configurable: false,
  enumerable: true,
  get() {
    return this.address;
  },
  set(value) {
    this.address = value;
  },
});
```

### 6 对象方法的补充

- 获取对象属性描述符
  - Object.getOwnPropertyDescriptor(obj, 'name')
  - Object.getOwnPropertyDescriptors(obj)
- 禁止对象继续添加新的属性
  - Object.preventExtensions(obj)
- 禁止对象配置/删除里面的属性
  - Object.seal(obj)
- 让属性不可以修改
  - Object.freeze(obj)

# 创建对象方案

创建同一个系列, 属性值不同的多个对象

### 1 工厂模式

```js
// 工厂函数
function createPerson(name, age) {
  var person = {};
  person.name = name;
  person.age = age;
  person.sayHi = function () {
    console.log(`hi, ${this.name}`);
  };

  return person;
}

var p1 = createPerson("hi", 19);
var p2 = createPerson("iyunyu", 19);
var p3 = createPerson("flower", 19);

p1.sayHi(); // hi, hi
```

> 缺点:
>
> 1. 没有对应的类型(createPerson), 获取不到对象最真实的类型
>
> 2. ...

### 2 构造函数

> 称之为构造器(constructor), 通常是我们在创建对象时会调用的函数
>
> 构造函数也是一个普通的函数, 从表现形式来说, 和千千万万个普通的函数没有任何区别
>
> 如果这个**一个函数使用 new 来调用, 那么它就是一个构造函数, 也可以称之为类**

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.sayHi = function () {
    console.log(`hi, ${this.name}`);
  };
}

var p1 = new Person("hi", 19);
var p2 = new Person("iyunyu", 19);
console.log(p1); // person {}
p2.sayHi(); // hi, iyunyu
```

当我们通过 new 调用一个函数时, 和普通的调用有什么区别? 它会执行如下操作

1. 在内存中创建一个新的对象(空对象)
2. 这个**对象内部的[[prototype]]属性会被赋值为该构造函数的 prototype 属性**
3. 构造函数内部的 this, 会指向创建出来的新对象
4. **执行函数的内部代码(函数体代码)**
5. 如果构造函数没有返回非空对象, 则返回创建出来的新对象

相较于**工厂函数**, 类型更加明确, 我们也可以使用`p.__proto__.constructor.name`拿到类型(构造函数)名.

> 在开发中, 我们使用**_首字母大写_**来区分普通函数和构造函数`function Person() {}`

构造函数方式还是有缺点的: **_创建出来的对象的方法重复创建_**

### 3 原型和构造函数结合

> 创建对象的最终方案(不是继承最终方案)

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
// 属性不可以往原型上写, 因为写了属性之后创建出来的对象属性都会在prototype中找
// 方法是可以的, 这也是我们解决问题: 创建出来的对象的方法重复创建
Person.prototype.sayHi = function () {
  console.log(`hi, ${this.name}`); // this和函数调用位置有关, 这里不会有问题
};

var p1 = new Person("hi", 19);
var p2 = new Person("iyunyu", 19);
```

# 原型

### 1 对象原型

> JavaScript 当中**_每个对象都有一个特殊的内置属性[[prototype]]_**, 这个属性称之为对象的原型(隐式原型),

为什么称为隐式原型呢?

1. 看不到
2. 不会被手动修改
3. 不会被使用

这个隐式原型有什么作用呢?

- 当我们从一个对象中获取某一个属性时, 它会触发[[get]]操作

  - 在当前对象中去查找对应的属性, **如果找到**就直接使用

  - 如果**没有找到**, 那么就会沿着它的**原型链**去查找[[prototype]]

    ```js
    var info = {__proto__: {name: "hi"}};
    console.log(info.name); // hi
    ```

早期的 ECMA 没有规范如何去查看[[prototype]], 浏览器给我们提供了一个属性是我们开发时可以查看这个原型对象:

```js
var info = {};
console.log(info.__proto__); // [Object: null prototype] {}
```

ES5 之后, ECMA 给我们提供了一个规范`Object.getPrototypeOf(obj)`:

```js
var info = {};
console.log(Object.getPrototypeOf(info)); // {}
```

### 2 函数原型

> 函数也是一个对象, 只不过是一个特殊的对象

函数作为一个对象, 它也有一个隐式原型: **\_\_proto\_\_**属性:

```js
function foo() {}
console.log(foo.__proto__); // {}
```

函数因为是函数, 所以它还有一个显示原型: **prototype**属性:

```js
function foo() {}
console.log(foo.prototype); // {}
```

这个隐式原型有什么作用呢?

- **当 new 创建对象时会把这个函数的 prototype 属性赋值给创建对象的\_\_proto\_\_属性**

```js
function Foo() {}
var f1 = new Foo();
var f2 = new Foo();
console.log(f1.__proto__ === f2.__proto__); // true
```

堆内存中是怎么表现的呢?

![new后prototype](https://gitee.com/ipinga/hi-img/raw/master/img/new-prototype.jpg)

##### 2.1 函数原型上的属性

> Person 函数原型上有一个 constructor 属性, 保存着 Person 本身
>
> **constructor**属性: 保存着**构造函数引用**
>
> 小扩展: 想获取构造函数名字`Person.prototype.constructor.name`

##### 2.2 修改原型上的属性

方式 1

```js
function foo() {}
// 原型上原有的基础上添加
foo.prototype.name = "hi";
foo.prototype.age = 19;
foo.prototype.height = 1.65;
foo.prototype.address = "guangxi";
// ...
// 重复代码太多
```

方式 2

```js
function foo() {}
// foo.prototype = {} // 原有的属性(constructor)没有了

// 我们可以这样
foo.prototype = {
  // 属性or方法
};
Object.defineProperty(foo.prototype, "constructor", {
  configurable: true,
  enumerable: false,
  writable: true,
  value: foo,
});
```

# 原型链

> 我们知道, 从一个对象上获取属性, 如果在当前对象中没有获取到就会去它的原型上面获取
>
> \_\_proto\_\_引用形成的链条就是原型链

### 1 顶层原型

> 每个对象都有隐式原型(\_\_proto\_\_), 按道理来讲当我们查找属性时会一直查找下去
>
> 其实每一个对象都有一个顶层原型: `[Object: null prototype]: {}`

```js
var obj = {};
console.log(obj.__proto__); // [Object: null prototype]: {} => 顶层原型
```

为什么`var obj = {}`的顶层原型时 Object 对象呢?

```js
// var obj = {}
// 本质上是:
var obj new Object()
```

我们代码中 new Object()时会做一下操作:

1. 在内存中创建一个对象
2. 将这个对象赋值给 this
3. 将 Object 的显示原型赋值给这个对象的隐式原型(\_\_proto\_\_), 也就是说我们创建的对象

### 2 堆内存表现

那么我们 new 出一个对象时, 堆内存中是怎样的?

![](https://gitee.com/ipinga/hi-img/raw/master/img/ObjectPrototype.jpg)

### 3 它的特殊

那么我们可能会问: [Object: null prototype]: {} 有上面特殊?

1. 该对象有原型属性, 倒是它的原型属性已经指向的是 null 了
2. 该对象上有很多默认的属性和方法

### 4 对象-函数-原型的关系

![](https://gitee.com/ipinga/hi-img/raw/master/img/对象-函数-原型.jpg)

# 继承

> **传统**面向对象的三大特性: 封装、继承、多态
>
> - 封装: 将属性和方法封装到一个类中, 可以称之为封装的过程
> - 继承: 继承是面向对象中非常重要的, 不仅仅可以减少重复代码的数量, 也是多态的前提
> - 多态: 不同的对象在执行时表现出不同的形态
>
> 继承可以帮助我们将重复的代码和逻辑抽取到父类中, 子类只需要直接继承过来使用即可

### 1 原型链实现方案

- 代码

```js
// 父类: 公共属性和方法
function Person() {
  this.name = "iyunyu";
}

Person.prototype.sayHi = function () {
  console.log(`hi, ${this.name}`);
};

// 子类: 特有属性和方法
function Student() {
  this.sno = 111;
}

Student.prototype = new Person();

Student.prototype.hello = function () {
  console.log(`hi, ${this.name}`);
};

var str = new Student();
```

- 内存中表现:

![](https://gitee.com/ipinga/hi-img/raw/master/img/entends.jpg)

原型链实现继承的弊端:

1. 打印 stu 对象, 某些属性看不到`console.log(stu) // Person { sno: 111 }`, 正常实现继承, 继承过来的属性不能枚举.

2. 创建多个 Student 对象继承自 Person 对象, 其中的引用属性是同一个!!!

   ```js
   function Person() {
     this.name = "iyunyu";
     this.friends = [];
   }

   Person.prototype.sayHi = function () {
     console.log(`hi, ${this.name}`);
   };

   function Student() {
     this.sno = 111;
   }

   Student.prototype = new Person();

   var stu1 = new Student();
   var stu2 = new Student();

   // 这里是给自己对象(stu1)上添加属性并没有修改new Person创建的对象的name值
   stu1.name = "hihi";
   console.log(stu2.name); // iyunyu

   // 获取引用, 直接修改了引用的值
   stu1.friends.push("iyunyuiyunyu"); // stu1.friends = []: 不一样
   console.log(stu2.friends); // ['iyunyuiyunyu']
   ```

3. **上面过程中并没有传递参数, 目前的原型链方案直接实现继承不方便**

4. ...

   ```js
   function Person() {}
   var p = new Person();

   // 某一个原型(Person.prototype)是否出现在自己(p)的原型链上
   console.log(stu instanceof Person);
   console.log(Person.prototype.isPrototypeOf(p)); // true

   // 区别: instanceof右边只能是对象
   ```

### 2 借用构造函数继承

> 为了解决原型链继承中存在的问题, 开发人员提供了一种新的技术(constructor)

- 解决了原型链弊端

  ```js
  function Person(name, age, friends) {
    this.name = name;
    this.age = age;
    this.friends = friends;
  }

  Person.prototype.eating = function () {
    console.log(this.name + " eating~");
  };

  function Student(name, age, friends, sno) {
    Person.call(this, name, age, friends);
    this.sno = 111;
  }

  Student.prototype = new Person();

  Student.prototype.studying = function () {
    console.log(this.name + " studying~");
  };

  var stu1 = new Student("why", 18, ["lilei"], 111);
  var stu2 = new Student("kobe", 30, ["james"], 112);

  stu1.friends.push("lucy");

  console.log(stu1.friends);
  console.log(stu2.friends);
  ```

- 内存中表现

  ![](https://gitee.com/ipinga/hi-img/raw/master/img/Snipaste_2022-01-30_00-58-04.jpg)

- 借用构造函数也是有弊端的

  1. Person 函数至少被调用了两次
  2. 原型对象上会多出一下属性, 这些属性没有必要存在

- 那么我们可不可以直接让 Student.prototype = Person.prototype 呢?

  ```js
  function Person() {}
  Person.prototype.sayHi = function () {};

  function Teacher() {}
  function Student() {}

  Student.prototype = Person.prototype;
  Teacher.prototype = Person.prototype;

  Student.prototype.stuHi = function () {};

  var stu = new Student("hi", ["iyunyu"]);
  var tea = new Student("iyunyu", ["hi"]);

  stu.stuhi();
  tea.stuhi(); // 可以?!! 为什么
  ```

  - 从面向对象的角度来说这样是不好的, 因为一个身份的只能有自己身份的行为.

  - 内存中表现

    ![](https://gitee.com/ipinga/hi-img/raw/master/img/Snipaste_2022-01-30_01-32-39.jpg)

### 3 原型式继承函数方案

- 原型式继承函数的实现(对**_对象_**继承)

  ```js
  var obj = {name: "hi", age: 19};

  // 新的函数
  function createObject1(o) {
    var newObj = {};
    Object.setPrototypeOf(newObj, o); // 设置newObj的原型为o
    return newObj;
  }

  // 原始方法
  function createObject2(o) {
    function Fn() {}
    Fn.prototype = o;
    var newObj = new Fn();
    // 等同于var newObj; newObj.__proto__ = o
    // 但是开发中不推荐使用__proto__
    return newObj;
  }

  // 最新的函数create
  var info = Object.create(obj); // 和上面两个函数作用一致

  // var info = createObject1(obj)

  console.log(info.__proto__); // { name: 'hi', age: 19 }
  ```

- 寄生式继承函数的实现(对**_对象_**继承)

  > 就是原型式继承+工厂函数而已

  ```js
  var person = {
    sayHi() {
      console.log("hi");
    },
  };

  function createStudent(name) {
    var student = Object.create(person);
    stu.name = name;
    stu.stuHi = function () {
      console.log("stu hi");
    };
    return student;
  }

  var stu1 = createStudent("hi");
  ```

### 4 寄生组合式继承

> 最终方案!!! 别名: 寄生原型借用式继承方案

```js
// 工具函数 inheritPrototype
function inheritPrototype(SubType, SuperType) {
  SubType.prototype = Object.create(SuperType.prototype);
  Object.defineProperty(SubType.prototype, "constructor", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: SubType,
  });
}

// 父类
function Person(name) {
  this.name = name;
}

Person.prototype.sayHi = function () {
  console.log(`hi, ${this.name}`);
};

// 子类
function Student(name, friends, sno) {
  // 复用父类的逻辑
  Person.call(this, name);
  this.friends = friends;
  this.sno = sno;
}

// 继承
inheritPrototype(Student, Person);

// 子类特有的方法
Student.prototype.studying = function () {
  console.log("studying");
};

// 子类对象
var student = new Student("hi", ["iyunyu"], 111);

console.log(student);
student.sayHi(); // 使用父类的方法
```

- 内存中表现

  ![](https://gitee.com/ipinga/hi-img/raw/master/img/Snipaste_2022-01-31_15-56-19.jpg)

### 5 对象的方法补充

1. Object.create(obj, { ... })

   ```js
   /**
    *  create方法可以传两个参数: 第二个是对象, 里面是属性描述符(多个属性)
    */
   var obj = {name: "hi"};
   var info = Object.create(obj, {
     age: {
       value: 19,
       enumerable: true,
     },
   });

   console.log(info); // { age: 19 }
   ```

2. obj.hasOwnProperty()

   ```js
   var obj = {name: "hi"};
   var info = Object.create(obj, {
     age: {
       value: 19,
       enumerable: true,
     },
   });

   // 判断属性是在自己里面还是原型上
   console.log(info.hasOwnProperty(name)); // false
   ```

3. in 操作符

   ```js
   var obj = {name: "hi"};
   var info = Object.create(obj, {
     age: {
       value: 19,
       enumerable: true,
     },
   });

   // 不管在自己上还是原型上, 存在就返回true
   console.log("name" in info); // true
   ```

4. instanceof

   ```js
   function inheritPrototype(SubType, SuperType) {
     SubType.prototype = Object.create(SuperType.prototype);
     Object.defineProperty(SubType.prototype, "constructor", {
       enumerable: false,
       configurable: true,
       writable: true,
       value: SubType,
     });
   }

   function Person() {}
   function Student() {}

   inheritPrototype(Student, Person);

   var stu = new Student();
   console.log(stu instanceof Person); // true
   // 从stu原型上开始找Person的原型, 有就返回true
   ```

5. isPrototypeOf

   ```js
   function Person() {}
   var p = new Person();

   // 某一个原型(Person.prototype)是否出现在自己(p)的原型链上
   console.log(stu instanceof Person);
   console.log(Person.prototype.isPrototypeOf(p)); // true

   // 区别: instanceof右边只能是对象
   ```

# Proxy/Reflect

一个对象, 我们希望监听这个对象中的属性被设置或获取的过程, 我们**可以通过之前的属性描述符来做到**, 但是这样做有缺点:

1. Object.defineProperty 设计的初衷, 不是为了监听截取一个对象中的所有属性
2. 想监听更加丰富的操作, 比如新增属性/删除属性, 那么 Object.defineProperty 是无能为力的

### 1 基本使用

> 如果我们希望监听一个对象的相关操作, 那么我们可以先创建一个代理对象(Proxy 对象), 之后对该对象的所有操作, 都通过代理对象来完成, 代理对象可以监听我们想要对元对象进行哪些操作

##### 1.1 Object.defineProperty

```js
const info = {name: "hi"};

Object.keys(info).forEach((key) => {
  let value = info[key];
  Object.defineProperty(info, key, {
    get() {
      return value;
    },
    set(newValue) {
      value = newValue;
    },
  });
});

console.log(info.name);
info.name = "iyunyu";
```

缺点:

# Promise

# 迭代器

> iterator
>
> 迭代器是帮助我们对某个数据结构进行遍历的对象

### 1 概念

##### 1.1 迭代器协议

> 迭代器也是一个具体的对象, 这个对象需要符合(iterator protocol):

1. 迭代器协议定义了产生一系列值(无论有限还是无限个)的标准方式

2. 那么在 JS 中这个标准就是一个特定的 next 方法

3. next 方法有如下的要求

   - 一个无参数 or 一个参数的函数
   - 返回一个应当拥有以下两个属性的对象
     - done
       - 如果迭代器可以产生序列的下一个值, 则为 false(等价于没有指定 done 这个属性)
       - 如果迭代器已将序列迭代完毕, 则为 true. 这种情况下, value 是可选的, 如果它依然存在, 即为迭代结束之后的默认返回值.
     - value: 迭代器返回的任何 JavaScript 值, node 为 true 是可省略

4. 案例

   ```js
   // 有限迭代器
   const namesIterator = {
     index: 0,
     next() {
       if (index < names.length) {
         return {done: false, value: names[index++]};
       } else {
         return {done: true, value: undefined};
       }
     },
   };

   // 无限迭代器(仅作了解)
   const numberIterator = {
     index: 0,
     next() {
       return {done: false, value: index++};
     },
   };
   ```

##### 1.2 可迭代协议

> 它和迭代器是不同的概念, 当一个对象实现了**iterable protocol 协议**时, 它就是一个可迭代对象
>
> 这个对象要求必须实现@@iterator 方法, 在代码中给我们使用 Symbol.iterator 访问该属性
>
> > `const iterator = { [Symbol.iterator]: function() { return 迭代器 } }`

案例:

```js
// 可迭代对象
const iterableObj = {
  names: ["hi", "iyunyu", "flower"],
  [Symbol.iterator]: function () {
    let index = 0;
    return {
      next: () => {
        if (index < this.names.length) {
          return {done: false, value: this.names[index++]};
        } else {
          return {done: true, value: undefined};
        }
      },
    };
  },
};

// 一般可迭代对象在for...of中使用, for...of是一种语法糖, 它内部会自动调用next函数
for (let item of iterableObj) {
  console.log(item);
}
```

##### 1.3 创建迭代器函数

```js
function createArrayIterator(arr) {
  let index = 0;
  return {
    next() {
      if (index < arr.length) {
        return {done: false, value: arr[index++]};
      } else {
        return {done: true, value: undefined};
      }
    },
  };
}
```

### 2 原生迭代器对象

> 事实上我们平时创建的很多原生对象已经实现了可迭代协议, 会生成一个迭代器对象
>
> String、Array、Map、Set、arguments、NodeList 集合

### 3 可迭代对象的应用

那么它可以应用在哪里呢?

1. JavaScript 中语法
   - for...of
   - 展开语法(直接放对象的时候操作不一样, ES9 新增特性)
   - yield\*
   - 结构赋值(直接放对象的时候操作不一样, ES9 新增特性)
2. 创建一些对象时
   - new Map([Iterable])
   - new WeakMap([Iterable])
   - new Set([Iterable])
   - new WeakSet([Iterable])
3. 一些方法的调用
   - Promise.all(iterable)
   - Promise.race(iterable)
   - Array.from(iterable)

### 4 自定义类的迭代

```js
class Classroom {
  constructor(address, name, students) {
    this.address = address;
    this.name = name;
    this.students = students;
  }

  entry(newStudent) {
    this.students.push(newStudent);
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.students.length) {
          return {done: false, value: this.students[index++]};
        }
      },
      return: () => {
        console.log("迭代器提前终止了");
        return {done: true, value: undefined};
      },
    };
  }
}

const classroom = new Classroom("11栋", "414", ["hi", "iyunyu"]);

classroom.entry("flower");

for (const stu of classroom.students) {
  console.log(stu);
  // 遇上break之后会执行迭代器中return函数
  if (stu === "flower") break;
}
```

# 生成器

> 生成器时 ES6 新增的一种函数控制和使用的方案, 它可以让我们更加灵活的控制函数声明时候继续执行/暂停执行等.

### 1 函数执行

##### 1.1 普通函数执行

```js
function foo() {
  const value1 = 100;
  console.log(value1);

  const value2 = 100;
  console.log(value1);

  const value3 = 100;
  console.log(value1);
}
```

平时我们会编写很多的函数, 这些函数终止的田间通常时返回值或者发生了异常

##### 1.2 生成器

> 生成器函数也是一个函数, 但是和普通的函数有一些区别
>
> 1. 在 function 的后面借一个符号\*
> 2. 可以通过 yield 关键字来控制函数的执行流程
> 3. 返回值是一个 Generator(生成器)
>    - 生成器事实上是一种特殊的迭代器

```js
function* foo() {
  console.log("hi");
  yield;
  console.log("iyunyu");
}

// 调用生成器函数时, 会给我们返回一个生成器对象
const generator = foo();

// 开始执行第一段代码(第一个yield关键字的前面逻辑)
generator.next(); // 1
generator.next(); // 2
```

### 2 生成器函数

##### 2.1 执行流程

```js
function* foo() {
  console.log("函数开始执行!");
  console.log("第一段代码执行");
  yield "hi"; // 第一段代码返回值

  console.log("第二段代码执行");
  yield "iyunyu"; // 第二段代码返回值

  console.log("函数执行结束");
  return "flower";
}

const generator = foo();

console.log("返回值:", generator.next()); // 返回值: { value: 'hi', done: false }
console.log("返回值:", generator.next()); // 返回值: { value: 'iyunyu', done: false }
console.log("返回值:", generator.next()); // 返回值: { value: 'flower', done: true }
```

##### 2.2 返回值

```js
function* foo() {
  // 第一段逻辑
  yield 1;
  // 第二段逻辑
  yield 2;
  // 第三段逻辑
  return 3;
}

const generator = foo();
console.log(generator.next()); // { value: 1, done: false }
console.log(generator.next()); // { value: 2, done: false }
console.log(generator.next()); // { value: 3, done: true }

// generator.next() 返回值是关键字yield右边的值
```

##### 2.3 参数

```js
function* foo(num) {
  // 第一段逻辑参数: num
  console.log(num);

  const arg2 = yield;
  // 第二段逻辑参数: generator.next(10)
  console.log(arg2);

  const arg3 = yield;
  // 第三段逻辑参数: generator.next(20)
  console.log(arg3);
}

const generator = foo(5);
generator.next();
generator.next(10);
generator.next(20);
```

### 3 其他函数

##### 3.1 return 终止执行

```js
function* foo(num) {
  console.log("第一段代码执行了");
  yield num;
  console.log("第二段代码执行了");
  yield arg;
  console.log("第三段代码执行了");
}

const generator = foo(5);

console.log(generator.next(10));
console.log(generator.return(20));
console.log(generator.next(10)); // 第二段代码不会执行
```

##### 3.2 抛出异常

```js
function* foo() {
  console.log(`第一段代码执行了`);

  yield 1;

  try {
    console.log(`第二段代码执行了`);
  } catch (err) {
    console.log(`捕获异常: ${err}`);
  }

  return 2;
}

const generator = foo();

const result = generator.next();

if (result.value !== 200) {
  generator.throw(`error message`);
}
```

### 4 生成器代替迭代器

##### 4.1 迭代器函数

```js
function createArrayIterator(arr) {
  let index = 0;
  return {
    next() {
      if (index < arr.length) {
        return {done: false, value: arr[index++]};
      } else {
        return {done: true, value: undefined};
      }
    },
  };
}
```

##### 4.2 生成器函数

```js
function* createArrayIterator(arr) {
  // 写法一
  // for (const item of arr) {
  //   yield item
  // }

  // 写法二: 写法一的语法糖
  yield* arr;
}

const names = ["hi", "iyunyu", "flower"];
const namesIterator = createArrayIterator(names);
for (const item of namesIterator) {
  console.log(item);
}
```

##### 4.3 自定义类对象的生成器函数

```js
class Classroom {
  constructor(students) {
    this.students = students;
  }

  // 生成器函数
  *[Symbol.iterator]() {
    yield* this.students;
  }
}

const classroom = new Classroom(["hi", "iyunyu", "flower"]);
for (const student of classroom) {
  console.log(student);
}
```

> 生成器代码比迭代器代码简洁
>
> 开发中一般能用生成器就使用生成器, 只有生成器不方便解决问题的时候才使用迭代器

# async-await

> async 和 await 本质上是 Promise 和 Generator 的语法糖

### 1 异步代码的处理方案

需求:

1. 使用 url 请求数据
2. 将请求到的数据拼接上 iyunyu 继续请求
3. 将请求到的数据拼接上 flower 返回结果

定义 request.js 中 requestData 函数:

```js
// request.js
function requestData(url) {
  return new Promise((resolve, reject) => {
    // 模拟网络请求
    setTimeout(() => {
      resolve(url); // 相当于把传进来的url一秒后直接返回
    }, 1000);
  });
}

// 导出
module.exports = {
  requestData,
};
```

##### 1.1 多次回调

```js
const {requestData} = require("./request.js");

requestData("hi").then((res) => {
  requestData(res + "iyunyu").then((res) => {
    requestData(res + "flower").then((res) => {
      console.log(res);
    });
  });
});
```

这种方式发生了回调地狱, 并且代码的阅读性不高.

##### 1.2 Promise 的返回值

```js
const {requestData} = require("./request.js");

requestData("hi")
  .then((res) => {
    return requestData(res + "iyunyu");
  })
  .then((res) => {
    return requestData(res + "flower");
  })
  .then((res) => {
    console.log(res);
  });
```

这种方式虽然没有产生回调地狱, 但是代码的阅读性不高.

##### 1.3 Promise+Generator(生成器)

```js
const {requestData} = require("./request.js");

function* getData() {
  const res1 = yield requestData("hi");
  const res2 = yield requestData(res1 + "iyunyu");
  const res3 = yield requestData(res2 + "flower");
  console.log(res3);
}

module.exports = {
  getData,
};
```

这种方式没有产生回调地狱, 代码可读性也高了不少

调用方式

手动执行

```js
const { getData } = require(./gatData.js)

const generator = getData()

generator
  .next()
  .value.then((res) => {
    return generator.next(res).value
  })
  .then((res) => {
    return generator.next(res).value
  })
  .then((res) => {
    console.log(res)
  })
```

自动执行

```js
const {getData} = require("./gatData.js");

function execCenerator(generatorFn) {
  const generator = generatorFn();
  function exec(res) {
    const result = generator.next(res);
    if (result.done) return result.value;
    result.value.then((res) => {
      exec(res);
    });
  }
  exec();
}

execCenerator(getData);
```

##### 1.4 async/await

> 终极方式: 其实就是 Promise+Generator 的语法糖

```js
const {requestData} = require("./request.js");

async function getData() {
  const res1 = await requestData("hi");
  const res2 = await requestData(res1 + "iyunyu");
  const res3 = await requestData(res2 + "flower");
  console.log(res3);
}

getData();
```

### 2 async 异步函数的使用

> 用于声明一个异步函数
>
> 单词: 1. asynchronous: 异步 2. synchronous: 同步

##### 2.1 基本写法

```js
// 1
async function foo() {}

// 2
const bar = async () => {};

// 3
class Baz {
  async foo() {}
}
```

##### 2.2 异步函数的执行流程

```js
// 同步
async function foo() {
  console.log("hi");
  console.log("hi");
  console.log("hi");
}

foo();
console.log("iyunyu"); // 同步执行, 与普通函数没有区别
```

##### 2.3 与普通函数的区别

返回值

> 异步函数的返回值一定是一个 Promise

```js
async function foo() {
  console.log("foo function start!");
  console.log("foo function end!");

  // return 'hi'

  // return {
  //   then: function (resolve, reject) {
  //     resolve('hi')
  //   }
  // }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("hi");
    }, 1000);
  });
}

// 异步函数执行完return之后将之下then方法
foo().then((res) => {
  console.log(`promise then function exec: ${res}`);
});
```

异常

> 异步函数中的异常， 会被作为异步函数返回的 Promise 的 reject 值的

```js
async function foo() {
  console.log("foo function start!");
  throw new Error("error message");
  console.log("foo function end!");
}

foo().catch((err) => {
  // console.log(err)
});

console.log("~~~~~~~~~~");
```

使用 await

> async 函数另外一个特殊之处就是可以在它内部使用 await 关键字, 而普通函数不可以
>
> 下一个 await 之前的代码都是在前一个 await 的 then 中执行

```js
function requestData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("hi");
    }, 1000);
  });
}

// await跟上表达式, 返回Promise
async function foo() {
  const res1 = await requestData();
  console.log(`res1: ${res1}`); // 下一个await之前的代码都是在前一个await的then中执行
  const res2 = await requestData();
  console.log(`res2: ${res2}`);
}

// reject值
async function foo() {
  // 当requestData返回reject值时
  // 这个异步函数会将它作为整个函数的返回值
  // 并且后续代码不执行, 调用时也必须有catch捕获, 不然报错
  const res1 = await requestData();
}

// await跟上其他值
async function foo() {
  // const res1 = await 'hi' // => res1 === 'hi'
  // const res1 = await { // hi => res1 === 'hi'
  //   then: function (resolve, reject) {
  //     resolve('hi')
  //   }
  // }
  const res1 = await new Promise((resolve) => {
    resolve("hi");
  }); // => res1 === 'hi'
}

foo()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

console.log("Hi, I am iyunyu"); // 优先执行
```

# 事件循环

### 1 进程和线程

> 线程和进程是操作系统中的两个概念

进程: 计算机已经运行的程序, 是操作系统管理程序的一种方式; 我们可以认为, 启动一个应用程序, 就默认启动一个进程(也可能多个进程)

线程: 操作系统能够运行调度的最小单位, 通常情况下它被包含在进程中; 每一个进程中, 都会启动至少一个小城用来执行程序中的代码, 这个线程被称之为主线程

所以我们亦可以说进程是线程的容器;

再用一个形象的例子解释:

1. 操作系统类似一个大工厂
2. 工厂中有很多车间, 这个车间就是进程
3. 每个插件可能有一个以上的工人在干活, 这个工人就是进程

### 2 事件循环是什么

##### 2.1 JS 进程

> 我们经常会说 JavaScript 是单线程的, 但是 JavaScript 的线程应该有自己的容器进程: 浏览器或者 Node

浏览器是一个进程嘛? 它里面只有一个进程嘛?

- 目前多数的浏览器其实都是多进程的, 当我们打开一个 tab 页面时就会开启一个新的进程, 这是为了防止一个页面卡死而造成所有页面无法响应, 整个浏览器需要强制退出
- 每个进程中又有很多的线程, 其中包括执行 JavaScript 代码的线程

JavaScript 的代码执行是在一个单独的线程中执行的

- 这就意味着 JavaScript 的代码, 在同一个时刻只能做一件事
- 如果这件事时非常耗时的, 就意味着当前的线程就会被阻塞

所以真正耗时的操作, 实际上不是有 JavaScript 线程在执行的

- 浏览器的每个进程是多线程的, 那么其他线程可以来完成这个耗时的操作
- 比如网络请求/定时器, 我们只需要在特定的时候执行应该有的回调即可

##### 2.2 其他进程

当我们 JS 代码中存在异步调用的函数, 那么 JS 引擎会给浏览器(Node)发起一个请求, 将这个函数的计时操作放在其他进程里, 当计时时间到时, JS 引擎便会回调这个函数

##### 2.3 事件队列

> 队列: 一种数据结构, 特点是先进入的任务先执行(先进先出)

队列中的任务会给 JS 进程执行

**JS 进程和其他任务、任务队列组成的闭环就是事件循环.**

### 3 微任务/宏任务

> 事件队列中有两个队列:
>
> 1. 宏任务队列(macrotask queue)
> 2. 微任务队列(microtask queue)

```js
setTimeout(() => {
  // 宏任务
  console.log("setTimeout");
});

queueMicrotask(() => {
  // 微任务
  console.log("queueMicrotask");
});

Promise.resolve().then(() => {
  // 微任务
  console.log("Promise then");
});
```

两队列都有任务的情况呢?

1. main script 中的代码优先执行(编写顶层的 script 代码)

2. **在执行任何的宏任务(回调)之前, 都需要先保证微任务队列(回调)已经被清空**

### 4 面试题

1

```js
setTimeout(function () {
  // 一层宏任务
  console.log("setTimeout1"); // 二层main script
  new Promise(function (resolve) {
    resolve();
  }).then(function () {
    new Promise(function (resolve) {
      resolve();
    }).then(function () {
      console.log("then4");
    });
    console.log("then2");
  });
});

new Promise(function (resolve) {
  // 一层main script
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("then1"); // 一层微任务
});

setTimeout(function () {
  console.log("setTimeout2"); // 一层宏任务
});

console.log(2);

queueMicrotask(() => {
  console.log("queueMicrotask1"); // 一层微任务
});

new Promise(function (resolve) {
  resolve();
}).then(function () {
  console.log("then3"); // 一层微任务
});

// promise1
// 2
// then1
// queueMicrotask1
// then3
// setTimeout1
// then2
// then4
// setTimeout2
```

2

```js
// async function bar() {
//   console.log("22222")
//   return new Promise((resolve) => {
//     resolve()
//   })
// }

// async function foo() {
//   console.log("111111")

//   await bar()

//   console.log("33333")
// }

// foo()
// console.log("444444")

// 1
// 2
// 4
// 3

async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function () {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});

console.log("script end");

// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```

3

```js
Promise.resolve()
  .then(() => {
    console.log(0);
    // 1.直接return一个值 相当于resolve(4)
    // return 4

    // 2.return thenable的值
    return {
      then: function (resolve) {
        // 大量的计算
        resolve(4);
      },
    };

    // 3.return Promise
    // 不是普通的值, 多加一次微任务
    // Promise.resolve(4), 多加一次微任务
    // 一共多加两次微任务
    return Promise.resolve(4);
  })
  .then((res) => {
    console.log(res);
  });

Promise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });

// 1.return 4
// 0
// 1
// 4
// 2
// 3
// 5
// 6

// 2.return thenable
// 0
// 1
// 2
// 4
// 3
// 5
// 6

// 3.return promise
// 0
// 1
// 2
// 3
// 4
// 5
// 6
```

4

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function () {
  console.log("setTimeout0");
}, 0);

setTimeout(function () {
  console.log("setTimeout2");
}, 300);

setImmediate(() => console.log("setImmediate"));

process.nextTick(() => console.log("nextTick1"));

async1();

process.nextTick(() => console.log("nextTick2"));

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
  console.log("promise2");
}).then(function () {
  console.log("promise3");
});

console.log("script end");

// script start
// async1 start
// async2
// promise1
// promise2
// script end
// nexttick1
// nexttick2
// async1 end
// promise3
// settimetout0
// setImmediate
// setTimeout2
```

# 异常

### 1 错误处理方案

如果我们有一个函数, 在调用这个函数时, 如果出现了错误, 那么我们应该是去修复这个错误

> throw 关键字可以给调用者抛出一个异常

```js
function sum(m, n) {
  if (typeof m !== "number" || typeof n !== "number") {
    // 当传入的参数类型不正确时, 应该告知调用者一个错误
    throw "parameters is error type!";
  }

  return m + n;
}

console.log(sum({name: "hi"}, true));
```

### 2 抛出错误的其他补充

##### 2.1 抛出类型

```js
class HiError {
  constructor(errCode, errMessage) {
    this.errCode = errCode;
    this.errMessage = errMessage;
  }
}

function foo(type) {
  console.log("foo function start");

  if (type === 0) {
    // 1. 抛出一个(基本数据类型)
    // throw 'error' // 111

    // 2. 比较常见的是抛出一个对象类型
    // throw { errorCode: -1001, errorMessage: 'type不能为0!' }

    // 3. 创建一个类, 并且创建这个类对应的对象(最常见)
    // throw new HiError(-1001, 'type不能为0!')

    // 4. 提供了一个Error类(最最常见)
    throw new Error("type不能为0!");
  }

  console.log("foo function end");
}

foo(0);
```

##### 2.2 Error 类型

Error 包含三个属性:

- message: 创建 Error 对象传入的 message
- name: Error 的名称, 通常和类的名称一致
- stack: 整个 Error 的错误信息, 包括函数的调用栈, 当我们直接打印 Error 对象时, 打印的就是 stack

Error 拥有一些自己的子类

- RangeError: 下标值越界时使用的错误类型
- SyntaxError: 解析语法错误时使用的错误类型
- TypeError: 出现类型错误时, 使用的类型

```js
function foo(type) {
  console.log("foo function start");

  if (type === 0) {
    // const err = new Error('type不能为0!')
    // console.log(err.name)
    // console.log(err.message)
    // console.log(err.stack)
    // // 可以修改
    // err.name = 'hi' // ...
    // throw new TypeError('...')
    // throw new RangeError('...')
    // throw new SyntaxError('...')
  }

  console.log("foo function end");
}

foo(0);
```

> 强调: 如果函数中已经抛出了异常, 那么后续的代码都不会继续执行了

### 3 异常处理

##### 3.1 不处理

> 如果我们在调用一个函数时, 这个函数抛出了异常, 但是我们没有对这个异常进行处理, 那么这个异常会继续传递到上以恶搞函数调用中

```js
function foo() {
  throw new Error("error message");
}

function bar() {
  foo();
}

bar();
console.log("后续的代码!"); // 不会执行
```

##### 3.2 try...catch...

> 当我们不希望程序直接退出, 而是希望可以正确的获取异常, 可以使用 try...catch...

```js
function foo() {
  throw new Error("error message");
}

function bar() {
  try {
    foo();
  } catch (err) {
    console.log("err: ", err.message);
  } finally {
    // 不管有没有执行, finally中的代码都会执行
    console.log("finally");
  }
}

bar();
console.log("后续的代码!"); // 捕获了异常, d会执行
```

# 模块化

到底什么是模块化/模块化开发呢?

- 事实上模块化开发最终目的是将程序划分成一个个小的结构
- 这个结构中编写属于自己的逻辑代码, 有自己的作用域, 不会影响到其他的结构
- 这个结构可以将自己希望暴露的变量/函数/对象等导出给其结构使用
- 也可以通过某种方式, 导入另外结构中的变量/函数/对象等

上面说提到的结构, 就是模块, 按照这种结构划分开发程序的过程, 就是模块化开发的过程

### 1 Common JS 规范

我们需要知道 CommonJS 是一个规范, 最初提出来是在浏览器以外的地方使用, 并且当时被命名为 ServerJS, 后来为了体现它的广泛性, 平时我们也会检查为 CJS

1. Node 是 CommonJS 在服务器端一个具有代表性的实现
2. Browserify 是 CommonJS 在浏览器中的一种实现
3. webpack 打包工具具备对 CommonJS 的支持和转换

所以, Node 中对 CommonJS 进行了支持和实现, 让我们在开发 Node 的过程中可以方便的进行模块化开发:

- 在 Node 中每一个 JS 文件都是一个单独的模块
- 这个模块中包括 CommonJS 规范的可信变量: exports/module.exports/require
- 我们可以使用这些变量来方便的进行模块化开发

前面我们提到过模块化的核心是导出和导入, Node 中对其进行了实现

- exports 和 module.exports 可以负责对模块中的内容进行导出
- require 函数可以帮助我们导入其他模块(自定义模块/系统模块/第三方库模块)中的内容

##### 1.1 exports 导出

注意: exports 是一个对象, 我们可以在这个对象中添加很多个属性, 添加的属性会导出

```js
exports.name = name;
exports.sayHi = function () {};
```

从另一个文件导入`const bar = require('./bar')`

上面这行完成了什么操作呢? 理解下面这句话, Node 中的模块化一目了然

- **意味着 main 中的 bar 变量等于 exports 对象**, 也就是 require 通过各种查找方式, 最终找到了 exports 这个对象,并且将这个 exports 对象赋值给了 bar 变量, bar 变量就是 exports 对象了;

##### 1.2 module.exports 导出

但是 Node 中我们经常导出东西的时候, 优势通过 module.exports 导出的, **module.exports 和 exports 有什么关系呢?**

我们追根溯源, 通过维基百科对 CommonJS 规范的解析

- CommonJS 中是没有 module.exports 的概念的, 但是为了实现模块的导出, Node 中使用的是 Module 的类, 每一个模块都是 Module 的一个实例, 也就是 module, 所以在 Node 中真正用于导出的其实不是 exports, 而是 module.exports. 因为 module 才是导出的真正实现者

但是, 为什么 exports 也可以导出呢?

- 这是因为 module 对象的 exports 属性是 exports 对象的一个引用, 也就是说 `module.exports = exports`等于 main 中的 bar

##### 1.3 require 细节

我们现在已经知道, require 是一个函数, 可以帮助我们引入一个文件(模块)中导出的对象, 那么 require 的查找规则是怎么样的呢? `require(X)`

- 情况一: X 是一个 Node 核心模块, 比如 path/http
  - 直接返回核心模块, 并且停止查找
- 情况二: X 是以 ./ 或 ../ 或 /(根目录)开头的
  - 第一步如果有后缀名, 会按照如下顺序
    - 如果有后缀名, 按照后缀名的格式查找对应的文件
    - 如果没有后缀名, 会按照如下顺序
      - 直接查找文件 X
      - 查找 X.js 文件
      - 查找 X.json 文件
      - 查找 X.node 文件
  - 第二步: 没有找到对应得文件, 将 X 作为一个目录
    - 查找目录下面得 index 文件
      - 查找 X/index.js 文件
      - 查找 X/index.json 文件
      - 查找 X/index.node 文件
  - 如果没有找到, 报错: not found
- 情况三: 直接是一个 X(没有路径), 并且 X 不是一个核心模块
  - 会一层一层往上遍历查找 node_modules 中的库, 知道根路径下
- 如果上面的路劲都没有找到, 那么报错: not found

##### 1.4 模块加载过程

- 结论一: 模块在被第一次引入时, 模块中的 JS 代码会被执行一次
- 结论二: 模块被多次引入时, 会缓存, 最终只加载一次
- 结论三: 循环引用, 加载顺序是**深度优先搜索**

##### 1.5 缺点

- 加载模块同步, 意味着应用于浏览器不合适

##### 1.6 案例

- main.js

  ```js
  // 导入
  // const hi = require('./hi.js') // hi => { name, log }
  const {name, log} = require("./hi.js");

  console.log(name);
  console.log(log());
  ```

- hi.js

  ```js
  const name = "hi";
  function log() {
    return "Hi, I am iyunyu";
  }

  // 导出
  module.exports = {
    // name: name,
    name,
    log,
  };

  // 或者这样的写法
  // module.exports = {
  //   name: 'hi',
  //   log: function() {
  //     return 'Hi, I am iyunyu'
  //   }
  // }
  ```

### 2 ES Module 规范

JavaScript 没有模块化一直是它的痛点, 所以才会产生我们前面学习的社区规范 CommonJS, ES Module 和 CommonJS 的模块化有一些不同之处

- ES Module 使用了 import 和 export 关键字
- 另一方面它曹勇编译器的静态分析, 并且也加入了动态引用的方式

ES Module 模块采用 export 和 import 关键字来实现模块化

- export 负责将模块内的内容导出
- import 负责从其他模块导出内容

采用 ES Module 将自动采用严格模式: use strict

##### 2.1 exports 关键字

> export 关键字将一个模块中的变量、函数、类等导出

- `export const name = 'hi'`
- `export { 标识符列表 }`, 注意这里{} 不是对象
- `export { name as sname, ... }`别名

##### 2.2 import 关键字

> import 关键字负责从另一个模块中导入内容

- `import { 标识符列表 } '模块'`, 这里的{} 也不是一个对象, 里面存放导入的标识符列表内容
- `import { name as sname } from '模块'`, 别名, 如果另一个文件导出时使用别名, 这里导入的原来的名字是另一个文件的别名, 其他方式也是一样
- `import bar as * from '模块'`, 将模块导出的内容全部导入到 bar 对象中

##### 2.3 export 和 import 结合使用

> 导入并导出, 通常应用于**统一接口规范导出**

```js
export { ... } from './bar.js'
```

##### 2.4 default 用法

> 如果我们希望导出不指定名字, 我们可以使用默认导出(default export)
>
> 注意: 在一个模块中, 只能有一个默认导出

```js
// foo.js
export default foo;

// main.js
import bar from "./foo.js"; // bar === foo
```

##### 2.5 import 函数

通过 import 加载一个模块, 是不可以将其放到路及代码中的, 因为 ES Module 在被 JS 引擎解析时, 就必须找到它的依赖关系, 由于这个时候 JS 代码没有任何的运行, 所以无法在进行类似于 if 判断中根据代码执行情况

但是某些情况下, 我们希望动态的来加载某一个模块, 我们可以使用 import()来动态加载

```js
let flag = true;
if (flag) {
  import("./foo.js").then((foo) => {
    foo.bar();
  });
} else {
  import("./bar.js").then((bar) => {
    bar.foo();
  });
}
```

##### 2.6 import meta

是一个给 JavaScript 模块暴露特定上下文的元数据属性的对象, 包含这个模块的信息, ES11 新增

##### 2.7 执行过程

##### 2.8 案例

- index.html

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>ES Module</title>
    </head>
    <body>
      <script src="./main.js" type="module"></script>
    </body>
  </html>
  ```

- main.js

  ```js
  import {name} from "./hi.js";
  ```

- hi.js

  ```js
  export const name = "hi";
  ```

# 包管理工具

### 1 npm

> Node Package Manager

目前已经不仅仅是 Node 包管理器了, 在前端项目中我们也在使用它来管理依赖的包, 如何下载 npm 工具呢?

- 安装 Node 便自动安装了 npm

##### 1.1 配置文件

如何使用 npm 管理这么多包呢? 我们每一个项目都会有一个对应的配置文件, 这个**配置文件会记录着你项目的名称、版本号、项目描述等**, 也会**记录着你项目所依赖的其他库的信息和依赖库得版本号**

这个配置文件就是 package.json

- 文件生成: `npm init [-y]`
- 配置文件中常见得配置
  - name: 项目的名称(必须)
  - version: 当前项目的版本号
  - description: 描述信息
  - author: 作者
  - license: 开源协议
  - **private**: 记录当前项目是否私有
  - main: 程序的入口
  - **scripts**: 用于配置一些脚本命令, 以键值对的形式存在, 配置后我们就可以使用`npm run key`来执行
  - dependencies: 指定开发环境和生产环境都需要依赖的包
  - devDependencies: 开发环境需要, 生产环境不需要
  - peerDependencies: 项目依赖关系是对等依赖, 也就是你依赖的一个包, 它必须以另一个宿主包为前提
  - engines: 用于指定 Node 和 NPM 的版本
  - browserlist: 用于配置打包后的 JavaScript 浏览器的兼容情况
- 版本管理^x.y.z 和 ~x.y.z
  - x.y.z
    - x: 主版本号, 一般不改, 除非做了不兼容的 API 修改
    - y: 次版本号, 当你做了向下兼容的功能性新增
    - z: 修订号, 做了向下兼容的问题修正
  - ^ 和 ~
    - ^: 表示 x 保持不变, y 和 z 永远安装最新的版本
    - ~: 表示 x 和 y 保持不变, z 永远安装最新的版本

##### 1,2 npm install 命令

- 全局安装: npm install package -g

- 局部安装: npm install package

  - 开发依赖: npm install package --save-dev
  - 生产依赖: npm install package --save

- 原理图

  ![](https://gitee.com/ipinga/hi-img/raw/master/img/Snipaste_2022-02-02_18-14-33.jpg)

##### 1.3 常见命令

- 卸载: npm uninstall package
- 重新 build: npm rebuild
- 清除缓存: npm cache clian
- [npm 官网命令](https://docs.npmjs.com/cli-documentation/cli)

### 2 yarn

> 由 Facebook、Google、Exponent 和 Tilde 联合推出一个新的 JS 包管理工具
>
> 安装: npm install yarn -g

##### 2.1 ==npm、yarn 命令对比==

| npm                                   | yarn                        |
| :------------------------------------ | --------------------------- |
| npm install                           | yarn install                |
| npm install package                   | yarn add package            |
| npm install --save package            | yarn add package            |
| npm install --save-dev package        | yarn add package [--dev/-D] |
| npm rebuild                           | yarn install --force        |
| npm uninstall package                 | yarn remove package         |
| npm uninstall --save package          | yarn remove package         |
| npm uninstall --save-dev package      | yarn remove package         |
| npm uninstall --save-optional package | yarn remove package         |
| npm cache clean                       | yarn cache clean            |
| rm -rf node_modules && npm install    | yarn upgrade                |
| npm install -g [package]              | yarn global add [package]   |

### 3 cnpm

配置命令:

1. npm install -g cnpm --registry=https://registry.npm.taobao.org
2. cnpm config get registry

使用: 和 npm 命令一致, 不过要将 npm 改为 cnpm

### 4 npx

> 安装 Node 便自动安装了 npx
>
> npx 常见的是使用它来调用项目中的某个模块的指令

如果我们全局安装了 webpack, 局部中又安装了 webpack, 那么我们使用 webpack 命令时默认使用全局的 webpack, 那么如何使用局部的 webpack 呢?

- 终端输入命令: `./node_modules/.bin/webpack`
- 修改 package.json 中的 scripts: `"script": {"webpack": "webpack ..."}`
- 使用 npx: npx webpack ...

### 5 npm 发布自己的包

##### 5.1 发布

- 创建一个文件夹(项目 iyunyu), 并进入

- 执行`npm init -y`

- 配置 package.json 属性(不是必须)

  ```json
  {
    // ...
    "repository": {
      "type": "git",
      "url": "https//github.com/hi/iyunyu"
    },
    "homepage": "https//github.com/hi/iyunyu",
    "keywords": [
      "hi",
      "iyunyu"
      // ...
    ]
  }
  ```

- 创建 index.js 并编辑

- npm 官网注册账号

- 命令行登录账号: `npm login`, 输入账号/密码/邮箱

- `npm publish`完成

##### 5.2 更新

- 修改代码
- 修改 package.json 中的 version
- `npm publish`

##### 5.3 删除

- `npm unpublish`

# JSON

> JavaScript Object Notation(JS 对象符号)
>
> 在目前的开发中, JSON 是一种非常重要的数据格式, 它并不是编程语言, 而是一种服务器和客户端之间传输的数据格式

### 1 其他的数据传输格式

##### 1.1 XML

在早期的网络传输中主要是使用 XML 来进行数据交换的, 但是这种格式在解析/传输等各方式都弱于 JSON, 所以目前在前端使用的较少

```html
<person>
  <name>hi</name>
  <age>19</age>
</person>
```

##### 1.2 Protobuf

另外一个在网络传输中目前使用越来越多的数据格式, 因为在 2021 年 3 月才支持 JavaScript, 所以目前前端使用较少

### 2 基本语法

JSON 的顶层支持三种类型的值:

- 简单值: 数字/字符串(不支持单引号)/布尔类型/null 类型
- 对象值(常见): 由 key/value 组成, key 是字符串类型, 必须添加双引号, 值可以是简单值/对象值/数组值
- 数组值: 数组的值可以是简单值/对象值/数组值

```json
{
  "name": "hi",
  "age": 19,
  "friends": ["hi", "iyunyu", "flower"],
  "fooObj": {
    log: function () {}
  }
}
```

### 3 其他方法

##### 3.1 JSON.stringify

> 某些情况我们需要使用下面的对象, 但是有些对象直接使用的话会出问题. 我们就可以将这个对象或者数组转成字符串

```js
const obj = {
  name: "hi",
  age: 19,
  friends: {
    name: "iyunyu",
  },
  hobbies: ["长跑", "羽毛球"],
  // toString() { // 都会转换为'hi'
  //  return 'hi'
  // }
};

// 直接转化
const jsonString1 = JSON.stringify(obj);
console.log(jsonString1);

// stringify第二个参数replacer
// 传入数组
const jsonString2 = JSON.stringify(obj, ["name", "friends"]);
console.log(jsonString2);

// 传入回调函数
const jsonString3 = JSON.stringify(obj, (key, value) => {
  if (key === "age") return value + 1;
  return value;
});

// stringify第三个参数space(string | number)
const jsonString4 = JSON.stringify(obj, null, "**");
console.log(jsonString4);
```

##### 3.2 JSON.parse

> 将 JSON 字符串转化为普通对象

```js
const JSONString = '{"name":"hi","age":19,"friends":{"name":"iyunyu"},"hobbies":["长跑","羽毛球"]}';

// 第二个参数, reviver
const JSONObj = JSON.parse(JSONString, (key, value) => {
  if (key === "age") return value - 1;
  return value;
});
```

### 4 利用 parse 做深拷贝

##### 4.1 引用赋值

```js
const obj = {name: "hi", friends: {name: "iyunyu"}};
const info = obj;
```

任何对 obj 对象的修改打印 info 时也会见到有修改, 因为它们引用同一个内存地址

##### 4.2 展开运算符(浅拷贝)

```js
const obj = {name: "hi", friends: {name: "iyunyu"}};
const info = {...obj};
```

当对 obj 对象中的基本数据类型属性作出修改时, info 不会发生改变, 但是对引用类型属性作出修改时, info 中的也会发生改变. 因为展开运算符相当于做了一个对象的 key 和 value 的拷贝而已

##### 4.3 stringify 和 parse 实现深拷贝

```js
const obj = {name: "hi", friends: {name: "iyunyu"}};
const JSONString = JSON.stringify(obj);
const info = JSON.parse(JSONString);
```

但是, 如果我们原来的对象存在函数, JSON.stringify 和 JSON.parse 默认行为不转化函数, 会直接移除

# 浏览器存储

### 1 Storage

webStorage 主要提供了一种机制, 可以让浏览器提供一种比 cookie 更直观的 key/value 存储方式

##### 1.1 localStorage

> 本地储存 提供的是一种永久性的存储方法, 在关闭掉网页重新打开时, 存储的内容依然保留.
>
> 同一个域保存

```js
localStorage.setItem("name", "hi");
```

##### 1.2 sessionStorage

> 会话存储, 提供的是本次会话的存储, 在关闭掉会话时, 存储的内容会被清除
>
> 同一个浏览器 tag 保存

```js
sessionStorage.setItem("name", "hi");
```

##### 1.3 常见的属性和方法

> localStorage 和 sessionStorage 常见的属性和方法是一样的

- setItem(key, value): 存值
- getItem(key): 取值
- removeItem(key): 移除属性
- clear(): 清空
- length: 返回 storage 长度
- key(index): 返回值

##### 1.4 封装

```js
class HiCache {
  constructor(isLocal = true) {
    this.storage = isLocal ? localStorage : sessionStorage;
  }

  setItem(key, value) {
    if (value) this.storage.setItem(key, JSON.stringify(value));
  }

  getItem(key) {
    let value = this.storage.getItem(key);
    if (value) {
      value = JSON.parse(value);
    }
  }

  removeItem(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }

  key(index) {
    return this.storage.key(index);
  }

  length() {
    return this.storage.length;
  }
}

const localCache = new HiCache();
const sessionCache = new HiCache(false);

export {localCache, sessionCache};
```

### 2 indexDB

> 不常见, 不常用
>
> 事务型数据库系统, 基于 JS 面向对象数据库, 有点类似 NoSQL

我们能看到 DB 这个词, 就说明它其实是一种数据库(Database), 在实际开发中, 大量数据都是存取在数据库中, 前端开发其实不需要将数据存取在浏览器数据库中, 所以真的 TM 少见, 如果确实有大量数据, 可以选择 indexDB

### 3 Cookie

> Cookie: 复数形式

某些网站为了辨别用户身份而存储咋 i 用户本地终端上的数据, 浏览器会在特定的情况下携带 cookie 来发送请求, 我们可以通过 cookie 来获取一些信息

Cookie 总是保存在客户端中, 按在客户端中的存储位置, 内存 Cookie 和硬盘 Cookie, 怎么区分呢?

- 没有设置过期时间, 默认情况下 cookie 是内存 cookie, 在关闭浏览器时自动删除
- 有设置过期时间, 并且过期时间不为 0 或者负数的 cookie, 是硬盘 cookie, 需要手动或者到期时, 才会删除

# BOM-DOM

> JavaScript 有一个非常重要的运行环境就是浏览器, 而且浏览器本身又作为一个应用程序需要对其本身进行操作, 所以通常浏览器会有对应的对象模型(BOM, Browser Object Model), 我们可以将 BOM 看成是连接 JavaScript 脚本与浏览器窗口的桥梁

BOM 主要包括以下的对象模型:

- window: 包括全局属性方法, 控制浏览器窗口相关的属性方法
- location: 浏览器连接到的对象的位置(URL)
- history: 操作浏览器的历史
- document: 当前窗口操作文档的对象

### 1 window

> window 对象在浏览器中有两个身份: 1.全局对象 2.浏览器窗口对象

##### 1.1 window 作为全局对象

在浏览器中, window 对象就是之前经常提到的全局对象, 也就是我们之前提到过的 GO 对象

- 比如在全局通过 var 声明的变量, 会被添加到 GO 中, 也就是会被添加到 window 上

- 比如 window 默认给我们提供了全局的函数和类, setTimeout/Math/Date/Object 等

  ```js
  var name = "hi";
  window.setTimeout(() => {}, 2000);

  const date = new window.Date();
  console.log(date);
  ```

##### 1.2 window 作为窗口对象

事实上 window 对象上肩负的重担非常大, 它包含大量的属性和方法还有事件, 甚至是 EventTarget 继承过来的方法, 它里面大概有 60+个属性/40+个方法/30+个事件

[Window API 查询网站](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)

[Events API 查询网站](https://developer.mozilla.org/zh-CN/docs/Web/Events)

### 2 location

> Location 对象用于表示 window 上当前链接到的 URL 信息。

##### 2.1 常见属性

1. href: 当前 window 对应的超链接 URL, 整个 URL
2. protocol: 当前的协议
3. host: 主机地址
4. hostname: 主机地址(不带端口)
5. port: 端口
6. pathname: 路径
7. search: 查询字符串
8. hash: 哈希值
9. username：URL 中的 username（很多浏览器已经禁用）
10. password：URL 中的 password（很多浏览器已经禁用）

##### 2.2 常见的方法

1. assign：赋值一个新的 URL，并且跳转到该 URL 中
2. replace：打开一个新的 URL，并且跳转到该 URL 中
3. reload：重新加载页面，可以传入一个 Boolean 类型

##### 2.3 抽象实现

![](https://gitee.com/ipinga/hi-img/raw/master/img/Snipaste_2022-02-03_03-10-45.jpg)

### 4 history

> history 对象允许我们访问浏览器曾经的会话历史记录

##### 4.1 属性

1. length: 会话中的记录条数
2. state: 当前保留的状态值

##### 4.2 方法

1. back()：返回上一页，等价于 history.go(-1)
2. forward()：前进下一页，等价于 history.go(1)
3. go()：加载历史中的某一页
4. pushState()：打开一个指定的地址
5. replaceState()：打开一个新的地址，并且使用 replace

### 4 DOM

##### 4.1 浏览器架构图

![](https://gitee.com/ipinga/hi-img/raw/master/img/Snipaste_2022-02-04_16-39-01.jpg)

# 防抖节流

> 防抖和节流的概念其实最早并不是出现在软件工程中的, 防抖是出现在电子元件中, 节流出现在流体流动

JavaScript 是事件驱动的, 大量的操作会触发事件, 加入到事件队列中处理, 而对于某些频繁的事件处理会造成型嫩的损耗, 我们就可以通过防抖和节流来限制事件频繁的发生

防抖和节流的区别: **防抖是输入停止了输入便开始计时, 节流是固定时间执行**

### 1 防抖(debounce)

- 当时间触发时, 响应的函数平不会立即触发, 而是会等待一定的事件
- 当事件密集触发时, 函数的触发会被频繁的推迟
- 只有等待了一段时间也没有事件触发, 才会真正的执行响应函数

![](https://gitee.com/ipinga/hi-img/raw/master/img/Snipaste_2022-02-04_17-03-05.jpg)

防抖的应用场景很多:

1. 输入框中频繁的输入内容, 搜索或者提交信息
2. 频繁的点击按钮, 触发某个事件
3. 监听浏览器滚动事件, 完成某些特定操作
4. 用户缩放浏览器的 resize 事件

##### 1.1 函数实现

基本实现

```js
// fn外界真正执行的方法, delay停止输入之后等待的时间
function debounce(fn, delay = 500) {
  // 定义计时器, 保存上一次的定时器
  let timer = null;

  return function _debounce() {
    // 取消上一次计时器
    if (timer) clearTimeout(timer);

    // 延迟执行
    timer = setTimeout(() => {
      fn();
      timer = null;
    }, delay);
  };
}
```

this 和参数的优化

```js
function debounce(fn, delay = 500) {
  let timer = null;

  return function _debounce(...args) {
    // 元素对象调用时传入的参数 event与其他
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args); // 函数调用时绑定_debounce的this
      timer = null;
    }, delay);
  };
}
```

立即执行的优化

```js
function debounce(fn, delay = 500, immediate = false) {
  let timer = null;

  // 定义函数是否执行过了的变量
  let isInvoke = false;

  return function _debounce(...args) {
    if (timer) clearTimeout(timer);

    if (immediate && !isInvoke) {
      fn.apply(this, args);
      // 立即执行过后取反
      isInvoke = true;
      timer = null;
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
        // 延迟执行后取反
        isInvoke = false;
      }, delay);
    }
  };
}
```

取消功能

```js
function debounce(fn, delay = 500, immediate = false) {
  let timer = null;
  let isInvoke = false;

  function _debounce(...args) {
    if (timer) clearTimeout(timer);

    if (immediate && !isInvoke) {
      fn.apply(this, args);
      isInvoke = true;
      timer = null;
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
        isInvoke = false;
        timer = null;
      }, delay);
    }
  }

  // 函数也是一个对象, 当_debounce.cancel()时将计时器取消, 并将debounce中属性设为初始值
  _debounce.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    isInvoke = false;
  };

  return _debounce;
}
```

传入的函数返回值优化

- 传入回调方案

  ```js
  function debounce(fn, delay = 500, immediate = false, resultCallback) {
    let timer = null;
    let isInvoke = false;

    function _debounce(...args) {
      if (timer) clearTimeout(timer);

      if (immediate && !isInvoke) {
        const result = fn.apply(this, args);
        // 回调执行并将返回值传入
        if (resultCallback) resultCallback(result);
        isInvoke = true;
        timer = null;
      } else {
        timer = setTimeout(() => {
          const result = fn.apply(this, args);
          // 回调执行并将返回值传入
          if (resultCallback) resultCallback(result);
          isInvoke = false;
          timer = null;
        }, delay);
      }
    }

    _debounce.cancel = function () {
      if (timer) clearTimeout(timer);
      timer = null;
      isInvoke = false;
    };

    return _debounce;
  }
  ```

- promise 方案

  ```js
  function debounce(fn, delay = 500, immediate = false) {
    let timer = null;
    let isInvoke = false;

    function _debounce(...args) {
      return new Promise((resolve) => {
        if (timer) clearTimeout(timer);

        if (immediate && !isInvoke) {
          const result = fn.apply(this, args);
          resolve(result);
          isInvoke = true;
          timer = null;
        } else {
          timer = setTimeout(() => {
            const result = fn.apply(this, args);
            resolve(result);
            isInvoke = false;
            timer = null;
          }, delay);
        }
      });
    }

    _debounce.cancel = function () {
      if (timer) clearTimeout(timer);
      timer = null;
      isInvoke = false;
    };

    return _debounce;
  }
  ```

### 2 节流(throttle)

- 当事件触发时, 会执行这个事件的响应函数
- 如果这个事件会被频繁触发, 那么节流函数会按照一定的频率来执行函数
- 不管在这个中间有多少次触发这个事件, 执行函数的频繁总是固定的

节流的应用场景很多:

1. 监听页面的滚动事件
2. 鼠标移动事件
3. 用户频繁点击按钮操作
4. 游戏中的一些设计

![](https://gitee.com/ipinga/hi-img/raw/master/img/Snipaste_2022-02-04_17-09-29.jpg)

##### 2.1 函数实现

基本实现

```js
function throttle(fn, interval) {
  // 定义上一次的开始时间
  let lastTime = 0;

  // 事件触发时, 真正执行的函数
  function _throttle() {
    // 获取当前事件触发的时间
    const nowTime = new Date().getTime();
    // 定义触发剩余时间
    const remainTime = interval - (nowTime - lastTime);
    if (remainTime <= 0) {
      fn();
      // 保留上次触发的时间
      lastTime = nowTime;
    }
  }

  return _throttle;
}
```

this 和参数问题

```js
function throttle(fn, interval) {
  let lastTime = 0;
  function _throttle(...args) {
    //
    const nowTime = new Date().getTime();
    const remainTime = interval - (nowTime - lastTime);
    if (remainTime <= 0) {
      fn.apply(this, args); //
      lastTime = nowTime;
    }
  }
  return _throttle;
}
```

leading 和 tranling(第一次是否触发及最后一次是否触发)

```js
// 参数过多用对象存储
function throttle(fn, interval, options = {leading: true, trailing: false}) {
  // 解构leading, trailing
  const {leading, trailing} = options;
  let lastTime = 0;
  let timer = null;

  function _throttle(...args) {
    const nowTime = new Date().getTime();

    // 当不需要开头触发
    if (!lastTime && !leading) lastTime = nowTime;

    const remainTime = interval - (nowTime - lastTime);
    if (remainTime <= 0) {
      // 边界判断1
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      fn.apply(this, args);
      lastTime = nowTime;
      return;
    }

    // 当需要最后一次执行
    if (trailing && !timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastTime = !leading ? 0 : new Date().getTime();
        timer = null;
      }, remainTime);
    }
  }
  return _throttle;
}
```

取消功能

```js
function throttle(fn, interval, options = {leading: true, trailing: false}) {
  const {leading, trailing} = options;
  let lastTime = 0;
  let timer = null;

  function _throttle(...args) {
    const nowTime = new Date().getTime();
    if (!lastTime && !leading) lastTime = nowTime;

    const remainTime = interval - (nowTime - lastTime);
    if (remainTime <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      fn.apply(this, args);
      lastTime = nowTime;
      return;
    }
    if (trailing && !timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastTime = !leading ? 0 : new Date().getTime();
        timer = null;
      }, remainTime);
    }
  }

  // 调用取消函数_throttle.cancel()
  _throttle.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };

  return _throttle;
}
```

函数返回值

```js
function throttle(fn, interval, options = {leading: true, trailing: false}) {
  const {leading, trailing, resultCallback} = options;
  let lastTime = 0;
  let timer = null;

  function _throttle(...args) {
    return new Promise((resolve) => {
      const nowTime = new Date().getTime();
      if (!lastTime && !leading) lastTime = nowTime;

      const remainTime = interval - (nowTime - lastTime);
      if (remainTime <= 0) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        const result = fn.apply(this, args);
        if (resultCallback) resultCallback(result); // 传值回调
        resolve(result); // promise
        lastTime = nowTime;
        return;
      }
      if (trailing && !timer) {
        timer = setTimeout(() => {
          const result = fn.apply(this, args);
          if (resultCallback) resultCallback(result); // 传值回调
          resolve(result); // promise
          lastTime = !leading ? 0 : new Date().getTime();
          timer = null;
        }, remainTime);
      }
    });
  }

  _throttle.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };

  return _throttle;
}
```

# 深拷贝

前面我们学习了对象相互赋值的一些关系, 分别包括:

1. 引用的赋值: 指向同一个对象, 相互之间会影响
2. 对象的浅拷贝: 只是浅层的拷贝, 内部引入对象时, 依然会相互影响
3. 对象的深拷贝: 两个对象不再有任何关系, 不会相互影响

JSON.parse 这种深拷贝方式对于函数/Symbol 等是无法处理的, 并且如果存在对象的循环引用, 也会报错

```js
const s1 = Symbol();
const s2 = Symbol();
const hiInfo = {
  name: "hi",
  friend: {
    name: "iyunyu",
  },
  log: function () {
    console.log("I am hi");
  },
  [s1]: s2,
  inner: hiInfo,
};

const temp = JSON.stringify(hiInfo);
const iyunyuInfo = JSON.parse(temp); // 对函数/Symbol无法处理, 对循环引用报错
```

自定义深拷贝函数:

1. 自定义深拷贝的基本功能
2. 对 Symbol 的 key 进行处理
3. 其他数据类型的值进行处理: 数组/函数/Symbol/Set/Map
4. 对循环引用的处理

### 1 实现

##### 1.1 基本实现

```js
function isObject(value) {
  const valueType = typeof value;
  return value !== null && (valueType === "object" || valueType === "function");
}

function deepClone(originValue) {
  // 判断传入的值是否是一个对象类型
  if (!isObject(originValue)) {
    return originValue;
  }

  const newObject = {};

  if (typeof originValue === "object") {
    return originValue;
  }

  for (const key in originValue) {
    newObject[key] = deepClone(originValue[key]);
  }

  return newObject;
}
```

##### 1.2 优化数组类型

```js
function isObject(value) {
  const valueType = typeof value;
  return value !== null && (valueType === "object" || valueType === "function");
}

function deepClone(originValue) {
  if (!isObject(originValue)) {
    return originValue;
  }

  // 判断是否是一个数组, 是 => [], 不是 => {}
  const newObject = Array.isArray(originValue) ? [] : {};

  for (const key in originValue) {
    newObject[key] = deepClone(originValue[key]);
  }

  return newObject;
}
```

##### 1.3 优化函数类型

```js
function isObject(value) {
  const valueType = typeof value;
  return value !== null && (valueType === "object" || valueType === "function");
}

function deepClone(originValue) {
  // 判断如果是函数类型, 直接返回
  if (typeof originValue === "function") {
    return originValue;
  }

  if (!isObject(originValue)) {
    return originValue;
  }

  const newObject = Array.isArray(originValue) ? [] : {};

  for (const key in originValue) {
    newObject[key] = deepClone(originValue[key]);
  }

  return newObject;
}
```

##### 1.4 优化 Symbol

```js
function isObject(value) {
  const valueType = typeof value;
  return value !== null && (valueType === "object" || valueType === "function");
}

function deepClone(originValue) {
  // 判断如果是Symbol的value, 那么新创建一个新的Symbol
  if (typeof originValue === "symbol") {
    return Symbol(originValue.description);
  }

  if (typeof originValue === "function") {
    return originValue;
  }

  if (!isObject(originValue)) {
    return originValue;
  }

  const newObject = Array.isArray(originValue) ? [] : {};

  for (const key in originValue) {
    newObject[key] = deepClone(originValue[key]);
  }

  // 对Symbol的key进行特殊的处理
  const symbolKeys = Object.getOwnPropertySymbols(originValue);
  for (const skey of symbolKeys) {
    newObject[skey] = deepClone(originValue[skey]);
  }

  return newObject;
}
```

##### 1.5 优化 Set/Map

```js
function isObject(value) {
  const valueType = typeof value;
  return value !== null && (valueType === "object" || valueType === "function");
}

function deepClone(originValue) {
  // 判 断Set
  if (originValue instanceof Set) {
    return new Set([...originValue]);
  }
  // 判断Map
  if (originValue instanceof Map) {
    return new Map([...originValue]);
  }

  if (typeof originValue === "symbol") {
    return Symbol(originValue.description);
  }

  if (typeof originValue === "function") {
    return originValue;
  }

  if (!isObject(originValue)) {
    return originValue;
  }

  const newObject = Array.isArray(originValue) ? [] : {};

  for (const key in originValue) {
    newObject[key] = deepClone(originValue[key]);
  }

  const symbolKeys = Object.getOwnPropertySymbols(originValue);
  for (const skey of symbolKeys) {
    newObject[skey] = deepClone(originValue[skey]);
  }

  return newObject;
}
```

##### 1.6 循环引用

```js
function isObject(value) {
  const valueType = typeof value;
  return value !== null && (valueType === "object" || valueType === "function");
}

function deepClone(originValue, map = new WeakMap()) {
  if (originValue instanceof Set) {
    return new Set([...originValue]);
  }

  if (originValue instanceof Map) {
    return new Map([...originValue]);
  }

  if (typeof originValue === "symbol") {
    return Symbol(originValue.description);
  }

  if (typeof originValue === "function") {
    return originValue;
  }

  // 判断是否是对象/函数类型, 并且不为null
  if (!isObject(originValue)) {
    return originValue;
  }

  if (map.has(originValue)) {
    return map.get(originValue);
  }

  // 如果是一个对象或者数组
  const newObject = Array.isArray(originValue) ? [] : {};

  // 循环引用
  map.set(originValue, newObject);

  // 循环递归拷贝属性
  for (const key in originValue) {
    newObject[key] = deepClone(originValue[key], map);
  }

  const symbolKeys = Object.getOwnPropertySymbols(originValue);
  for (const skey of symbolKeys) {
    newObject[skey] = deepClone(originValue[skey], map);
  }

  return newObject;
}
```

# 事件总线

自定义事件总线属于一种观察者模式, 其中包括三个角色:

- 发布者(Publisher): 发出事件(Event)
- 订阅者(Subscriber)：订阅事件(Event)，并且会进行响应(Handler)
- 事件总线(EventBus): 无论是发布者还是订阅者都是通过事件总线作为中台的

当然我们可以选择一些第三方的库: Vue2 默认是带有事件总线的功能; Vue3 中推荐一些第三方库, 比如 mitt

当然我们也可以实现自己的事件总线:

- 事件的监听方法 on
- 事件的发射方法 emit
- 事件的取消监听 off

### 1 实现

```js
class HYEventBus {
  constructor() {
    this.eventBus = {};
  }

  on(eventName, eventCallback, thisArg) {
    let handlers = this.eventBus[eventName];
    if (!handlers) {
      handlers = [];
      this.eventBus[eventName] = handlers;
    }
    handlers.push({
      eventCallback,
      thisArg,
    });
  }

  off(eventName, eventCallback) {
    const handlers = this.eventBus[eventName];
    if (!handlers) return;
    const newHandlers = [...handlers];
    for (let i = 0; i < newHandlers.length; i++) {
      const handler = newHandlers[i];
      if (handler.eventCallback === eventCallback) {
        const index = handlers.indexOf(handler);
        handlers.splice(index, 1);
      }
    }
  }

  emit(eventName, ...payload) {
    const handlers = this.eventBus[eventName];
    if (!handlers) return;
    handlers.forEach((handler) => {
      handler.eventCallback.apply(handler.thisArg, payload);
    });
  }
}

const eventBus = new HYEventBus();

// main.js
eventBus.on(
  "abc",
  function () {
    console.log("监听abc1", this);
  },
  {name: "why"}
);

const handleCallback = function () {
  console.log("监听abc2", this);
};
eventBus.on("abc", handleCallback, {name: "why"});

// utils.js
eventBus.emit("abc", 123);

// 移除监听
eventBus.off("abc", handleCallback);
eventBus.emit("abc", 123);
```
