---
title: "ReactJS入门"
date: "2022-12-21"
image: "getting-started-reactjs.jpg"
excerpt: "用于构建用户界面的 JavaScript 库."
isFeatured: true
---

# 学习 React

用于构建用户界面的 JavaScript 库

## 第一个 React 程序

网页文件需要引入三个 JS 库文件

- react
- react-dom
- babel

如果网站中使用了 JSX 语法就必须使用 babel 编译, 否则浏览器报错, 语法错误.

```html
<body>
  <div id="root"></div>

  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

  <script type="text/babel">
    const root = ReactDOM.createRoot(document.querySelector("#root"));
    root.render(<h1>Hello World!</h1>);
  </script>
</body>
```

注意:

1. crossorigin 用于处理网站跨域问题.
2. 主要编写代码的 script 标签必须写上 `type="text/babel"`, 意思是当前 script 标签使用 babel 编译.

## 组件编写方式

#### 类组件

类组件必须继承自 `React.Component or React.PureComponent`,否则只是一个类, 而不是一个组件.

```jsx
class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <div>App</div>;
  }
}
```

#### 函数式组件

函数式组件不需要继承父类

```jsx
function App() {
  return <div>App</div>;
}
```

类组件的 render 函数或者函数式组件的返回值和函数式组件的返回值可以如下:

- React 元素
- 数组和 fragments
- Portals
- 字符串和数值类型
- ...

## JSX 语法

JSX, 是一个 JavaScript 的语法扩展, 其中可以编写任何的 JS 代码.

#### 使用变量

```jsx
class App extends React.Component {
  constructor() {
    super();
    this.state = {message: "Hello Qiyana"};
  }

  render() {
    const {message} = this.state;
    return <div>当前计数: {message}</div>;
  }
}
```

注意:

1. "状态变量" 必须保存在 this.state 中.
2. 使用变量时需要使用大括号包含`{message}`.

#### 事件绑定

由于 React 源码中给 onClick 接收的函数显示绑定了 undefined, 因此在事件绑定时, 我们不能直接传入一个函数, 避免使用 this 时发生错误.

```jsx
// 绑定方式1: bind绑定
class App extends React.Component {
  constructor() {
    super();
    this.state = {count: 0};
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.setState({count: this.state.count + 1});
  }

  render() {
    return (
      <div>
        <h4>当前计数: {this.state.count}</h4>
        <button onClick={this.increment}>+1</button>
      </div>
    );
  }
}
```

方式 1 的优势在于多次调用时不需要总是.bind(this), 但并不是最推荐的绑定方式.

```jsx
class App extends React.Component {
  constructor() {
    super();
    this.state = {count: 0};
  }

  increment = () => {
    this.setState({count: this.state.count + 1});
  };

  render() {
    return (
      <div>
        <h4>当前计数: {this.state.count}</h4>
        <button onClick={this.increment}>+1</button>
      </div>
    );
  }
}
```

方式 2(class fields)利用不知道 ES 几的新特性, 原理在于箭头函数不能绑定 this, 而使我们在函数体中使用 this 时,回去往上层函数作用域寻找 this.

```jsx
class App extends React.Component {
  constructor() {
    super();
    this.state = {count: 0};
  }

  increment() {
    this.setState({count: this.state.count + 1});
  }

  render() {
    return (
      <div>
        <h4>当前计数: {this.state.count}</h4>
        <button onClick={() => this.increment()}>+1</button>
      </div>
    );
  }
}
```

方式 3 是最推荐的绑定方式, 它的优势在于传递参数特别方便.

#### 参数传递

当我们触发事件时, React 会回调我们传入的函数, 并给函数传入一个 event 参数. 我们可以在传入函数编写时使用形参接收并传递给真正执行的函数.

```jsx
class App extends React.Component {
  btnClick(event) {
    console.log(event);
  }

  render() {
    return (
      <div>
        <button onClick={(e) => this.btnClick(e)}>点击</button>
      </div>
    );
  }
}
```

当然我们也可以不使用 event 参数. 除了 event 参数之外, 当我们还有其他额外的参数, 可以直接传入真正执行的函数`btnClick`

```jsx
class App extends React.Component {
  btnClick(event, nickname) {
    console.log(event, nickname);
  }

  render() {
    return (
      <div>
        <button onClick={(e) => this.btnClick(e, "Qiyana")}>点击</button>
      </div>
    );
  }
}
```

#### 条件渲染

React 中的条件渲染并没有相关的指令(如 vue 中的 v-if/v-else), 但是可以使用 JS 代码实现 v-if 的效果. 实现方式不止三种...(妈呀太灵活了)

```jsx
class App extends React.Component {
  constructor() {
    super();
    this.state = {isReady: false, name: "Iyunyu"};
  }

  render() {
    const {isReady, name} = this.state;
    // 方式1: if语句
    // if (isReady) return <div>准备开始比赛</div>
    // return <div>开始比赛</div>

    // 方式2: 三元表达式
    // return <div>{isReady ? <div>准备开始比赛</div> : <div>开始比赛</div>}</div>

    // 方式3: && 逻辑与
    return <div>{name && "Qiyana"}</div>;
  }
}
```

#### 列表渲染

同样的, React 中并没有实现类似 v-for 的指令, 可以使用 for 循环或者`数组高阶函数 map` 实现.

```jsx
class App extends React.Component {
  constructor() {
    super();
    this.state = {students: ["Qiyana", "Kiana"]};
  }

  render() {
    const {students} = this.state;

    return (
      <ul>
        {students.map((student) => (
          <li>{student}</li>
        ))}
      </ul>
    );
  }
}
```

## 脚手架(CLI)的使用

使用脚手架的目的是, 方便前端项目工程化.

1. 全局安装脚手架: create-react-app, `npm i create-react-app -g`.
2. 创建项目: `npx create-react-app project-name`
3. 创建 TS 项目: `npx create-react-app project-name --template typescript`

## 组件化

组件允许你将 UI 拆分为独立可复用的代码片段, 并对每个片段进行独立构思.

#### 类组件与函数式组件

代码请往顶上翻哦亲~

#### 生命周期

- constructor
- render
- componentDidMount
- componentDidUpdate
- componentWillUnmount
- shouldComponentUpdate
- getSnapshotBeforeUpdate

constructor 构造方法在组件创建实例时调用, render 函数在每一个重新渲染时调用

```jsx
class App extends Component {
  constructor() {
    super();
    this.state = {message: "App Component"};
    console.log("-----constructor");
  }

  render() {
    console.log("-----render");
    const {message} = this.state;
    return <>{message}</>;
  }
}
```

componentDidMount 方法在组件挂载完成时回调, componentDidUpdate 方法在组件状态更新完成时回调,
componentWillUnmount 方法在组件即将卸载时回调.

```jsx
class HelloWorld extends Component {
  componentDidMount() {
    console.log("-----componentDidMount");
  }

  componentDidUpdate(preProps, preState, snapshot) {
    console.log(preProps, preState, snapshot);
    console.log("-----componentDidUpdate");
  }

  componentWillUnmount() {
    console.log("-----componentWillUnmount");
  }
}
```

shouldComponentUpdate 用于 SCU 优化(性能优化), 通过返回一个布尔值来决定组件是否重新渲染

```jsx
class HelloWorld extends Component {
  shouldComponentUpdate(newProps, nextState) {
    return true; // true or false
  }
}
```

getSnapshotBeforeUpdate 用于组件渲染前将 props/state 保存起来, 可以传给 componentDidUpdate 第三个形参

