---
title: "NextJS入门"
date: "2022-12-16"
image: "getting-started-nextjs.jpg"
excerpt: "NextJS 是一个基于 React 扩展的全栈框架, 在原有的 React 功能上增加了 API 功能和 预渲染功能等..."
isFeatured: true
---

# Next JS

[官方文档](https://nextjs.org/docs)

## Router

在传统的 React 中, 路由功能需要自己集成, 如: 安装 react-router-dom 库. 而在 Next 项目中, 路由功能已经集成好了. 与 React 项目中的路由功能不同的是: Next 项目路由基于文件名(pages 目录下的文件夹/文件的名称)作为路由映射, **约束式路由**.

在 React 项目中, 路由的配置是这样的:

```tsx
const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AllMeetups />}></Route>
        <Route path="favorites" element={<Favorites />}></Route>
        <Route path="new-meetup" element={<NewMeetup />}></Route>
      </Routes>
    </Layout>
  );
};
```

在 Next 项目中, 路由的配置是这样的:

![next-routing](next-routing.png)

图中包含以下路由映射:

- pages/api/\*\*: 后端 api, 文件名及接口路径, 完整路径为: /api/\*\*
- pages/index: /(域的主入口)
- pages/contact: /contact
- pages/upload: /upload
- pages/posts/index: /posts/
- pages/posts/[slug]: /posts/\*\*, 动态路由

### 约定

路由(pages 文件夹中)的约定有如下规则:

- index 文件名:文件当前位置上一层的文件夹名称路径主入口
- 404 文件名: 当请求路径与其他路径都不匹配时返回
- 普通文件名(\*\*): 文件当前位置上一层文件夹名称+文件名组成的路径
- [**]文件名: 文件当前位置上一层文件夹名称 + / +任意字符(不包含 /)组成的路径
- [...**]文件名: 文件当前位置上一层文件夹名称 + / +任意字符组成的路径

### 特殊文件/文件夹

仅在 pages 第一层目录下的特殊文件(不作为路径):

- \_app: 全局组件, 一般用于公共布局与导入公共样式;

```tsx
import Head from "next/head";
import Layout from "../components/layout/layout";

import "../styles/globals.css";
import type {AppProps} from "next/app";

export default function App({Component, pageProps}: AppProps) {
  return (
    <Layout>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
```

- \_document: 指定 HTML 文档组件, 对文档进行顺利遍布, 需要继承自 Document 类;

```tsx
import Document, {Html, Head, Main, NextScript} from "next/document";

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <div id="notifications"></div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

## 静态生成/服务端生成

功能作用: SEO、页面需要预渲染或者在服务端生成页面. 只能在页面组件中使用, 在以下的三个函数中的代码只会在服务端执行, 不会在客户端中出现, 可以放心与数据库/JSON 文件交互.

静态生成(函数)

- getStaticProps
- getStaticPaths

服务端生成(函数)

- getServerSideProps

### getStaticProps

在构建过程中生成静态的页面. 当被请求时, 返回静态页面, 省去获取数据的时间

```tsx
export const getStaticProps: GetStaticProps = async (context) => {
  // context.params 可以获取路径参数, key => [key]/[...key], value => /contact/**中的**
  // 一般动态路由页面中才使用

  // 获取数据的代码... 网络请求/读取文件/数据库交互等

  return {
    props: {
      /* ... */
    }, // any, props中的所有数据会被传入页面组件(同一文件内)中的props
    revalidate: 1207, // 数字, 重新生成静态页面时间, 单位(秒), 项目部署后当请求到达时计数
    notFound: true, // 布尔值, 为真, 重定向至404页面
    redirect: "/**", // 字符串(有效路径), 重定向至字符串值路径页面中
  };
};
```

### getStaticPaths

当页面为动态组件页面, getStaticProps 便不能智能生成所需要的页面, 这时候就需要 getStaticPaths 函数辅助生成.

```tsx
export const getStaticProps = (context) => {
  // context.params 可以获取路径参数, key => [key]/[...key], value => /contact/**中的**
  // 获取数据的代码... 网络请求/读取文件/数据库交互等

  return {
    props: {
      /* ... */
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {params: {slug /* 当前文件命名: [slug]/[...slug] */: "s1"}},
      {params: {slug /* 当前文件命名: [slug]/[...slug] */: "s2"}},
      {params: {slug /* 当前文件命名: [slug]/[...slug] */: "s3"}},
    ],

    // fallback: boolean/"blocking"
    // paths.find((item) => {
    //   // context.params.slug in getStaticProps arg context
    //   return item.params.slug === context.params.slug;
    // });
    // false, 不做任何措施
    // true, 生成一个新页面(不阻塞页面的返回, 需要在组件中判断)
    // 'blocking', 生成一个新页面(会阻塞页面的返回)
    fallback: true,
  };
};
```

### getServerSideProps

与静态生成不同的是, 不会预渲染, 会在每一次请求到达时执行这个函数. 参数/返回值和 getStaticProps 的参数/返回值 作用相似, 只不过返回值中不能设置 revalidate.

```tsx
const getServerSideProps: GetServerSideProps = async (context) => {
  // context.params 可以获取路径参数, key => [key]/[...key], value => /contact/**中的**
  // 获取数据的代码... 网络请求/读取文件/数据库交互等

  return {
    props: {
      /* any */
    },
    notFound: true, // boolean
    redirect: "/**", // 字符串(有效路径), 重定向至字符串值路径页面中
  };
};
```

### 案例 1

getStaticProps 与 getStaticPaths 在 pages/posts/[slug].tsx 文件中

```tsx
import type {GetStaticProps, GetStaticPaths} from "next";
import type {FC, ReactNode} from "react";

interface PropsType {
  loadedPostData: string;
  children?: ReactNode;
}

const PostDetail: FC<PropsType> = (props) => {
  const {loadedPostData} = props;

  if (!loadedPostData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{loadedPostData.title}</h1>
      <p>{loadedPostData.content}</p>
    </div>
  );
};

export const getStaticProps: GetStaticProps = (context) => {
  const {slug} = context.params;

  // 通过 slug 值在数据库或者文件中获取 postData
  const postData = {
    /* title, content */
  };

  if (!postData) {
    return {
      notFound: true, // 或者使用 redirect 重定向至有效页面
    };
  }

  return {
    props: {
      loadedPostData: postData,
    },
    revalidate: 10, // 请求到达后 10秒重新生成
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // 通过请求数据库或者JSON文件中的posts获得所有(或者部分)post的id
  const ids = ["p1", "p2", "p3"];

  return {
    paths: ids.map((id) => ({params: {slug: id}})),
    fallback: true,
  };
};

export default PostDetail;
```

### 案例 2

```tsx
import type {GetServerSideProps} from "next";
import type {FC, ReactNode} from "react";

interface PropsType {
  loadedPostData: string;
  children?: ReactNode;
}

const PostDetail: FC<PropsType> = (props) => {
  const {loadedPostData} = props;

  if (!loadedPostData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{loadedPostData.title}</h1>
      <p>{loadedPostData.content}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = (context) => {
  const {slug} = context.params;

  // 通过 slug 值在数据库或者文件中获取 postData
  const postData = {
    /* title, content */
  };

  if (!postData) {
    return {
      notFound: true, // 或者使用 redirect 重定向至有效页面
    };
  }

  return {
    props: {
      loadedPostData: postData,
    },
  };
};

export default PostDetail;
```

## 内置组件

### Head

可以给组件页面设置**标题**, **元数据**等等...

```tsx
import Head from "next/head";
import {Fragment} from "react";
import type {FC} from "react";

const HomePage: FC = () => {
  return (
    <Fragment>
      <Head>
        <title>Yujinh' Blog</title>
        <meta name="description" content="I post about programming and web development." />
      </Head>
      <main>...</main>
    </Fragment>
  );
};

export default HomePage;
```

效果

![设置header数据](set-head-data.png)

### Image

默认情况下, 浏览器加载图片是按照原大小加载, 现如今一张图片大小已经突破 1M 以上, NextJS 是针对生产环境开发的框架, 其 Image 组件对原生的 img 标签进行了优化, 针对于**图片大小**, **懒加载**等.

```tsx
import Image from "next/image";
import {Fragment} from "react";
import type {FC} from "react";

const HomePage: FC = () => {
  return (
    <Fragment>
      <Image src="图片路径" alt="标题" width={200} height={200} />
    </Fragment>
  );
};

export default HomePage;
```

部分常用属性:

- fill 布尔值, 使图像填充父元素, 父元素必须分配 position: "relative"、position: "fixed"或 position: "absolute"样式. **只能在 Image 上设置 fill 或者 width/height**
- sizes: 一个字符串, 提供有关图像在不同断点处的宽度信息.

### Link

导航标签, 对地址栏修改, 并展示对应映射的页面, 但**不刷新网页**.

```tsx
import Link from "next/link";
import {Fragment} from "react";
import type {FC} from "react";

const HomePage: FC = () => {
  return (
    <Fragment>
      <Link href="页面路由" replace={true{/* false */}}></Link>
    </Fragment>
  );
};

export default HomePage;
```

## API 路由

前面说过, NextJS 是一个全栈框架, 这意味着我们可以在 Next 项目中编写后端的代码, 并且前端后端运行在同一个域中. **NextJS 中的 API 路由代码对用户是不可见的**.

在 pages 文件夹中有一个特殊的文件夹 api, 用于定义数据接口的代码必须写在 api 文件夹中的某一个文件上, 这是约定. 另外, api 文件中的文件命名的作用与路由页面组件一致

```ts
// 在 pages/api/feedback.ts 文件
// api routing: /api/feedback
import type {NextApiRequest, NextApiResponse} from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // req.body // 请求体数据
  // req.query // 查询数据
  res.status(200).json({message: "Hello NextJS!"});
}

export default handler;
```
