import classes from "./logo.module.css";
import type {FC, ReactNode} from "react";

interface IProps {
  children?: ReactNode;
}

const Logo: FC<IProps> = () => {
  return <div className={classes.logo}>Yujinh' Next Blog</div>;
};

export default Logo;
