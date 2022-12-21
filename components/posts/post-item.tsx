import {Fragment} from "react";
import Link from "next/link";
import Image from "next/image";

import classes from "./post-item.module.css";
import {FC, ReactNode} from "react";

interface IProps {
  post: any;
  children?: ReactNode;
}

const PostItem: FC<IProps> = (props) => {
  const {title, image, excerpt, date, slug} = props.post;

  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const imagePath = `/images/posts/${slug}/${image}`;
  const linkPath = `/posts/${slug}`;

  return (
    <li className={classes.post}>
      <Link href={linkPath}>
        <Fragment>
          <div className={classes.image}>
            <Image src={imagePath} alt={title} fill />
          </div>
          <div className={classes.content}>
            <h3>{title}</h3>
            <time>{formattedDate}</time>
            <p>{excerpt}</p>
          </div>
        </Fragment>
      </Link>
    </li>
  );
};

export default PostItem;
