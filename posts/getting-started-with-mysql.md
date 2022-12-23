---
title: "MySQL入门"
date: "2022-12-21"
image: "getting-started-mysql.jpg"
excerpt: "MySQL HeatWave. MySQL数据库服务是一个完全托管的数据库服务，可使用世界上最受欢迎的开源数据库来部署云原生应用程序。 它是百分百由MySQL原厂开发，管理和提供支持"
isFeatured: false
---

# MySQL

## 数据类型

### 数字类型

- int
- float
- double
- decimal(位数, 小数点)

### 日期类型

- timestamp
- date
- datetime

### 字符串类型

- varchar
- char

## 表约束

### 主键

```sql
create table if not exists iu(
  id int primary key not null auto_increment,
  ...
)
```

### NOT NULL

```sql
create table if not exists iu(
  id int primary key not null auto_increment,
  ...
)
```

### UNIQUE

```sql
create table if not exists iu(
  ...,
  phone varchar(20) unique,
  ...
)
```

### DEFAULT

```sql
create table if not exists iu(
  ...,
  avatar varchar(50) default 'http://xxx.xxx/xxx',
  createTime timestamp default current_timestamp,
  ...
)
```

### ON UPDATE

```sql
create table if not exists iu(
  ...,
  updateTime timestamp default current_timestamp
    on update current_timestamp,
  ...
)
```

### AUTO_INCREMENT

```sql
create table if not exists iu(
  id int primary key not null auto_increment,
  ...
)
```

### 外键(FOREIGN KEY)

#### 设置外键

```sql
create table if not exists iu(
  ...,
  brand_id int,
  foreign key(brand_id) references brand(id)
)

# 当表中已经存在需要设置外键的列, 可以直接添加外键
alter table products add foreign key(brand_id) references brand(id);
```

#### 修改外键的行为

```sql
# restrict 限制
# cascade 更新会更新对应的记录, 删除会删除对应的记录
# set null 删除会给记录设置为null

# 1.获取当前表创建时的sql语句
show create table `products`;

# 2.删除外键
alter table `products` drop foreign key products_ibfk_1;

# 3.重新设置外键
alter table `products` add foreign key(brand_id) references brand(id)
on update cascade
on delete restrict;
```

### 联合主键

```sql
create table if not exists iu(
  stu_id int not null,
  cou_id int not null,
  ...,
  primary key (stu_id, cou_id)
)
```

## DDL

数据定义语言, 对数据库/表进行: 创建、删除、修改等操作

```sql
# 查看所有的数据库
show databases;

# 选择某一个数据库
use `iu`;

# 查看当前正在使用的数据库
select database();
```

### 创建数据库

```sql
# 创建数据库
create database `iu`;
create database if not exists `iu`;

# 指定编码
create database if not exists `iu` default
character set utf8mb4
collate utf8mb4_0900_ai_ci;
```

### 删除数据库

```sql
drop database if exists `iu`;
```

### 修改数据库编码

```sql
alter database iu character set = utf8 collate = utf8mb4_0900_ai_ci;
```

### 查看表

```sql
show tables;
```

### 新建表

```sql
create table if not exists `iu`(
  `name` varchar(10),
  `level` int
);
```

### 删除表

```sql
drop table if exists `iu`;
```

### 修改表

#### 修改表名称

```sql
alter table `users` rename to `user`;
```

#### 新增表字段

```sql
alter table `user` add `updateTime` timestamp;
```

#### 修改字段名称

```sql
alter table `user` change `phoneName` `phone` varchar(20);
```

#### 修改字段类型

```sql
alter table `user` modify `p` varchar(30);
```

#### 删除字段

```sql
alter table user drop `age`;
```

### 查看表结构

```sql
# 查看结构
desc iu;

# 查看创建表的sql语句
show create table iu;
```

## DML

数据操作语言, 对表进行添加、删除、修改等操作

### 添加数据

```sql
# 字段: id、name、phone、createTime、updateTime
insert into `user`
values (1, 'iu', '18012345678', '2001-11-02', '2022-10-01');

insert into `user` (`name`, phone, createTime, updateTime)
values ('iyunyu', '13312345678', '2001-11-02', '2022-10-01');
```

### 删除数据

```sql
delete from `user`;
delete from `user` where id = 1;
```

### 修改数据

```sql
update `user` set `name` = 'qiyana', `phone` = '20011207'
update `user` set `name` = 'qiyana', `phone` = '20011207' where id = 1;
```

## DQL

从数据库冲查询记录

```sql
# 查询表中的所有字段和所有数据
select * from products;

# 指定字段
select id, title, price from products;

# 别名
select title as phoneTitle from products;
```

### WHERE

#### 比较运算符

```sql
# =、>、<、!=、<=、>=
select * from products where brand = '苹果';
```

#### 逻辑运算符

```sql
# &&、||
select * from products where price >= 1000 && price <= 2000;
select * from products where price >= 1000 || brand = '苹果';
select * from products where brand is null;
```

