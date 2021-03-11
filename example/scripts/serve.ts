import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

const serveBasicScript = () => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res.status(200).send(`
hello, world
  `);
  return;
};

(async () => {
  const port = await new Promise<number>((resolve) => {
    express()
      .use(cors())
      .get('/', serveBasicScript())
      .listen(process.env.PORT, () => resolve(Number.parseInt(process.env.PORT)))
  });
  console.log(`listening on ${port}`);
})();
