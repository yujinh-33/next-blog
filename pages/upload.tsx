import type {FC, ReactNode} from "react";

interface IProps {
  children?: ReactNode;
}

const UploadPage: FC<IProps> = () => {
  return (
    <div>
      <h1>The Upload Page</h1>
    </div>
  );
};

export default UploadPage;
