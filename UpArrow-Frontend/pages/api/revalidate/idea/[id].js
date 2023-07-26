// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  console.log("req.params : ", req.params);
  console.log("req.query : ", req.query);
  console.log("req.body : ", req.body);
  if (!req.query?.id) {
    return res.status(400).json({ message: "missing id" });
  }
  await res.unstable_revalidate("/idea/" + req.query.id);
  return res.status(200).json({ message: "revalidate success" });
}
