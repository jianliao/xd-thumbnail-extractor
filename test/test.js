import test from 'ava';
import fs from 'fs';
import { extractThumbnail, extractThumbnailToStream, extractThumbnailToBuffer } from '../index.js';

fs.mkdirSync('./test/fixtures/target');

test('Default thumbnail file name should be the same as the basename of XD file', async t => {
  const baseName = 'Cards-v1.0.0';
  await extractThumbnail(`./test/fixtures/${baseName}.xd`);
  t.true(fs.existsSync(`./test/fixtures/${baseName}.png`));
});

test('Customized thumbnail filename', async t => {
  const baseName = 'Spectrum_Demo_2021-01-26-Hello_BackstopJS';
  await extractThumbnail(`./test/fixtures/${baseName}.xd`, { filename: 'test.png' });
  t.true(fs.existsSync(`./test/fixtures/test.png`));
});

test('Customized thumbnail filename with none default output path', async t => {
  const baseName = 'Cards-v1.0.0';
  await extractThumbnail(`./test/fixtures/${baseName}.xd`, { filename: 'test.png', filepath: './test/fixtures/target' });
  t.true(fs.existsSync(`./test/fixtures/test.png`));
});

test('Extract thumbnail to a different folder with default name', async t => {
  const baseName = 'Spectrum_Demo_2021-01-26-Hello_BackstopJS';
  await extractThumbnail(`./test/fixtures/${baseName}.xd`, { filepath: './test/fixtures/target' });
  t.true(fs.existsSync(`./test/fixtures/target/${baseName}.png`));
});

test('Support XD file without extension name', async t => {
  const baseName = 'Cards-v1.0.0';
  await extractThumbnail(`./test/fixtures/${baseName}`);
  t.true(fs.existsSync(`./test/fixtures/${baseName}.png`));
});

test('Extract from stream and write to another stream', async t => {
  await extractThumbnailToStream(fs.createReadStream('./test/fixtures/Cards-v1.0.0.xd'), fs.createWriteStream('./test/fixtures/target/cards.png'));
  t.true(fs.existsSync('./test/fixtures/target/cards.png'));
});

test('Extract to buffer', async t => {
  const buf = await extractThumbnailToBuffer(fs.createReadStream('./test/fixtures/Spectrum_Demo_2021-01-26-Hello_BackstopJS.xd'));
  t.true(buf.length > 0);
});

test.after.always(t => {
  fs.readdirSync('./test/fixtures')
    .filter(f => /[.]png$/.test(f))
    .map(f => fs.unlinkSync(`./test/fixtures/${f}`));

  fs.readdirSync('./test/fixtures/target')
    .filter(f => /[.]png$/.test(f))
    .map(f => fs.unlinkSync(`./test/fixtures/target/${f}`));

  fs.rmdirSync('./test/fixtures/target');
});