```jsx
class HelloWorld extends Component {
  getSnapshotBeforeUpdate() {
    return {nickname: "Qiyana"};
  }
}
```

#### 组件嵌套

当一个应用程序过大时, 如果将所有的代码都写在一个组件时, 不可避免的此组件会过于臃肿, 因此我们可以将应用划分为一个个子组件, 可以让组件更好的开发与维护.

```jsx
class App extends Component {
  render() {
    return (
      <div>
        <Main />
        <Profile />
      </div>
    );
  }
}

class Main extends Component {
  render() {
    return <div>Main Component</div>;
  }
}

function Profile() {
  return <div>Profile Component</div>;
}
```

#### 组件通信

**父组件给子组件传递数据.** 在创建子组件实例时, 传入的属性会保存在子组件的`this.props`中.

```jsx
class App extends Component {
  constructor() {
    super();
    this.state = {nickname: "Qiyana"};
  }

  render() {
    const {nickname} = this.state;
    return (
      <div>
        <Hello nickname={nickname} />
      </div>
    );
  }
}

class Hello extends Component {
  render() {
    const {nickname} = this.props;
    return <div>昵称: {nickname}</div>;
  }
}
```

**子组件给父组件传递数据**, 父组件传递函数给子组件, 子组件发生事件点击时, 可以调用 this.props 中父组件传递过来的函数并传入参数. 这就是子组件给父组件传递数据

注意: 父组件给子组件传递的函数也需要用箭头函数包裹, 不然子组件调用时会隐式绑定的给函数绑定 props 为 this. 从而发生错误.

```jsx
class App extends Component {
  constructor() {
    super();
    this.state = {count: 0};
  }

  changeCount(count) {
    this.setState({
      count: this.state.count + count,
    });
  }

  render() {
    const {count} = this.state;
    return (
      <div>
        <h4>当前计数: {count}</h4>
        <BtnComponent changeCount={(count) => this.changeCount(count)} />
      </div>
    );
  }
}

class BtnComponent extends Component {
  changeCount(count) {
    this.props.changeCount(count);
  }

  render() {
    return (
      <div>
        <button onClick={() => this.changeCount(-1)}>-1</button>
        <button onClick={() => this.changeCount(1)}>+1</button>
      </div>
    );
  }
}
```

**非父子组件通信**, 意思是祖孙之间的数据传递.

1. 创建上下文`ThemeContext`
2. 使用 `<ThemeContext.Provider>` 将根组件包裹, 并将需要共享的数据转入 value 属性(必须是 value 属性)
3. 子孙组件使用.

   - 类组件: `HomeInfo.contextType = ThemeContext`
   - 函数式组件: ` <ThemeContext.Consumer>` 包裹并传入一个函数

4. 类组件在`this.context`中获取, 函数组件在 value 参数中获取

```jsx
import React, {Component} from "react";
const ThemeContext = React.createContext({
  /* ... */
});

export default class App extends Component {
  render() {
    return (
      <div>
        <ThemeContext.Provider value={{color: "red"}}>
          <Home />
        </ThemeContext.Provider>
      </div>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <div>
        <HomeInfo />
        <HomeBanner />
      </div>
    );
  }
}

class HomeInfo extends Component {
  render() {
    const {color} = this.context;
    return <div style={{color: color}}>HomeInfo Component</div>;
  }
}

HomeInfo.contextType = ThemeContext;

function HomeBanner() {
  return (
    <div>
      <ThemeContext.Consumer>
        {(value) => <span style={{color: value.color}}>HomeBanner Component</span>}
      </ThemeContext.Consumer>
    </div>
  );
}
```

#### 类型验证

当项目使用 TS 时, 我们又需要给我们传入子组件的函数添加类型验证, 这样可以避免后人维护时发生不可预知的错误.

```jsx
import React, {Component} from "react";
import PropTypes from "prop-types";

export default class App extends Component {
  render() {
    return (
      <div>
        <Main message={123} />
      </div>
    );
  }
}

class Main extends Component {
  render() {
    const {message} = this.props;
    return <h4>{message}</h4>;
  }
}

// 类型限制
Main.propTypes = {
  // 必传: PropTypes.number.isRequired
  message: PropTypes.number,
};

// 默认值
Main.defaultProps = {
  message: 19,
};
```

#### 插槽

React 中并没有插槽的概念, 但是却可以实现插槽的效果.

**默认插槽效果**

当在子组件双标签中传入的元素为 1 个时, children 类型是一个 React 元素, 当传入的元素 >=2 时, children 的类型是数组.

```jsx
class App extends Component {
  render() {
    return (
      <div>
        <Hello>
          <h2>你好呀, 琪亚娜!</h2>
          <h4>你好呀, 琪亚娜!</h4>
          <h5>你好呀, 琪亚娜!</h5>
        </Hello>
      </div>
    );
  }
}

class Hello extends Component {
  render() {
    const {children} = this.props;

    return (
      <div>
        {children[0]}
        {children[1]}
        {children[2]}
      </div>
    );
  }
}
```

**具名插槽效果**

我们不仅可以子组件传递一些数据, 也可以传递元素

```jsx
class App extends Component {
  render() {
    return (
      <div>
        <Hello leftSlot={<button>按钮</button>} />
      </div>
    );
  }
}

class Hello extends Component {
  render() {
    const {leftSlot} = this.props;
    return <div>{leftSlot}</div>;
  }
}
```

**作用域插槽效果**

当给子组件传递一组数据时, 我们需要由自己决定渲染元素, 但是数据却要通过子组件传递, 作用域插槽可以实现

```jsx
import {Component} from "react";

export default class App extends Component {
  constructor() {
    super();
    this.state = {titles: ["流行", "新歌", "精选"]};
  }

  render() {
    const {titles} = this.state;
    return (
      <div>
        <Hello titles={titles} renderListEl={(title) => <button>{title}</button>} />
      </div>
    );
  }
}

class Hello extends Component {
  render() {
    const {titles, renderListEl} = this.props;

    return (
      <div>
        <ul>
          {titles.map((title) => {
            return <li key={title}>{renderListEl(title)}</li>;
          })}
        </ul>
      </div>
    );
  }
}
```

#### setState

**写法**

```jsx
class App extends Component {
  constructor() {
    super();
    this.state = {message: "Qiyana"};
  }

  changeText() {
    // 写法1
    this.setState({message: "Kiana"});

    // 写法2
    this.setState((state, props) => ({message: "Kiana"}));

    // 写法3: 1 和 2 的基础上多传入一个参数(函数)
    this.setState({message: "Kiana"}, () => {
      // 当 前一个 state 的值和 后一个 state 的值合并完成之后会调用这个函数
    });
  }

  render() {
    const {message} = this.state;
    return (
      <div>
        <h4>{message}</h4>
        <button onClick={() => this.changeText()}>修改文本</button>
      </div>
    );
  }
}
```

setState 的设计是: **异步执行**, 在 React 18 之前, 当 setState 执行在 setTimeout、promise.then、document 事件等之中的回调, setState 是同步调用的. 而 React 18 之后, setState 默认都是异步调用, 即使是在上面所提到的函数中回调, 依旧是异步的调用.

为什么要设计成异步呢? 有以下优势:

1. setState 设计为异步, 可以显著的提升性能;
   - 如果每次调用 setState 都进行一次更新, 那么意味着 render 函数会被频繁调用, 界面重新渲染, 这样效率是很低的
   - 最好的办法应该是获取到多个更新，之后进行批量更新；
2. 如果同步更新了 state, 但是还没有执行 render 函数, 那么 state 和 props 不能保持同步;

