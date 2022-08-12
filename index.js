'use strict';
import StreamZip from 'node-stream-zip';
import path from 'path';
import { isStream } from 'is-stream';
import unzipStream from 'unzip-stream';
import streamToArray from 'stream-to-array'
const DEFAULT_XD_THUMBNAIL_NAME = 'thumbnail.png';

async function extractThumbnail(file, { filename, filepath } = {}) {
  if (!file) {
    console.error('Missing target XD file/stream');
    return;
  }
  const targetPath = filepath ? path.resolve(filepath) : path.dirname(file); // Default to input file folder
  const targetFileName = filename ? filename : `${path.basename(file, '.xd')}.png`;
  const XDZip = new StreamZip.async({ file });
  await XDZip.extract(DEFAULT_XD_THUMBNAIL_NAME, path.resolve(targetPath, targetFileName));
  await XDZip.close();
};

async function extractThumbnailToStream(readableStream, writableStream) {
  if (!isStream(readableStream)) {
    console.error('Only accept NodeJS.ReadableStream for the first argument');
    return;
  }

  if (!isStream(writableStream)) {
    console.error('Only accept NodeJS.WritableStream for the second argument');
    return;
  }

  return new Promise((resolve, reject) => {
    readableStream
      .pipe(unzipStream.Parse())
      .on('entry', entry => {
        if (entry.path === DEFAULT_XD_THUMBNAIL_NAME) {
          entry.pipe(writableStream)
            .on('error', err => {
              readableStream.removeAllListeners('finish');
              reject(err);
            })
            .on('finish', () => {
              resolve();
            });
        } else {
          entry.autodrain();
        }
      });
  });
}

async function extractThumbnailToBuffer(readableStream) {
  if (!isStream(readableStream)) {
    console.error('Only accept NodeJS.ReadableStream for the first argument');
    return;
  }

  return new Promise((resolve, reject) => {
    readableStream
      .pipe(unzipStream.Parse())
      .on('entry', entry => {
        if (entry.path === DEFAULT_XD_THUMBNAIL_NAME) {
          streamToArray(entry, (err, parts) => {
            if (err)
              reject(err);
            const buffers = parts.map(part => Buffer.isBuffer(part) ? part : Buffer.from(part));
            resolve(Buffer.concat(buffers));
          });
        } else {
          entry.autodrain();
        }
      });
  });
}

export { extractThumbnail, extractThumbnailToStream, extractThumbnailToBuffer }
