import {MongoClient, Sort} from "mongodb";

export async function connectDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://Yujinh:eU9xWmyBeokpz8Lf@cluster0.flnmg.mongodb.net/my-blog?retryWrites=true&w=majority"
  );

  return client;
}

export async function insertDocument(client: MongoClient, collection: string, document: any) {
  const db = client.db();
  const result = await db.collection(collection).insertOne(document);

  return result;
}

export async function getAllDocuments(
  client: MongoClient,
  collection: string,
  sort: Sort = {_id: -1}
) {
  const db = client.db();
  const documents = await db.collection(collection).find().sort(sort).toArray();
  return documents;
}
