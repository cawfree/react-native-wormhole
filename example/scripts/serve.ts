import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import appRootPath from 'app-root-path';
import fs from 'fs';
import path from 'path';

const serveFixture = (scriptName: string) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res
    .status(200)
    .send(fs.readFileSync(path.resolve(`${appRootPath}`, 'fixtures', 'dist', scriptName)));
  return;
};

(async () => {
  const port = await new Promise<number>((resolve) => {
    express()
      .use(cors())
      .get('/hello', serveFixture('Hello.js'))
      .listen(process.env.PORT, () => resolve(Number.parseInt(process.env.PORT)))
  });
  console.log(`listening on ${port}`);
})();
