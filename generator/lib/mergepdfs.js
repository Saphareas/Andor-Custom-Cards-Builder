/**
 * I (Fabian Große) shamelessly copied this (with minor changes) from
 * https://github.com/xlfpx/mergepdfs/blob/master/index.js
 * so thank you Lars Frölich.
 * The code in this file is licensed under the MIT license (the original license he used).
 */

const fs = require("fs");
const pdfjs = require("pdfjs");
const readdir = require("recursive-readdir");

exports.merge = async function(dir) {
	let mergedDoc = new pdfjs.Document();
	let pdfs= await readdir(dir, ["!*.pdf", "merged.pdf"]);
	// get all pdf-files except previous merges
	await (async (pdfs) => {
		pdfs.forEach(function(pdf) {
			let file = fs.readFileSync(pdf);
			let ext = new pdfjs.ExternalDocument(file);
			mergedDoc.addPagesOf(ext);
		});
		mergedDoc.pipe(fs.createWriteStream(dir + "/merged.pdf", {flags: "w"}));
		await mergedDoc.end();
	})(pdfs);
}