#### SCU 优化

当我们调用组件中的 this.setState 方法时, 其组件的 render 方法和其子组件的 render 方法都会重新调用, 会造成性能浪费.

我们可以手动的使用 shouldComponentUpdate, 简称 SCU, 进行组件 render 方法是否需要重新执行的优化.

```jsx
class App extends Component {
  constructor() {
    super();
    this.state = {message: "Qiyana"};
  }

  changeText() {
    this.setState({message: "Qiyana"});
  }

  render() {
    const {message} = this.state;

    return (
      <div>
        <h4>{message}</h4>
        <button onClick={() => this.changeText()}>修改文本</button>
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState || this.props !== nextProps) {
      return true;
    } else {
      return false;
    }
  }
}
```

但是每一个组件我都需要自己来写 SCU 优化, 那我开发效率岂不是慢下来了, 而且也会有很多重复的代码.

不用的, 我们只需要让类组件继承自 `PureComponent`, 函数式组件使用 `memo` 函数包裹就好.

```jsx
import {PureComponent, memo} from "react";

class App extends PureComponent {
  // ...
}

const Hello = memo(function () {
  // ...
});
```

PureComponent 和 memo 内部会对两个 state/props 做浅层比较, 如果对象引用不同直接返回 true, 也就是重新渲染.

建议每一个类组件都继承自 PureComponent, 每一个函数式组件都是用 memo 包裹.

#### 数据不可变

当我们要修改 this.state 中的复杂类型数据时, 不能直接对这个对象作修改. 原因在于我们类组件继承自 PureComponent 时, 数据改变调用 setState 时, 通过浅层比较发现前一个 state 和后一个 state 是用一个对象引用时, render 函数将不重新执行.

```jsx
class App extends PureComponent {
  constructor() {
    super();
    this.state = {students: [{id: 1, name: "Qiyana"}]};
  }

  insertStudent() {
    const stu = {id: 5, name: "yaya"};
    // 不能重新执行render方法
    // this.state.students.push(stu);
    // this.setState({students: this.state.students});

    // 需要换一个对象引用
    const newStudents = [...this.state.students];
    newStudents.push(stu);
    this.setState({students: newStudents});
  }

  render() {
    const {students} = this.state;
    return (
      <div>
        {/* ul>li */}
        <button onClick={() => this.insertStudent()}>添加学生</button>
      </div>
    );
  }
}
```

#### ref

React 中不推荐我们直接使用 document 获取 DOM 元素, 某些特殊场景我们需要获取元素, 可以使用`createRef`函数创建一个对象并绑定在那个元素上.

**获取 DOM 元素**

```jsx
import {PureComponent, createRef} from "react";

class App extends PureComponent {
  constructor() {
    super();
    this.elRef = createRef();
  }

  componentDidMount() {
    console.log(this.elRef.current);
  }

  render() {
    return <div ref={this.elRef}>App Component</div>;
  }
}
```

**获取类组件实例对象**

```jsx
import {PureComponent, createRef} from "react";

class App extends PureComponent {
  constructor() {
    super();
    this.componentRef = createRef();
  }

  componentDidMount() {
    this.logMessage();
  }

  render() {
    return (
      <div>
        <Hello ref={this.componentRef} />
      </div>
    );
  }
}

class Hello extends PureComponent {
  logMessage() {
    console.log("Hello Qiyana");
  }

  render() {
    return <div>Hello</div>;
  }
}
```

**获取函数式组件**

普通的函数式组件并不能接收到 ref, 我们只能通过 forwardRef 函数转发 ref 给这个函数式组件上的某一个元素.

```jsx
import {PureComponent, createRef, forwardRef} from "react";

class App extends PureComponent {
  constructor() {
    super();
    this.componentRef = createRef();
  }

  render() {
    return (
      <div>
        <Hello ref={this.componentRef} />
      </div>
    );
  }
}

const Hello = forwardRef(function (props, ref) {
  return <div ref={ref}>Hello</div>;
});
```

#### 受控组件与非受控组件

- 一个表单, 数据是由 React 管理的就是: 受控组件
- 当表单数据是 DOM 节点管理的, 就是: 非受控组件

```jsx
class App extends PureComponent {
  constructor() {
    super();
    this.state = {inputValue: ""};
  }

  changeValue(event) {
    this.setState({inputValue: event.target.vlaue});
  }

  render() {
    const {inputValue} = this.state;

    return (
      <div>
        {/* 受控组件 */}
        <h4>受控组件的值: {inputValue}</h4>
        <input type="text" value={inputValue} onChange={(e) => this.changeValue(e)} />

        {/* 非受控组件 */}
        <input type="text" />
      </div>
    );
  }
}
```

**表单控件**

chenkbox

```jsx
class App extends PureComponent {
  constructor() {
    super();
    this.state = {
      isAgree: false,
      hobbies: [
        {value: "sing", text: "唱", isChecked: false},
        {value: "dance", text: "跳", isChecked: false},
        {value: "rap", text: "rap", isChecked: false},
      ],
    };
  }

  handleSubmitClick(event) {
    event.preventDefault();
  }

  handleAgreeChange(event) {
    this.setState({isAgree: event.target.checked});
  }

  handleHobbiesChange(event, index) {
    const hobbies = [...this.state.hobbies];
    hobbies[index].isChecked = event.target.checked;
    this.setState({hobbies});
  }

  render() {
    const {isAgree, hobbies} = this.state;

    return (
      <form onSubmit={(e) => this.handleSubmitClick(e)}>
        {/* 单选 */}
        <label htmlFor="agree">
          <input
            id="agree"
            type="checkbox"
            checked={isAgree}
            onChange={(e) => this.handleAgreeChange(e)}
          />
          同意协议
        </label>
        {/* 多选 */}
        {hobbies.map((item, index) => (
          <label htmlFor={item.value} key={item.value}>
            <input
              type="checkbox"
              id={item.value}
              checked={item.isChecked}
              onChange={(e) => this.handleHobbiesChange(e, index)}
            />
            <span>{item.text}</span>
          </label>
        ))}
        <button type="submit">注册</button>
      </form>
    );
  }
}
```

select

```jsx
class App extends PureComponent {
  constructor() {
    super();
    this.state = {fruit: ["orange"]};
  }

  handleSubmitClick(event) {
    event.preventDefault();
  }

  handleFruitChange(event) {
    const options = Array.from(event.target.selectedOptions);
    const values = options.map((item) => item.value);
    this.setState({fruit: values});
  }

  render() {
    const {fruit} = this.state;

    return (
      <form onSubmit={(e) => this.handleSubmitClick(e)}>
        <select value={fruit} onChange={(e) => this.handleFruitChange(e)} multiple>
          <option value="apple">苹果</option>
          <option value="orange">橘子</option>
          <option value="banana">香蕉</option>
        </select>

        <button type="submit">注册</button>
      </form>
    );
  }
}
```

**非受控组件应用**

```jsx
class App extends PureComponent {
  constructor() {
    super();
    this.state = {intro: "Qiyana"};

    this.inputRef = createRef();
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.inputRef.current.value);
  }

  render() {
    const {intro} = this.state;

    return (
      <div>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input type="text" ref={this.inputRef} defaultValue={intro} />
          <button type="submit">提交</button>
        </form>
      </div>
    );
  }
}
```

#### 高阶组件

高阶组件的作用类似中间件, 用于扩展组件以及减少重复的代码

- 高阶组件本身不是一个组件, 而是一个函数
- 特点:
  - 接收一个组件作为它的参数
  - 返回一个新的组件

**props 增强**

