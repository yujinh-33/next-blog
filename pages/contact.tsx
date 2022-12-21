import type {FC, ReactNode} from "react";

interface IProps {
  children?: ReactNode;
}

const ContactPage: FC<IProps> = () => {
  return (
    <div>
      <h1>The Contact Page</h1>
    </div>
  );
};

export default ContactPage;
