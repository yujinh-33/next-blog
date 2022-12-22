import Image from "next/image";

import classes from "./hero.module.css";
import type {FC, ReactNode} from "react";

interface IProps {
  children?: ReactNode;
}

const Hero: FC<IProps> = () => {
  return (
    <section className={classes.hero}>
      <div className={classes.image}>
        <Image
          src="/images/site/yujinh.jpg"
          alt="显示Yujnh的图像"
          fill
          priority
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        />
      </div>
      <h1>嗨, 我是 Yujinh</h1>
      <p>我的博客是关于web开发 - 特别是React相关的帖子, 并且还有部分NodeJS的帖子.</p>
    </section>
  );
};

export default Hero;
