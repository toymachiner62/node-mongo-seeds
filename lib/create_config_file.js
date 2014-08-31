/**
 * This script creates a custom ".seed" file where the user can specify
 *    the path to their mongo database.
 *
 * @author Tom Caflisch
 */

console.log('in config.js');

var fs = require('fs'); // Used to get all the files in a directory
var contents = '{\n\t"db": "localhost/CHANGE_ME_TO_YOUR_DB_NAME"\n}';

module.exports.convert = function() {

  // Create .seed file in the same directory where the user ran npm install from
  fs.writeFile(process.cwd() + '/seed.json', contents, function (err) {
    if (err) {
      console.log(err);
    }
  });
}