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
      // जुड़ने में गड़बड़ी आए तो अगली बार दोबारा कोशिश हो सके,
      // और यह गड़बड़ी पूरे प्रोग्राम को क्रैश न करे
      clientPromise = null;
      throw err;
    });
  }

  return clientPromise;
}

export default getClientPromise();

export async function getDb() {
  const client = await getClientPromise();
  return client.db("triveni_patrika");
}
