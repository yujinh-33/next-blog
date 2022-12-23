---
title: "Git入门"
date: "2022-12-21"
image: "getting-started-git.jpg"
excerpt: "git是一个分布式版本控制软件，最初由林纳斯·托瓦兹创作，于2005年以GPL许可协议发布。最初目的是为了更好地管理Linux内核开发而设计。"
isFeatured: false
---

# Git

版本控制是一种软件工程技巧, 借此能在软件开发的过程中, 确保由不同人所编辑的同意程序文件都得到同步.  
**简单来说, 版本控制在软件开发中, 可以帮助程序员进行代码的追踪、维护、控制等等一系列的操作.**

解决的问题:

1. 不同版本的存储管理
2. 重大版本的备份维护
3. 恢复之前的项目版本
4. 记录项目的点点滴滴
5. 多人开发的代码合并

**集中式版本控制**

主要特点是单一的集中管理服务器, 保存所有文件的修订版本, 协同开发人员通过客户端连接到这台服务器, 取出最新的文件或者提交更新. **CVS 和 SVN 都是属于集中式版本控制系统**

**分布式版本控制**

客户端并不只提取最新版本的文件快照, 而是把代码仓库完整的镜像下载, 包括完整的历史记录. 这样一来人户移除协同工作用的服务器发生故障, 事后都可以用任何一个镜像出来的本地仓库恢复. 因为每一次的克隆操作, 实际上都是一次对代码仓库的完整备份. **git 是属于分布式版本控制系统**

## 安装

[Git 官网安装](https://git-scm.com/downloads)

- Bash 是 Windows 下的命令行工具, 可以执行 Linux 命令. 基于 CMD, 在 CMD 的基础上增添一些新的命令与功能
- CMD 是 Windows 操作系统上的命令行解释程序
- GUI 提供了一个图形用户界面来运行 git 命令

## 配置

~/.gitconfig 或 C/用户/flower/.gitconfig 文件: 只针对当前用户. 你可以传递--global 选项让 Git 读写此文件, 这会对你系统上所有的仓库生效.

#### 用户名和邮箱地址

每一个 Git 提交都会使用这些信息, 它们会写入你的每一次提交中. 可配置, 提交后不可修改

```shell
git config --global user.name "用户名"
git config --global user.email "邮箱地址"
```

#### 别名

如果不想每次都输入完整的 Git 命令, 可以通过 git config 文件来轻松的为每一个命令设置一个别名.

```shell
git config --global alias.co checkout
git config --global alias.br branch
```

## 获取 Git 仓库

我们需要一个 Git 来管理源代码, 那我需要有一个 Git 仓库

#### 初始化 Git 仓库

终端输入`git init`, 会生成一个.git 文件夹, 之后所有的文件都是提交在这个文件夹中.

```shell
git init # 初始化git仓库
git add . # 将当前目录所有的文件添加到git暂存区
git commit -m '项目初始化' # 将暂存区的所有文件提交到git仓库
git commit -a -m '项目初始化' # 是 git add .和 git commit -m '初始化项目' 二合一

git log # 查看提交记录
```

#### 克隆远程 Git 仓库

`git clong [远程仓库地址]`

## Git 常用命令

- `git init`: 初始化本地 Git 仓库.
- `git add .`: 将当前目录所有文件添加到暂存区.
- `git commit -m '提交描述'`: 将暂存区中的文件提交到本地仓库.
- `git commit -a -m '提交描述'`: 是 git add .和 git commit -m '提交描述' 二合一.
- `git status [-s:简洁模式]`: 打印当前工作区中的特殊文件的状态.
