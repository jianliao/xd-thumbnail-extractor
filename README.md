# XD-Thumbnail
<img width="30" alt="Logo" src="https://helpx.adobe.com/content/dam/help/mnemonics/xd_app_RGB_2017.svg"> 
An utility package to extract thumbnail from Adobe XD file.

## Command line interface

### Extract thumbnail from one XD file

`npx xd-thumbnail-extractor test/fixtures/Cards-v1.0.0.xd`

Cards-v1.0.0.png file will be found in path test/fixtures.

### Extract thumbnail from multiple XD files

`npx xd-thumbnail-extractor test/fixtures/**/*.xd`

Thumbnail files will be found along with its corresponding xd.
