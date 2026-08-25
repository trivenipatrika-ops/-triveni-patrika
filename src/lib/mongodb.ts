import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(
      new Error("Missing environment variable: MONGODB_URI")
    );
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect().catch((err) => {
      clientPromise = null;
      throw err;
    });
  }

  return clientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db("triveni_patrika");
}
