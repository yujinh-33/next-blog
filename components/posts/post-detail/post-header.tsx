import Image from "next/image";

import classes from "./post-header.module.css";
import type {FC, ReactNode} from "react";

interface IProps {
  title: string;
  image: string;
  children?: ReactNode;
}

const PostHeader: FC<IProps> = (props) => {
  const {title, image} = props;

  return (
    <header className={classes.header}>
      <h1>{title}</h1>
      <Image src={image} alt={title} width={200} height={150} />
    </header>
  );
};

export default PostHeader;
