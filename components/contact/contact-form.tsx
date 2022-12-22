import {useState, useEffect, useRef} from "react";

import Notification from "../ui/notification";
import classes from "./contact-form.module.css";

import type {FC, ReactNode, FormEventHandler} from "react";
import type {StatusType} from "../ui/notification";

interface IProps {
  children?: ReactNode;
}

async function sendContactData(contactDetails: {email: string; name: string; message: string}) {
  const response = await fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify(contactDetails),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }
}

const ContactForm: FC<IProps> = () => {
  const [requestStatus, setRequestStatus] = useState<StatusType | null>(null);
  const [requestError, setRequestError] = useState(null);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (requestStatus === "success" || requestStatus === "error") {
      const timer = setTimeout(() => {
        setRequestStatus(null);
        setRequestError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [requestStatus]);

  const sendMessageHandler: FormEventHandler = async (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current!.value;
    const enteredName = nameInputRef.current!.value;
    const enteredMessage = messageInputRef.current!.value;

    setRequestStatus("pending");

    try {
      await sendContactData({
        email: enteredEmail,
        name: enteredName,
        message: enteredMessage,
      });

      setRequestStatus("success");

      emailInputRef.current!.value = "";
      nameInputRef.current!.value = "";
      messageInputRef.current!.value = "";
    } catch (error: any) {
      setRequestError(error.message);
      setRequestStatus("error");
    }
  };

  let notification;

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "Sending message...",
      message: "Your message is on its way!",
    };
  }

  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "Success!",
      message: "Message sent successfully!",
    };
  }

  if (requestStatus === "error") {
    notification = {
      status: "error",
      title: "Error!",
      message: requestError,
    };
  }

  return (
    <section className={classes.contact}>
      <h1>How can I help you?</h1>
      <form className={classes.form} onSubmit={sendMessageHandler}>
        <div className={classes.controls}>
          <div className={classes.control}>
            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" required ref={emailInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" required ref={nameInputRef} />
          </div>
        </div>
        <div className={classes.control}>
          <label htmlFor="message">Your Message</label>
          <textarea id="message" rows={5} ref={messageInputRef}></textarea>
        </div>
        <div className={classes.actions}>
          <button>Send Message</button>
        </div>
      </form>
      {notification && (
        <Notification
          status={notification.status as StatusType}
          title={notification.title}
          message={notification.message as string}
        />
      )}
    </section>
  );
};

export default ContactForm;
