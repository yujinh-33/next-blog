import ReactDOM from "react-dom";

import classes from "./notification.module.css";
import type {FC, ReactNode} from "react";

export type StatusType = "success" | "error" | "pending";

interface IProps {
  status: StatusType;
  title: string;
  message: string;
  children?: ReactNode;
}

const Notification: FC<IProps> = (props) => {
  const {title, message, status} = props;

  let statusClasses = "";

  if (status === "success") {
    statusClasses = classes.success;
  }

  if (status === "error") {
    statusClasses = classes.error;
  }

  const cssClasses = `${classes.notification} ${statusClasses}`;

  return ReactDOM.createPortal(
    <div className={cssClasses}>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>,
    document.getElementById("notifications") as HTMLElement
  );
};

export default Notification;
