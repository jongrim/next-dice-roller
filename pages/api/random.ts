import { NextApiRequest, NextApiResponse } from 'next';
import * as crypto from 'crypto';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const nums = crypto.randomBytes(body.size);
  res.statusCode = 200;
  res.json({ nums: nums });
};
