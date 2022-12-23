import {Fragment} from "react";
import Head from "next/head";

import Hero from "../components/home-page/hero";
import FeaturedPosts from "../components/home-page/featured-posts";
import {getFeaturedPosts} from "../lib/posts-util";

import type {FC, ReactNode} from "react";
import type {GetStaticProps} from "next";
import type {PostType} from "../lib/posts-util";

interface IProps {
  featuredPosts: PostType[];
  children?: ReactNode;
}

const HomePage: FC<IProps> = (props) => {
  return (
    <Fragment>
      <Head>
        <title>Yujinh' Blog</title>
        <meta name="description" content="I post about programming and web development." />
      </Head>
      <Hero />
      <FeaturedPosts posts={props.featuredPosts} />
    </Fragment>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  console.log(context.params);

  const featuredPosts = getFeaturedPosts();

  return {
    props: {
      featuredPosts,
    },
    // revalidate: 259200,
  };
};

export default HomePage;
