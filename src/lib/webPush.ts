import webpush from "web-push";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;
const privateKey = process.env.VAPID_PRIVATE_KEY as string;
const subject =
  process.env.VAPID_SUBJECT || "mailto:admin@triveni-patrika.com";

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export default webpush;