```jsx
function enhancedUserInfo(OriginComponent) {
  return class extends PureComponent {
    constructor() {
      super();
      this.state = {
        userInfo: {name: "Qiyana", level: 99},
      };
    }

    render() {
      return <OriginComponent {...this.props} {...this.state.userInfo} />;
    }
  };
}

const Hello = enhancedUserInfo(function (props) {
  return <h4>Hello: {props.name}</h4>;
});

class App extends PureComponent {
  render() {
    return (
      <div>
        <Hello />
      </div>
    );
  }
}
```

Context 共享

```jsx
import React, {PureComponent, createContext} from "react";
const ThemeContext = createContext();

function withTheme(OriginComponent) {
  return function (props) {
    return (
      <ThemeContext.Consumer>
        {(value) => <OriginComponent {...value} {...props} />}
      </ThemeContext.Consumer>
    );
  };
}

const Hello = withTheme(function (props) {
  return <h4 style={{color: props.color}}>Hello Qiyana</h4>;
});

class App extends PureComponent {
  render() {
    return (
      <div>
        <ThemeContext.Provider value={{color: "red"}}>
          <Hello />
        </ThemeContext.Provider>
      </div>
    );
  }
}
```

生命周期应用

```jsx
function logRenderTime(OriginComponent) {
  return class extends PureComponent {
    UNSAFE_componentWillMount() {
      this.beginTime = new Date().getTime();
    }

    componentDidMount() {
      this.endTime = new Date().getTime();
      const interval = this.endTime - this.beginTime;
      console.log(`当前${OriginComponent.name}页面花费了${interval}ms渲染完成!`);
    }

    render() {
      return <OriginComponent {...this.props} />;
    }
  };
}

const Detail = logRenderTime(function Detail() {
  return <div>Detail Component</div>;
});

class App extends PureComponent {
  render() {
    return (
      <div>
        <Detail />
      </div>
    );
  }
}
```

当然, HOC 也有一些缺点

- 需要在原组件上进行包裹或者嵌套, 如果大量使用 HOC, 将会产生非常多的嵌套, 这让调试变得非常困难
- HOC 可以劫持 props, 在不遵守约定的情况下也可能造成冲突

#### Portals 的应用

Portals 的作用是将 React 元素挂载到其他的根元素上.

```jsx
import React, {PureComponent} from "react";
import {createPortal} from "react-dom";

class App extends PureComponent {
  render() {
    return (
      <div>
        <h2>App Component</h2>
        <Modal>
          <h4>我是标题</h4>
          <p>我是文本!</p>
        </Modal>
      </div>
    );
  }
}

class Modal extends PureComponent {
  render() {
    return createPortal(this.props.children, document.querySelector("#modal"));
  }
}
```

#### Fragment 的使用

当我们元素多的时候需要给它们包裹一个根元素, 但有时候并不想要多一重包裹, 可以使用 Fragment 标签包裹

```jsx
import React, {PureComponent, Fragment} from "react";

class App extends PureComponent {
  render() {
    return (
      // <Fragment>
      //   <h4>App Component</h4>
      //   <p>我是组件</p>
      // </Fragment>

      <>
        <h4>App Component</h4>
        <p>我是组件</p>
      </>
    );
  }
}
```

#### 严格模式

StrictMode 是一个用来突出显示应用程序中潜在的问题的工具. 仅在开发模式下运行, 它们不会影响生产构建.

```jsx
import {StrictMode} from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

严格模式, 检测什么?

- 识别不安全的生命周期
- 使用过时的 refAPI
- 检查意外的副作用

#### 动画

在开发中, 我们想要给一个组件的显示和隐藏某种过渡动画, 可以很好的增加用户体验

- 安装: `npm install react-transition-group --save`

```css
/* style.css */
.qiyana-appear,
.qiyana-enter {
  transform: translateX(-150px);
}

.qiyana-appear-active,
.qiyana-enter-active {
  transform: translateX(0);
  transition: transform 1s ease;
}

.qiyana-exit {
  transform: translateX(0);
}

.qiyana-exit-active {
  transform: translateX(-150px);
  transition: transform 1s ease;
}
```

**CSSTransition**

```jsx
import {CSSTransition} from "react-transition-group";
import "./style.css";

class App extends PureComponent {
  constructor() {
    super();
    this.state = {isShow: true};
  }

  render() {
    const {isShow} = this.state;

    return (
      <div>
        <button onClick={() => this.setState({isShow: !isShow})}>显示/隐藏</button>
        <CSSTransition in={isShow} unmountOnExit={true} classNames="qiyana" timeout={1000} appear>
          <h4>Hello, Mengjiang</h4>
        </CSSTransition>
      </div>
    );
  }
}
```

**SwitchTransition**

```jsx
import {CSSTransition, SwitchTransition} from "react-transition-group";
import "./style.css";

class App extends PureComponent {
  constructor() {
    super();
    this.state = {isLogin: true};
  }

  render() {
    const {isLogin} = this.state;
    return (
      <SwitchTransition mode="out-in">
        <CSSTransition key={isLogin ? "exit" : "login"} classNames="login" timeout={500}>
          <button onClick={() => this.setState({isLogin: !isLogin})}>
            {isLogin ? "退出" : "登录"}
          </button>
        </CSSTransition>
      </SwitchTransition>
    );
  }
}
```

**TransitionGroup**

```jsx
import {TransitionGroup, CSSTransition} from "react-transition-group";
import "./style.css";

class App extends PureComponent {
  constructor() {
    super();
    this.state = {
      books: [
        {
          id: 111,
          name: "你不知道的JavaScript",
          price: 99,
        },
        // ...
      ],
    };
  }

  addBook() {
    const newBooks = [...this.state.books];
    newBooks.push({id: new Date().getTime(), name: "React高级程序设计", price: 99});
    this.setState({books: newBooks});
  }

  removeBook(index) {
    const newBooks = [...this.state.books];
    newBooks.splice(index, 1);
    this.setState({books: newBooks});
  }

