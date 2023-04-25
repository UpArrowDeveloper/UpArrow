// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  try {
    await res.unstable_revalidate(`/stock/${req.query.ticker}`);
    return res.status(200).json({ message: 'revalidate success' });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: 'revalidate failed but run' });
  }
}
