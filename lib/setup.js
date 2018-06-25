'use strict'

/**
 * This script creates a custom "seed" file where the user can specify
 *    the path to their mongo database.
 *
 * @author Tom Caflisch
 */

var fs = require('fs'); // Used to get all the files in a directory
var contents = 'module.exports = {\n\t"undefined": "localhost/LOCAL_DB_NAME",\n\t"dev": "localhost/DEV_DB_NAME",\n\t"prod": "localhost/PROD_DB_NAME"\n}';

module.exports.setup = () => {

  // Create seed file in the same directory where the user ran npm install from
  fs.writeFile(process.cwd() + '/seed.js', contents, err => {
    if (err) {
      console.log(err);
    }
  });
}
