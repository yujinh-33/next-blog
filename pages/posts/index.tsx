import AllPosts from "../../components/posts/all-posts";
import {getAllPosts} from "../../lib/posts-util";

import type {FC, ReactNode} from "react";
import type {GetStaticProps} from "next";
import type {PostType} from "../../lib/posts-util";

interface IProps {
  posts: PostType[];
  children?: ReactNode;
}

const AllPostsPage: FC<IProps> = (props) => {
  return <AllPosts posts={props.posts} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = getAllPosts();

  return {
    props: {
      posts: allPosts,
    },
  };
};

export default AllPostsPage;
