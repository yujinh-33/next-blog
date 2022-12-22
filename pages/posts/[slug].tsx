import {Fragment} from "react";
import Head from "next/head";

import PostContent from "../../components/posts/post-detail/post-content";
import {getPostData, getPostsFiles} from "../../lib/posts-util";

import type {FC, ReactNode} from "react";
import type {GetStaticPaths, GetStaticProps} from "next";
import type {PostType} from "../../lib/posts-util";

interface IProps {
  post: PostType;
  children?: ReactNode;
}

const PostDetailPage: FC<IProps> = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.post.title}</title>
        <meta name="description" content={props.post.excerpt} />
      </Head>
      <PostContent post={props.post} />
    </Fragment>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const {slug} = context.params!;
  let postData;

  try {
    postData = getPostData(slug as string);
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post: postData,
    },
    revalidate: 600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postFilenames = getPostsFiles();

  const slugs = postFilenames.map((fileName) => fileName.replace(/\.md$/, ""));

  return {
    paths: slugs.map((slug) => ({params: {slug}})),
    fallback: false,
  };
};

export default PostDetailPage;