  render() {
    const {books} = this.state;
    return (
      <div>
        <button onClick={() => this.addBook()}>添加书籍</button>
        <TransitionGroup component="ul">
          {books.map((book, index) => (
            <CSSTransition key={book.id} classNames="book" timeout={500}>
              <li>
                <span>
                  {book.name} -{book.price}
                </span>
                <button onClick={() => this.removeBook(index)}>删除书籍</button>
              </li>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    );
  }
}
```

## CSS

css 一直是 react 中一个不太方便书写的知识点.

#### 内联样式

优点:

- 样式之间不会有冲突
- 可以动态获取当前 state 中的状态

缺点:

- 写法上都需要使用驼峰标识
- 某些样式没有提示
- 大量的样式, 代码混乱
- 某些样式无法编写(比如伪类/伪元素)

```jsx
class App extends PureComponent {
  constructor() {
    super();
    this.state = {appStyle: {color: "red", fontSize: "30px"}};
  }

  render() {
    const {appStyle} = this.state;
    return (
      // <div style={{color: 'red'}}>App</div>
      <div style={appStyle}>App</div>
    );
  }
}
```

#### 普通 CSS

- 优点: 编写 CSS 方式和以前的一样
- 缺点: 没有作用域, 不灵活

```css
/* style.css */
.app {
  color: red;
}
```

```jsx
import "./style.css";
class App extends PureComponent {
  render() {
    return <div className="app">App</div>;
  }
}
```

#### CSS modules

- 优点: 解决了 css 文件作用域的问题
- 缺点:
  - 引用的类名不能使用连接符(.qiyana-title)
  - 所有的 classNama 都必须使用{style.classNama}的行式编写
  - 不方便动态来修改某些样式, 依然需要使用内联样式的方式

```css
/* style.module.css */
.app {
  color: red;
}
```

```jsx
import appStyle from "./style.module.css";

class App extends PureComponent {
  render() {
    return <div className={appStyle.app}>App</div>;
  }
}
```

#### CSS in JS

CSS 由 JS 生成而不是在外部文件中定义, 它通过 JS 来为 CSS 赋予一些能力, 包括类似于 CSS 预处理器一样的样式嵌套、函数定义、逻辑复用、动态修改状态等等

安装: `npm install styled-components`

**基本使用**

```jsx
import React, {PureComponent} from "react";
import styled from "styled-components";

const AppWrapper = styled.div`
  color: red;
  font-size: 30px;
  &:hover {
    background-color: #000;
  }
`;

class App extends PureComponent {
  render() {
    return <AppWrapper>App</AppWrapper>;
  }
}
```

**Props 传参**

```jsx
import React, {PureComponent} from "react";
import styled from "styled-components";

const AppWrapper = styled.div.attrs((props) => ({
  color: props.color, // 默认值
}))`
  font-size: ${(props) => props.size}px;
  color: ${(props) => props.color};
`;

class App extends PureComponent {
  constructor() {
    super();
    this.state = {size: 30, color: "red"};
  }

  render() {
    const {size, color} = this.state;
    return (
      <AppWrapper size={size} color={color}>
        <button onClick={() => this.setState({size: size + 2})}>字体增大</button>
        <h4>App Component</h4>
      </AppWrapper>
    );
  }
}
```

**全局主题样式**

```js
// src/assets/css/variable.js
export const promiseColor = "red";
```

```jsx
import {promiseColor} from "@/assets/css/variable.js";
const AppWrapper = styled.div.attrs({/* props默认值 */ color: "red"})`
  color: ${promiseColor};
`;
```

**继承**

```jsx
const IyunyuButton = styled.button`
  border: 1px solid red;
`;

const ButtonWrapper = styled(IyunyuButton)`
  color: red;
`;

class App extends PureComponent {
  render() {
    return <ButtonWrapper>Iyunyu</ButtonWrapper>;
  }
}
```

## 第三方库

#### craco

默认使用`create-react-app`创建的 react 项目不能修改 webpack 配置, 除非输入命令`npm run eject`弹出 webpack 所有的配置选项, 但是这样配置的方式并不方便, 而且是不可逆的弹出.

我们可以使用**craco**这个库来修改 webpack 配置

- 安装: `npm install @craco/craco@alpha`
- 修改 package.json

```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  }
}
```

- 配置 craco.config.js

```js
module.exports = {
  /* webpack config */
};
```

#### classnames

安装: `npm install classnames`

```jsx
import classNames from "classnames";
class App extends PureComponent {
  render() {
    return <div className={classNames("qiyana", {kiana: true})}>App</div>;
  }
}
```

#### normalize.css

安装: `npm install normalize.css`

```js
// index
import "normalize.css";
```

#### axios

用于网络请求

安装: `npm install axios`

基本使用

```js
import axios from "axios";
axios.get("http://xxx.cn").then((res) => {
  /* ... */
});
```

方法: **get**、**post**、...

## Redux

三大原则: 单一数据源、State 是自读的、

核心理念:

- store
- action
- reducer

#### 基本使用

**创建 store**

```js
// store/index.js
import {createStore} from "redux";

// 初始化数据
const initiaState = {name: "Qiyana", level: 99};

// 定义reducer函数: 纯函数
function reducer() {
  return initiaState;
}

export default createStore(reducer);
```

**使用 state 数据**

```js
import store from "./store";
console.log(store.getState());
```

#### 修改数据

```js
import {createStore} from "redux";

const initalState = {
  name: "Qiyana",
  level: 99,
};

function reducer(state = initalState, action) {
  switch (action.type) {
    case "change_name":
      return {...state, name: action.name};
    // case ...
    default:
      return state;
  }
}

export default createStore(reducer);
```

**修改 state 数据**

```js
import store from "./store";

const changeNameAction = (data) => ({type: "change_name", data});
// store.dispatch({type: 'change_name', name: 'Kiana'})
store.dispatch(action("Kiana"));
```

#### 订阅数据

当 state 数据发生改变时, 会自定回调 subscribe 中传入的函数, subscribe 有返回值, 是一个函数, 调用这个函数会去掉订阅

```jsx
const unsubscribe = store.subscribe(() => {
  console.log(store.getState());
});

unsubscribe();
```

#### 完整代码

**store/index.js**

```js
const reducer = require("./reducer");
const {createStore} = require("redux");
module.exports = createStore(reducer);
```

**reducer.js**

```js
const {CHANGE_NAME} = require("./constants");
const initalState = {name: "Qiyana", level: 99};

function reducer(state = initalState, action) {
  switch (action.type) {
    case CHANGE_NAME:
      return {...state, name: action.name};
    case "change_level":
      return {...state, level: action.level};
    default:
      return state;
  }
}

module.exports = reducer;
```

**store/constants.js**

```js
const CHANGE_NAME = "CHANGE_NAME";
module.exports = {CHANGE_NAME};
```

**store/actions.js**

```js
const {CHANGE_NAME} = require("./constants");
const changeNameAction = (name) => ({type: CHANGE_NAME, name});
module.exports = {changeNameAction};
```

**index.js**

```js
const store = require("./store");
const {changeNameAction} = require("./store/actions");

// 当state中的数据发生改变会自动回调subscribe传入的函数
store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch(changeNameAction("Kiana"));
```

#### react 中使用 redux

在 react 组件中使用 redux

```jsx
import React, {PureComponent} from "react";
import store from "../store";
import {changeCountAction} from "../store/actions";

class App extends PureComponent {
  constructor() {
    super();
    this.state = {count: store.getState().count};
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({count: store.getState().count});
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {count} = this.state;

    return (
      <div>
        <h4>App count: {count}</h4>
        <button onClick={() => store.dispatch(changeCountAction(1))}>+1</button>
      </div>
    );
  }
}
```

#### react-redux

组件中使用 store 的 state 数据步骤繁琐, 而且每一个组件使用时都需要重复的书写同样逻辑的代码, 我们可以封装一个高阶函数 connect 简化步骤, react-redux 所做的事情便是这样.

使用步骤:

1. 安装`npm install react-redux`
2. 主入口 index.js 文件中

```js
// ...
import {Provider} from "react-redux";
import store from "./store";

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

3. 组件中使用:

```jsx
import {connect} from "react-redux";

const mapStateToProps = (state) => ({count: state.count});
const mapDispatchToProps = (dispatch) => ({
  changeCount: (num) => dispatch(changeCountAction(num)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
```

**connect 函数的实现**

```jsx
import {PureComponent} from "react";
import {StoreContext} from "../component/Provider";
import store from "../store";

function connect(mapState, mapDispatch) {
  return function (Component) {
    class EnhancersComponent extends PureComponent {
      componentDidMount() {
        this.unsubscribe = this.context.subscribe(() => {
          this.setState({...mapState(this.context.getState())});
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        return (
          <Component
            {...this.props}
            {...mapState(store.getState())}
            {...mapDispatch(store.dispatch)}
          />
        );
      }
    }

    EnhancersComponent.contextType = StoreContext;
    return EnhancersComponent;
  };
}

export default connect;
```

**Provider 组件的实现**

```jsx
import {PureComponent} from "react";
import {StoreContext} from "../component/Provider";

function connect(mapState, mapDispatch) {
  return function (Component) {
    class EnhancersComponent extends PureComponent {
      componentDidMount() {
        this.unsubscribe = this.context.subscribe(() => {
          this.setState({...mapState(this.context.getState())});
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        return (
          <Component
            {...this.props}
            {...mapState(this.context.getState())}
            {...mapDispatch(this.context.dispatch)}
          />
        );
      }
    }

    EnhancersComponent.contextType = StoreContext;
    return EnhancersComponent;
  };
}

export default connect;
```

#### redux-thunk

可以让 dispatch 中传入一个函数, 会自动执行此传入的函数, 可以在此函数中执行网络请求的代码.

安装: `npm install redux-thunk`

**store/index.js**

```jsx
import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";

export default createStore(reducer, applyMiddleware(thunk));
```

**store/actions.js**

```js
import axios from "axios";
import {CHANGE_BANNERS, CHANGE_COUNT} from "./constants";

export const changeCountAction = (count) => ({type: CHANGE_COUNT, count});
export const changeBannersAction = (banners) => ({
  type: CHANGE_BANNERS,
  banners,
});

export const fetchBannersAction = () => {
  return function (dispatch, getState) {
    axios.get("http://123.207.32.32:8000/home/multidata").then((res) => {
      const banners = res.data.data.banner.list;
      dispatch(changeBannersAction(banners));
    });
  };
};
```

**App.js**

```jsx
import React, {PureComponent} from "react";
import {connect} from "react-redux";
import {fetchBannersAction} from "../store/actions";

export class Category extends PureComponent {
  componentDidMount() {
    this.props.fetchBanners();
  }

  render() {
    return (
      <div>
        <h4>Category Page</h4>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  // changeBanners: (banners) => dispatch(changeBannersAction(banners)),
  fetchBanners: () => dispatch(fetchBannersAction()),
});

export default connect(null, mapDispatchToProps)(Category);
```

#### redux devtool

浏览器安装插件之后

```js
import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
```

#### 模块化 store

需要使用 redux 中导出的`combineReducers`函数, 对所有的 reducer 合并

```js
import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from "redux-thunk";
import counterReducer from "./counter";
import homeReducer from "./home";

const reducer = combineReducers({
  counter: counterReducer,
  home: homeReducer,
});

export default createStore(reducer, applyMiddleware(thunk));
```

#### redux toolkit

核心 API 如下:

- configureStore: 包装 createStore 以提供配置选项和良好的默认值, 它可以组东组合你的 slice reducer, 添加你提供的任何 Redux 中中间件, redux-thunk 默认包含, 并启用 redux devtools extension
- createSlice: 接收 reducer 函数的对象、切片名称和初始状态值, 并自动生成切边 reducer, 带有相应的 actions
- createAsyncThunk: 接收一个动作类型字符串和一个返回承诺的函数, 并生成一个 pending/fulfilled/rejected 基于该承诺分派工作类型的 thunk

按装: `npm install @reduxjs/toolkit`

**store/index.js**

```jsx
import {configureStore} from "@reduxjs/toolkit";
import counterReducer from "./features/counter";
import bannersReducer from "./features/banners";

export default configureStore({
  reducer: {
    counter: counterReducer,
    banners: bannersReducer,
  },
});
```

**store/features/banners.js**

```jsx
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBannersAction = createAsyncThunk(
  "fetch/banners",
  async (extraArgs, {dispatch, getState}) => {
    const res = await axios.get("http://123.207.32.32:8000/home/multidata");
    const banners = res.data.data.banner.list;
    // 异步修改方式1
    // dispatch(changeBanners(banners));
    return banners;
  }
);

const bannersSlice = createSlice({
  name: "banners",
  initialState: {
    banners: [],
  },
  // 同步
  reducers: {
    changeBanners(state, {payload}) {
      state.banners = payload;
    },
  },
  // 异步
  extraReducers: {
    // 异步修改方式2(特别推荐)
    [fetchBannersAction.pending]() {},
    [fetchBannersAction.rejected]() {},
    [fetchBannersAction.fulfilled](state, {payload}) {
      state.banners = payload;
    },
  },
});

export const {changeBanners} = bannersSlice.actions;
export default bannersSlice.reducer;
```

#### 中间件原理

对原有的函数作拦截, 新增需要的功能, 将新的函数赋值给要拦截的函数, 这种技术叫做: **Monkey Patching**

```js
import store from "./store";

function log(store) {
  const next = store.dispatch;
  function logDispatch(action) {
    console.log("当前派发的action: ", action);
    next(action);
    console.log("派发之后的值", store.getState());
  }

  store.dispatch = logDispatch;
}

log(store);
```

**实现 redux-thunk**

```js
function thunk(store) {
  const next = store.dispatch;

  function dispatchThunk(action) {
    if (typeof action === "function") {
      action(store.dispatch, store.getState);
    } else {
      next(action);
    }
  }

  store.dispatch = dispatchThunk;
}
```

**实现 applyMiddleware**

```js
function applyMiddleware(store, ...args) {
  args.forEach((fn) => fn(store));
}

applyMiddleware(store /* ... */);
```

#### state 如何管理

至此, redux 篇章就告一段落了, 我们学习了三种 state 管理方案:

1. 组件内部管理
2. context 管理
3. redux 管理

我们开发中应该怎么样选择?(建议)

- UI 相关的组件内部可以维护的状态, 在组件内部自己来维护
- 大部分需要共享的状态, 都交给 redux 来管理和维护
- 从服务器请求的数据(包括请求的才做), 交给 redux 来维护

#### redux-hooks

**useSelector**

```jsx
import {memo} from "react";
import {useSelector} from "react-redux";

export default memo(() => {
  const {count} = useSelector((state) => ({
    count: state.counter.count,
  }));

  return <h4>当前计数: {count}</h4>;
});
```

**useDispatch**

```jsx
import React, {memo} from "react";
import {useDispatch} from "react-redux";
import {changeCountAction} from "./store/modules/counter";

export default memo(() => {
  const dispatch = useDispatch();

  return <button onClick={() => dispatch(changeCountAction(1))}>+1</button>;
});
```

**shallowEqual**

它的作用是, 默认 useSelector 监听的是整个 state, 当其他组件将 state 中的数据修改时, 所有使用了 state 中的数据的组件都会重新渲染, 需要在 useSelector 函数中传入第二个参数(函数), 可以对 state 中的数据做一个浅层比较, 当组件自身使用的数据没有发生改变时, 将不会重新渲染.

```jsx
import React, {memo} from "react";
import {useSelector, useDispatch, shallowEqual} from "react-redux";

const App = memo(() => {
  const dispatch = useDispatch();
  const {count} = useSelector((state) => ({count: state.counter.count}), shallowEqual);

  return <h4>当前计数: {count}</h4>;
});

export default App;
```

## react-router

安装: `npm install react-router-dom`

#### 基本使用

**index.js**

```jsx
import ReactDOM from "react-dom/client";
import {BrowserRouter, HashRouter} from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
```

**App.jsx**

```jsx
import React, {PureComponent} from "react";
import {Route, Routes, Link} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

class App extends PureComponent {
  render() {
    return (
      <div className="app">
        <div className="header">
          <span>Header-----</span>
          <Link to="/home">首页</Link>
          <Link to="/login">登录</Link>
        </div>
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/home" element={<Home />}></Route>
          </Routes>
        </div>
        <div className="footer">Hooter-----</div>
      </div>
    );
  }
}
```

#### 路由重定向

当 Navigate 组件一出现就会重定向到 to 中的路径映射的组件

```
import { Navigate } from 'react-router-dom'
<Route path="/" element={<Navigate to="/login" />}></Route>
```

#### Not Found

```
import NotFound from './pages/NotFound'
<Route path="*" element={<NotFound to="/login" />}></Route>
```

#### 路由嵌套

需要在 Route 标签之中嵌套 Route 标签, 占位符需要使用<Outlet/>来指定嵌套的组件放的位置

**App.jsx**

```jsx
import {Route, Routes, NavLink, Navigate} from "react-router-dom";

class App extends PureComponent {
  render() {
    return (
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/home" element={<Home />}>
            <Route path="/home" element={<Navigate to="/home/banner" />}></Route>
            <Route path="/home/banner" element={<HomeBanner />}></Route>
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
    );
  }
}
```

**Home.jsx**

```jsx
import {Link, Outlet} from "react-router-dom";

class Home extends PureComponent {
  render() {
    return (
      <div>
        <h4>Home Page</h4>
        <Link to="/home/banner">轮播图</Link>
        <Link to="/home/produce">商品列表</Link>
        <Outlet />
      </div>
    );
  }
}
```

#### JS 代码跳转路由

**函数式组件**

```jsx
import {/* Routes, Route, Link,  */ useNavigate} from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const linkToHome = (path) => {
    navigate(path);
  };

  return (
    <div>
      <button onClick={() => linkToHome("/home")}>跳转首页</button>
    </div>
  );
}
```

**类组件**

通过高阶组件的方式对类组件进行增强, 使用 useNavigate.

```jsx
import {useNavigate} from "react-router-dom";

export default function withRouter(Component) {
  return function (props) {
    const navigate = useNavigate();

    return <Component {...props} router={{navigate}} />;
  };
}

// export default withRouter(App)
```

#### 路由参数传递

**通过 useParams 传递参数**

withRouter.js

```js
import {useNavigate, useParams, useLocation, useSearchParams} from "react-router-dom";

export default function withRouter(Component) {
  return function (props) {
    const navigate = useNavigate();

    // 1. 动态路由的参数: /detail/:id
    const params = useParams();

    // 2. 查询字符串的参数: /user?name=Qiyana&age=19
    const location = useLocation(); // log(location)
    const [searchParams] = useSearchParams(); // log(searchParams.get('name'))
    const query = Object.fromEntries(searchParams);

    return <Component {...props} router={{navigate, params, location, query}} />;
  };
}
```

#### 路由配置文件

**router/index.js**

```js
export default [
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "/home",
        element: <Navigate to="/home/banner" />,
      },
      {
        path: "/home/banner",
        element: <HomeBanner />,
      },
      // ...
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
```

**App.jsx**

```jsx
import {useRoutes} from "react-router-dom";
import routes from "./router";

function App() {
  return <div>{useRoutes(routes)}</div>;
}
```

#### 路由懒加载

**router/index.js**

```js
import React from "react";
const NotFound = React.lazy(() => import("../pages/NotFound"));

export default [
  // ...
  {
    path: "*",
    element: <NotFound />,
  },
];
```

**index.js**

```js
// Suspense
root.render(
  <React.Suspense fallback={<h4>Loading...</h4>}>
    <HashRouter>
      <App />
    </HashRouter>
  </React.Suspense>
);
```

## react-hook

函数式组件存在的最大的缺陷

- 组件不会被重新渲染
- 如果页面重新渲染, 函数会被重新执行, 第二次重新执行时, 会重新给变量赋值
- 生命周期的回调函数也没有

hook 只能在函数的最外层使用, 不能在类组件中使用

#### useState

```jsx
import {useState, memo} from "react";

export default memo(function () {
  const [count, setCount] = useState(1207);
  const [banners, setBanners] = useState([]);

  return (
    <div>
      <h4>当前计数: {count}</h4>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
});
```

#### useEffect

当组件渲染完成之后会自动执行 useEffect 之中传入的函数, 第二个参数是一个数组, 数组之中的值可以是:

1. 单个值: [值 1], 当这个值发生改变时, useEffect 传入的函数会再次执行
2. 多个值: [值 1, 值 2, ...], 当其中的一个值发生改变时, 这个函数会再次执行
3. 空值: [], 只会在函数渲染值执行一次
4. 不传: 只要是重新渲染都会执行传入的回调函数

**基本使用**

```jsx
import React, {useState, useEffect, memo} from "react";

function App() {
  const [count, setCount] = useState(1);

  // useEffect(() => {}, /* [], [值], [值1, 值2, ...] */)
  useEffect(() => {
    document.title = `count: ${count}`;
  }, [count]);

  return (
    <div>
      <h4>当前计数: {count}</h4>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

export default memo(App);
```

**清除机制**

useEffect 传入的回调函数返回的回调函数会在组件重新渲染或者组件卸载之前执行

```jsx
import React, { useState, useEffect, memo } from 'react'
import store from './store'

export default memo(function () {
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {...})
    return () => unsubscribe()
  }, [])

  return <div>App</div>
})
```

**逻辑分离**

这些 useEffect 传入的函数会按照编写顺序/执行条件依次执行

```jsx
import {useState, useEffect, memo} from "react";

export default memo(function () {
  const [count, setCount] = useState(1207);

  useEffect(() => {
    document.title = `count: ${count}`;
  }, [count]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {});
    return () => unsubscribe();
  }, []);

  // Other useEffect

  return (
    <div>
      <h4>当前计数: {count}</h4>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
});
```

#### useContext

结合 createContext 一起使用, 多次 context 嵌套的时候使用更方便.

```jsx
import React, {useContext, memo, createContext} from "react";
import {UserContext, ThemeContext} from "./context";

const UserContext = createContext();
const ThemeContext = createContext();

const Hello = memo(() => {
  const user = useContext(UserContext);
  const theme = useContext(ThemeContext);

  return (
    <div>
      <p style={{color: theme.color, fontSize: theme.fontSize}}>
        昵称: {user.nickname}, 等级: {user.level}
      </p>
    </div>
  );
});

export default memo(function App() {
  return (
    <div>
      <UserContext.Provider value={{nickname: "Qiyana", level: 1207}}>
        <ThemeContext.Provider value={{color: "red", fontSize: "20px"}}>
          <Hello />
        </ThemeContext.Provider>
      </UserContext.Provider>
    </div>
  );
});
```

#### useReducer

useReducer 与 redux 无关, 是用来替代 useState 的 hook, 但是使用不多. 仅仅是用来处理一些特别特别复杂的数据, 但是如果使用 redux 便不需要使用 useReducer 了

```jsx
import React, {useReducer, memo} from "react";

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return {...state, count: state.count + 1};
    case "decrement":
      return {...state, count: state.count - 1};
    default:
      return state;
  }
}

const App = memo(() => {
  const [state, dispatch] = useReducer(reducer, {count: 1207});

  return (
    <div>
      <h4>当前计数: {state.count}</h4>
      <button onClick={() => dispatch({type: "increment"})}>+1</button>
      <button onClick={() => dispatch({type: "decrement"})}>-1</button>
    </div>
  );
});

export default App;
```

#### useCallback

会返回一个函数的 memoized(记忆的)值, 在依赖不变的情况下, 多次定义的时候, 返回的值时相同的,这个 hook 函数性能优化的点在于: 当需要将一个函数传递给子组件时, 最好使用 useCallback 进行优化, 将优化之后的函数转递给子组件

通常使用 useCallback 的目的时不希望子组件进行多次渲染, 并不是为了函数进行缓存

```jsx
import React, {memo, useState, useCallback, useRef} from "react";

const Hello = memo((props) => {
  console.log("Hello Component rerender");
  return <button onClick={() => props.increment()}>Hello Component + 1</button>;
});

export default memo(() => {
  const [count, setCount] = useState(1207);
  const [message, setMessage] = useState("Hello Qiyana");

  // const increment = () => setCount(count + 1) // 当message发生改变时, Hello组件会重新渲染
  // 但是当count的值发生改变时子组件还是会重新渲染
  // const increment = useCallback(() => {
  //   setCount(count + 1)
  // }, [count])

  // 进一步优化
  const countRef = useRef();
  countRef.current = count;
  const increment = useCallback(() => {
    setCount(countRef.current + 1);
  }, []);

  return (
    <div>
      <h2>{message}</h2>
      <button onClick={() => setMessage(Math.random())}>修改文本</button>

      <h4>当前计数: {count}</h4>
      <button onClick={increment}>+1</button>
      <Hello increment={increment} />
    </div>
  );
});
```

#### useMemo

useMemo 实际的目的也是为了进行性能的优化, 返回的是一个有记忆的值, 在依赖不变的情况下, 多次定义的时候, 返回的值时相同的

- 进行大量的计算操作, 是否有必须要每次渲染时都重新计算, 如果没有, 可以使用 useMemo
- 对子组件传递相同内容的对象时, 使用 useMemo 进行性能的优化

```jsx
import React, {memo, useState, useMemo} from "react";

function calcNumTotal(num) {
  console.log("开始计算50之内的数字和");
  let total = 0;
  for (let i = 1; i <= num; i++) {
    total += i;
  }
  return total;
}

const Hello = memo(() => {
  console.log("Hello Component rerender");
  return <div>Hello Component</div>;
});

export default memo(() => {
  const [count, setCount] = useState(1207);
  // const result = calcNumTotal(50) // 每次count发生改变时, calcNumTotal函数都会重新执行一次
  // const info = { nickname: 'Qiyana', level: 1207 } // 每次count发生改变时, 子组件都会重新渲染
  const result = useMemo(() => calcNumTotal(50), []);
  const info = useMemo(() => ({nickname: "Qiyana", level: 1207}), []);

  return (
    <div>
      <h2>计算50之内的数字和: {result}</h2>

      <h4>当前计数: {count}</h4>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <Hello info={info} />
    </div>
  );
});
```

**useCallback(fn, deps) 相当于 useMemo(() => fn, deps)**

#### useRef

useRef 返回一个 ref 对象, 返回的 ref 对象在组件的整个生命周期保持不变
最常用的 ref 是两种用法

- 引入 DOM(或者组件, 但是需要是 class 组件)元素
- 保存一个数据, 这个对象在整个生命周期冲可以保持不变

```jsx
import React, {memo, useRef, useState} from "react";
let obj = null;

export default memo(() => {
  const [count, setCount] = useState(1207);

  // 1. 绑定DOM
  const inputRef = useRef();
  const btnRef = useRef();
  const inputFocus = () => {
    console.log(btnRef.current);
    inputRef.current.focus();
  };

  // 2. 验证inputRef永远是同一个值
  console.log(obj === inputRef);
  obj = inputRef;

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button ref={btnRef} onClick={inputFocus}>
        获取焦点
      </button>

      <h4>当前计数: {count}</h4>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
});
```

#### useImperativeHandle

对父组件传过来的 ref 作一层拦截, 可以选择性的暴露 API.

```jsx
import React, {memo, useRef, forwardRef, useImperativeHandle} from "react";

const Hello = memo(
  forwardRef((props, ref) => {
    const inputRef = useRef();

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current.focus();
      },
    }));

    return <input type="text" ref={inputRef} />;
  })
);

export default memo(() => {
  const inputRef = useRef();
  const setInputRef = () => {
    inputRef.current.focus();
    // inputRef.current.value = '' 无效
  };

  return (
    <div>
      <Hello ref={inputRef} />
      <button onClick={setInputRef}>获取焦点</button>
    </div>
  );
});
```

#### useLayoutEffect

它和 useEffect 非常的相似, 如果我们希望在某些操作发生之后再更新 DOM, 那么应该将这个操作放到 useLayoutEffect 中. 它会在渲染之前先执行 useEffect 中的函数, 执行完了这个函数再执行渲染操作.

**建议先使用 useEffect 实现功能, 如果不合适, 再使用 useLayoutEffect**

```jsx
import React, {memo, useState, useLayoutEffect} from "react";

export default memo(() => {
  const [count, setCount] = useState(1207);

  useLayoutEffect(() => {
    if (count === 0) setCount(Math.random() + 1);
  });

  return (
    <div>
      <h4>当前计数: {count}</h4>
      <button onClick={() => setCount(0)}>设置Count</button>
    </div>
  );
});
```

#### 自定义 hook

本质上只是一种函数代码逻辑的抽取, 严格意义上来说, 它本身并不算 React 的特性

```jsx
import React, {memo, useState, useEffect} from "react";

function useLogCourse(componentName) {
  useEffect(() => {
    console.log(`${componentName}组件创建`);
    return () => {
      console.log(`${componentName}组件销毁`);
    };
  });
}

const Home = memo(() => {
  useLogCourse("Home");
  return <div>Home Component</div>;
});

const About = memo(() => {
  useLogCourse("About");
  return <div>About Component</div>;
});

export default memo(() => {
  const [isShow, setIsShow] = useState(true);
  const changeIsShow = () => {
    setIsShow(!isShow);
  };

  return (
    <div>
      {isShow && <Home />}
      {isShow && <About />}
      <button onClick={changeIsShow}>显示/隐藏</button>
    </div>
  );
});
```

#### useId

是一个用于生成横跨如服务器和客户端的稳定的唯一 ID 的同时避免 hydration 不匹配的 hook

```jsx
import React, {useState, useId, memo} from "react";

export default memo(() => {
  const [count, setCount] = useState(1207);
  const id = useId();
  console.log(id);

  return (
    <div>
      <h4>当前计数: {count}</h4>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
});
```

#### useTransition

可以将一些耗时的任务降低优先级, 对数据比较多的场景可以使用

```jsx
import React, {useState, useTransition, memo} from "react";
import namesArray from "./namesArray";

export default memo(() => {
  const [showNames, setShowNames] = useState(namesArray);
  const [pending, setTransition] = useTransition();

  const handleValueChange = (event) => {
    setTransition(() => {
      const keyword = event.target.value;
      const filterShowNames = namesArray.filter((item) => item.includes(keyword));
      setShowNames(filterShowNames);
    });
  };

  return (
    <div>
      <input type="text" onInput={handleValueChange} />
      <h2>用户列表: {pending && <span>Loading</span>}</h2>
      <ul>
        {showNames.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
});
```

#### useDeferredValue

接收一个值, 并返回该值的新副本, 该副本将推迟到更紧急的更新之后, 和 useTransition 的作用相似

```jsx
import React, {useState, useDeferredValue, memo} from "react";
import namesArray from "./namesArray";

export default memo(() => {
  const [showNames, setShowNames] = useState(namesArray);
  const deferredNames = useDeferredValue(showNames);

  const handleValueChange = (event) => {
    const keyword = event.target.value;
    const filterShowNames = namesArray.filter((item) => item.includes(keyword));
    setShowNames(filterShowNames);
  };

  return (
    <div>
      <input type="text" onInput={handleValueChange} />
      <h2>用户列表: </h2>
      <ul>
        {deferredNames.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
});
```
