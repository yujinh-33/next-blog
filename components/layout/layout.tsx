import {Fragment} from "react";

import MainNavigation from "./main-navigation";
import type {FC, ReactNode} from "react";

interface IProps {
  children?: ReactNode;
}

const Layout: FC<IProps> = (props) => {
  return (
    <Fragment>
      <MainNavigation />
      <main>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
