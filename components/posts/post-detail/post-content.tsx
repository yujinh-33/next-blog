import Image from "next/image";

import ReactMarkdown from "react-markdown";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {atomDark} from "react-syntax-highlighter/dist/cjs/styles/prism";

import PostHeader from "./post-header";
import classes from "./post-content.module.css";
import type {FC, ReactNode} from "react";
import type {PostType} from "../../../lib/posts-util";

interface IProps {
  post: PostType;
  children?: ReactNode;
}

const PostContent: FC<IProps> = (props) => {
  const {post} = props;
  const imagePath = `/images/posts/${post.slug}/${post.image}`;

  const customComponents = {
    p(paragraph: any) {
      const {node} = paragraph;

      if (node.children[0].tagName === "img") {
        const {properties} = node.children[0];

        return (
          <div className={classes.image}>
            <Image
              src={`/images/posts/${post.slug}/${properties.src}`}
              alt={properties.alt}
              fill
              sizes="(max-width: 375px) 100vw,
              (min-width: 376px) 50vw,
              33vw"
            />
          </div>
        );
      }

      return <p>{paragraph.children}</p>;
    },
    code(code: any) {
      const {className, children} = code;
      const language = className.replace("language-", "");

      return <SyntaxHighlighter style={atomDark} language={language} children={children} />;
    },
  };

  return (
    <article className={classes.content}>
      <PostHeader title={post.title} image={imagePath} />
      <ReactMarkdown components={customComponents}>{post.content}</ReactMarkdown>
    </article>
  );
};

export default PostContent;
