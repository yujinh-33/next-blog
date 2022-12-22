import PostsGrid from "./posts-grid";

import classes from "./all-posts.module.css";
import type {FC, ReactNode} from "react";

interface IProps {
  posts: any[];
  children?: ReactNode;
}

const AllPosts: FC<IProps> = (props) => {
  return (
    <section className={classes.posts}>
      <h1>All Posts</h1>
      <PostsGrid posts={props.posts} />
    </section>
  );
};

export default AllPosts;