#### 模糊查询

```sql
# %代表任意多个字符, _代表单个任意字符
select * from products where title like '%M%';
select * from products where title like '_p%';
```

#### 合并或(IN)

```sql
# 等价于
# select * from products where brand = '华为'
# || brand = '小米'
# || brand = '苹果';

select * from products where brand in ('华为', '小米', '苹果');
```

### 排序(ORDER BY)

结果排序

```sql
# asc 升序、desc 降序

select * from products
where brand in ('华为', '小米', '苹果')
order by price asc, score desc;
```

### 分页查询

```sql
# limit 代表搜索的条数, offset 代表从第几条开始查询(不包含这个第几条)

select * from products limit 20 offset 0;
select * from products limit 0 20; # 等价于 limit 20 offset 0
```

### 聚合函数

先将查询到的数据当成一组数据, 再计算, 最后返回一条数据

```sql
# 求和: sum
select sum(price) from products where brand = '苹果';

# 平均: avg
select avg(price) from products where brand = '苹果';

# 最大/小值: max/min
select max(price) from products where brand = '苹果';

# 个数: count
select count(*) from products where brand = '苹果';
select count(distinct price) from products; # distinct 去除重复
```

### 分组(GROUP BY)

```sql
select brand, avg(price), count(distinct price)
from products group by brand;

# 案例: 将上一条语句查询到的数据进行筛选, 找出平均值大于等于 2000 的手机品牌
# having 对分组查询到的数据进行筛选

select brand, avg(price) as avgPrice, count(distinct price)
from products group by brand having avgPrice > 2000;
```

### 多表查询(JOIN)

#### 左连接

```sql
# 获取左表中与右表有联系的数据, 以左表为主.
select * from products left join brand on products.brand_id = brand.id;
# 获取左表中与右表没有联系的数据, 以左表为主.
select * from products left join brand on products.brand_id = brand.id where brand.id is null;
```

#### 右连接

以右表为主.

```sql
# 获取右表中与左表有联系的数据, 以右表为主.
select * from products right join brand on products.brand_id = brand.id;
# 获取右表中与左表没有有联系的数据, 以右表为主.
select * from products right join brand on products.brand_id = brand.id where products.brand_id is null;
```

#### 内连接

```sql
# 获取左表中与右表有联系的数据
select * from products join brand on products.brand_id = brand.id;
```

#### 全连接

```sql
# 获取所有的数据
(select * from products left join brand on products.brand_id = brand.id) UNION
(select * from products right join brand on products.brand_id = brand.id);

# 获取所有没有联系的数据
(select * from products left join brand on products.brand_id = brand.id where brand.id is null) UNION
(select * from products right join brand on products.brand_id = brand.id where products.brand_id is null);
```

### 多对多查询

**查询所有有选择课程的学生, 选择了哪些课程**

```sql
select * from students as stu
join students_select_courses as ssc on stu.id = ssc.student_id
join courses as cs on ssc.course_id = cs.id;
```

**查询所有学生的选课情况**

```sql
select * from students as stu
left join students_select_courses as ssc on stu.id = ssc.student_id
left join courses as cs on ssc.course_id = cs.id;
```

**哪些学生没有选择**

```sql
select * from students as stu
left join students_select_courses as ssc on stu.id = ssc.student_id
left join courses as cs on ssc.course_id = cs.id
where cs.id is null;
```

**哪些课程没有被选择**

```sql
select * from students as stu
right join students_select_courses as ssc on stu.id = ssc.student_id
right join courses as cs on ssc.course_id = cs.id
where stu.id is null;
```

**某一个学生的选课情况**

```sql
select stu.id id, stu.name stuName, stu.age stuAge, cs.id csId, cs.name csName, cs.price csPrice from students as stu
left join students_select_courses as ssc on stu.id = ssc.student_id
left join courses as cs on ssc.course_id = cs.id
where stu.id = 1;
```

### 查询数据转换 Array or JSON

#### JSON

```sql
select
  products.id as id, products.title as title, products.price as price,
	json_object('id', brand.id, 'name', brand.name, 'website', brand.website) as brand
from products
left join brand on products.brand_id = brand.id;
```

#### Array

获取 brand 表中在 products 表中存在的手机

```sql
select brand.id as id, brand.name as name, brand.website as website,
	json_arrayagg(json_object('id', products.id, 'title', products.title, 'price', products.price)) as phone
from products
left join brand on products.brand_id = brand.id
group by brand.name having brand.id is not null;
```

获取已选课学生的选课情况并分组

```sql
select
  stu.id,
	stu.name,
	stu.age,
	json_arrayagg(json_object('id', cs.id, 'name', cs.name, 'price', cs.price)) as courses
from students as stu
join students_select_courses as ssc on stu.id = ssc.student_id
join courses as cs on ssc.course_id = cs.id
group by stu.id;
```

## DCL

对数据库、表格的权限进行相关访问控制操作
