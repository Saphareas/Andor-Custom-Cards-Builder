/**
 * I (Fabian Große) shamelessly copied this (with minor changes) from
 * https://github.com/xlfpx/mergepdfs/blob/master/index.js
 * so thank you Lars Frölich.
 * The code in this file is licensed under the MIT license (the original license he used).
 */

const fs = require("fs");
const pdfjs = require("pdfjs");
const readdir = require("recursive-readdir");

exports.merge = function(dir) {
	let mergedDoc = new pdfjs.Document();
	readdir(dir, ["!*.pdf", "merged.pdf"]).then( // get all pdf-files except previous merges
		function(pdfs) {
			pdfs.forEach(function(pdf){
				let file = fs.readFileSync(pdf);
				let ext = new pdfjs.ExternalDocument(file);
				mergedDoc.addPagesOf(ext);
			});
			mergedDoc.pipe(fs.createWriteStream(dir + '/merged.pdf'));
			mergedDoc.end().then(function() {
				console.log("\n Finished writing PDF (" + mergedDoc.pageCount + " pages total).");
			});
		},
		function(error) {
			throw error;
		}
	);
}
