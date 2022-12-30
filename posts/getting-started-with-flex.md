---
title: "Flex布局入门"
date: "2022-12-29"
image: "getting-started-flex.jpg"
excerpt: "flex 是 Flexible Box 的缩写, 意为 弹性布局, 用来为盒状模型提供最大的灵活性, 任何一个容器都可以指定为 flex 布局."
isFeatured: true
---

# flex

flex 是 Flexible Box 的缩写, 意为"弹性布局", 用来为盒状模型提供最大的灵活性, **任何一个容器都可以指定为 flex 布局**.

需要注意的是:

- 当我们为父盒子设为 flex 布局以后, 子元素的 float、clear 和 vertical-align 属性将失效.

采用 flex 布局的元素, 称为 flex 容器, 它的所有子元素自动成为容器成员成为 fle 项目, 简称项目.

**总结: 通过给父盒子添加 flex 属性, 来控制子盒子的位置和排列方式.**

## 常见父项属性

#### flex-direction

设置主轴方向

```css
.container {
  flex-direction: row; /* row-reverse | column | column-reverse */
}
```

#### justify-content

设置主轴上的子元素排列方式

```css
.container {
  justify-content: flex-start; /* flex-end | center | space-around | space-between */
}
```

#### flex-wrap

设置子元素是否换行

```css
.container {
  flex-wrap: nowrap; /* wrap */
}
```

#### align-content

设置侧轴上的子元素的排列方式(多行)

```css
.container {
  align-content: flex-start; /* flex-end | center | space-around | space-between | stretch */
}
```

#### align-items

设置侧轴上子元素的排列方式(单行)

```css
.container {
  align-items: flex-start; /* flex-end | center | stretch */
}
```

#### flex-flow

符合属性, 相当于同时设置了 flex-direction 和 flex-wrap

```css
.container {
  flex-flow: row nowrap;
}
```

## 常见子项属性

#### flex

子项目占的分数

```css
.item {
  flex: 1; /* <number> */
}
```

#### align-self

控制子项自己在侧轴的排列方式

#### order

定义子项的排列顺序(前后顺序)
