/**
 * Copyright (C) 2019 Fabian Große
 * This software is licensed under the GNU General Public License 3 (GPLv3) or later.
 * For details please see the LICENSE file that should be included with this software.
 */

const fs = require("fs");
const path = require("path");
const pdfjs = require("pdfjs");

/**
 * Merge multiple PDF files into one.
 * @param {string}  dir             Directory which contains the files that should be merged. (Can be relative)
 * @param {string}  pdfPartName     Prefix to identify the files that should be merged, e.g. 'file.part' in 'file.part42.pdf'.
 * @param {string}  targetFileName  Name of the merged PDF file. Will be created in dir.
 * @param {boolean} deleteParts     Whether or not the 'file.part42.pdf' files should be deleted after merging.
 */
async function merge(dir, pdfPartName, targetFileName, deleteParts=false) {
  let pdfs = fs.readdirSync(dir);
  let regex = new RegExp(`${pdfPartName}.*\\.pdf`);
  pdfs = pdfs.filter(item => regex.test(item));
  pdfs = pdfs.map(item => path.resolve(dir + "/" + item));

  let mergedDoc = new pdfjs.Document();
  pdfs.forEach(pdf => {
    let file = fs.readFileSync(pdf);
    let ext = new pdfjs.ExternalDocument(file);
    mergedDoc.addPagesOf(ext);
  });
  mergedDoc.pipe(fs.createWriteStream(dir + `/${targetFileName}`, {flags: "w"}));
  await mergedDoc.end();

  if (deleteParts)
    pdfs.forEach(file => fs.unlink(file, err => { if (err) throw err }));
}

exports.merge = merge;
