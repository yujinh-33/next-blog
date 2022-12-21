import PostItem from "./post-item";
import classes from "./posts-grid.module.css";
import type {FC, ReactNode} from "react";

interface IProps {
  posts: any[];
  children?: ReactNode;
}

const PostsGrid: FC<IProps> = (props) => {
  const {posts} = props;

  return (
    <ul className={classes.grid}>
      {posts.map((post) => (
        <PostItem key={post.slug} post={post} />
      ))}
    </ul>
  );
};

export default PostsGrid;
