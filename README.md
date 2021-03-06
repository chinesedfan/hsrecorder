HearthStone Recorder [![Build Status](https://travis-ci.org/chinesedfan/hsrecorder.svg?branch=master)](https://travis-ci.org/chinesedfan/hsrecorder)
====================

This project provides a single HTML page for recording your HearthStone's arena winning rates and opening packs results.

<img src="pic/screenshot_arena.jpg" width="80%" />
<img src="pic/screenshot_packs.jpg" width="80%" />
<img src="pic/screenshot_lacks.jpg" width="80%" />

In fact, an Excel file may be enough. But I want to have more power to add personal functionalities, and practise programming for fun at the same time. :)

It leverages HTML5 local storage APIs to manage all data. The database is a SQLite file, whose location has been specified in the corresponding file. Because its location is controlled by the browser, be careful when you clear the browser caches.

The open source library for drawing statistics charts is provided by [Dianping's Venus project](https://github.com/DPF2EBS/venus), which is built on [KineticJS](https://github.com/ericdrowell/KineticJS) and [Raphaël](https://github.com/DmitryBaranovskiy/raphael/).

### How to update new series

- cd HearthSim/hsdata; git pull
- modify util/parseXml.js and src/common/hs.js
- cd util; sh generate.sh
