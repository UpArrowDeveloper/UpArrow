// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  console.log('res : ', res);
  await res.unstable_revalidate('/');
  await res.unstable_revalidate('/stock');
  await res.unstable_revalidate('/idea');
  await res.unstable_revalidate('/investor');
  return res.status(200).json({ message: 'revalidate success' });
}
