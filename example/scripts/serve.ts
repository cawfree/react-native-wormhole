import 'dotenv/config';

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import appRootPath from 'app-root-path';
import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';

const wallet = ethers.Wallet.fromMnemonic(process.env.SIGNER_MNEMONIC);

const serveFixture = (scriptName: string) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const src = fs.readFileSync(path.resolve(`${appRootPath}`, 'fixtures', 'dist', scriptName));
  const signature = await wallet.signMessage(src);
  res
    .set({ 'X-Csrf-Token': signature })
    .status(200)
    .send(src);
  return;
};

(async () => {
  const port = await new Promise<number>((resolve) => {
    express()
      .use(cors({ exposedHeaders: 'X-Csrf-Token' }))
      .get('/hello', serveFixture('Hello.js'))
      .listen(process.env.PORT, () => resolve(Number.parseInt(process.env.PORT)))
  });
  console.log(`listening on ${port}`);
})();
