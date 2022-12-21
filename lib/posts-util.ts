import path from "path";
import fs from "fs";

import matter from "gray-matter";

export interface PostType {
  slug: string;
  title: string;
  date: string;
  image: string;
  content: string;
  excerpt?: string;
  isFeatured?: boolean;
}

const postsDirectory = path.join(process.cwd(), "posts");

// 获取所有md文件的名称: string[]
export function getPostsFiles() {
  return fs.readdirSync(postsDirectory);
}

// 获取md文件的元数据+内容, 返回帖子数据: {...元数据, 内容, 文件名(不包含后缀)}
export function getPostData(postIdentifier: string): PostType {
  const postSlug = postIdentifier.replace(/\.md$/, "");

  const filePath = path.join(postsDirectory, `${postSlug}.md`);

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const {data, content} = matter(fileContent);

  const postData = {
    slug: postSlug,
    content,
    ...data,
  };

  return postData as PostType;
}

// 获取所有帖子数据
export function getAllPosts() {
  const postFiles = getPostsFiles();

  const allPosts = postFiles.map((fileName) => getPostData(fileName));

  const sortedPosts = allPosts.sort((postA, postB) => (postA.date > postB.date ? -1 : 1));

  return sortedPosts;
}

// 获取特色帖子数据
export function getFeaturedPosts() {
  const allPosts = getAllPosts();

  const featuredPosts = allPosts.filter((post) => post.isFeatured);

  return featuredPosts;
}
