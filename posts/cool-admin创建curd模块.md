---
title: "cool-admin 创建 curd 模块"
date: "2023-02-21"
image: "getting-started-curd.jpg"
excerpt: "快速创建一个curd模块的基本步骤"
isFeatured: true
---

# cool-admin 创建 curd 模块

- 后端创建 entity、controller、config

### 后端

规范：每一个模块必须定义在 `src/module` 目录，一个模块就是一个整体，可以引用其他模块。

1. 创建 TypeORM 的 entity

```javascript
// src/module/custom/entity/custom.ts

import {EntityModel} from "@midwayjs/orm";
import {BaseEntity} from "@cool-midway/core";
import {Column} from "typeorm";

/**
 * EntityModel("模块名（数据库表名）")
 */
@EntityModel("costom_tablename")
export class CustomEntity extends BaseEntity {
  // 表字段
  @Column({comment: "这是表字段描述"})
  columnName: string;

  // ...
}
```

2. 创建后端 controller

**只有 controller 文件夹中包含 admin 文件夹才能被前端获取到数据结构。**

```javascript
// src/module/custom/controller/admin/custom

import {Provide} from "@midwayjs/decorator";
import {CoolController, BaseController} from "@cool-midway/core";
import {CustomEntity} from "../../entity/custom.ts";

/**
 * 描述
 */
@Provide()
@CoolController({
  api: ["add", "delete", "update", "info", "list", "page"],
  entity: CustomEntity, // (实体：entity导出的类)
})
export class AdminCustomController extends BaseController {
  // 可以重写以上6个接口、自定义接口、引用Service
}
```

3. 创建后端 config.ts

**位于模块的根目录，每一个模块必须拥有**

```javascript
import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    // 模块名称
    name: 'custom',
    // 模块描述
    description: '普通测试模块',
    // 中间件，只对本模块有效
    middlewares: [],
    // 中间件，全局有效
    globalMiddlewares: [],
    // 模块加载顺序，默认为0，值越大越优先加载
    order: 0,
  } as ModuleConfig;
};

```

### 前端

1. 创建前端模块文件夹`src/modules/custom`，名称自定义。
2. 登录 cool-admin，进入菜单。
3. 点击快速创建。
4. 设置菜单名称、数据模型、上级节点（可选）等。
5. 保存刷新
