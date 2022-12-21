import Link from "next/link";
import Logo from "./logo";

import classes from "./main-navigation.module.css";
import type {FC, ReactNode} from "react";

interface IProps {
  children?: ReactNode;
}

const MainNavigation: FC<IProps> = () => {
  return (
    <header className={classes.header}>
      <Link href="/">
        <Logo />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/posts">所有帖子</Link>
          </li>
          <li>
            <Link href="/contact">联系我们</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
