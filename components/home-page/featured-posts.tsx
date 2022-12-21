import PostsGrid from "../posts/posts-grid";

import classes from "./featured-posts.module.css";
import type {FC, ReactNode} from "react";

interface IProps {
  posts: any[];
  children?: ReactNode;
}

const FeaturedPosts: FC<IProps> = (props) => {
  return (
    <div className={classes.latest}>
      <h2>特色帖子</h2>
      <PostsGrid posts={props.posts} />
    </div>
  );
};

export default FeaturedPosts;
