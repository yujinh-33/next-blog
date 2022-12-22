import {connectDatabase, insertDocument} from "../../lib/db-util";
import type {NextApiRequest, NextApiResponse} from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {email, name, message} = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !message ||
      name.trim() === ""
    ) {
      res.status(422).json({message: "Invalid input."});
      return;
    }

    const newMessage: any = {
      email,
      name,
      message,
    };

    let client;

    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({message: "Could not connect to database."});
      return;
    }

    try {
      const result = await insertDocument(client, "contact", newMessage);
      newMessage._id = result.insertedId;
    } catch (error) {
      res.status(500).json({message: "Storing message failed!"});
      return;
    }

    client.close();
    res.status(201).json({message: "Successfully stored message!", data: newMessage});
  }
}

export default handler;
