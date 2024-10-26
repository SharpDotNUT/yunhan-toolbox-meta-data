
// download https://github.com/DGP-Studio/Snap.Metadata/archive/refs/heads/main.zip

import { createWriteStream } from 'fs';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream';

const url = 'https://github.com/DGP-Studio/Snap.Metadata/archive/refs/heads/main.zip';

pipeline(
  (await fetch(url)).body,
  createGunzip(),
  createWriteStream('meta.zip'),
  (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
  }
})
.then(() => {
  console.log('Download complete');
  process.exitCode = 0; 
})
