---
title: "TailwindCSS入门"
date: "2022-12-16"
image: "getting-started-tailwindcss.jpg"
excerpt: "tailwindcss"
isFeatured: false
---

# Tailwind CSS

[官方中文文档](https://www.tailwindcss.cn/docs/installation)

## 安装

```shell
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
```

创建配置文档

```shell
npx tailwindcss init -p
```

配置 tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: []
  content: ["./pages/**/*.{js, jsx, ts, tsx}", "./components/**/*.{js, jsx, ts, tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```
