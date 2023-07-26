// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  if (!req.query?.id) {
    return res.status(400).json({ message: "missing id" });
  }
  await res.unstable_revalidate("/idea/" + req.query.id);
  return res.status(200).json({ message: "revalidate success" });
}
