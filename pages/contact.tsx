import {Fragment} from "react";
import Head from "next/head";

import ContactForm from "../components/contact/contact-form";
import {FC, ReactNode} from "react";

interface IProps {
  children?: ReactNode;
}

const ContactPage: FC<IProps> = () => {
  return (
    <Fragment>
      <Head>
        <title>Contact Me</title>
        <meta name="description" content="Send me your messages!" />
      </Head>
      <ContactForm />
    </Fragment>
  );
};

export default ContactPage;
