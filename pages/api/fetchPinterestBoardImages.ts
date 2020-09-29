import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const body = JSON.parse(req.body);
  const { data } = await axios.get(body.board);
  res.statusCode = 200;
  res.send({ xml: data });
};
