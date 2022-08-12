#!/usr/bin/env node
'use strict';

import { Command } from 'commander';
import ora from 'ora';
import { extractThumbnail } from '../index.js';

import pkg from '../package.json' assert { type: 'json' };

const program = new Command(pkg.name);

program
  .version(pkg.version)
  .arguments('<xds...>')
  .action(extract)
  .parse(process.argv);

async function extract(xds) {
  const spinner = ora('Extract thumbnail from Adobe XD files').start();
  try {
    for (let xdFile of xds) {
      await extractThumbnail(xdFile);
    }
  } finally {
    spinner.stop();
  }
}
