/**
 * This script inserts into mongo the contents of all the .json files in the /seeds directory.
 *
 * The name of the file is the collection that the contents of that file will be inserted into.
 *      Example: This script will insert all the records in cohort.json into the collection "cohort"
 *
 * Note: Make sure all .json files in the /seeds directory are the singular form.
 *
 * Usage: $ node seed
 *
 * @author Tom Caflisch
 */

/*
 var optimist = require('optimist');
 var argv = optimist
 .usage('Populate mongo from a set of .json files. \n Usage: $ node seed')
 .describe('d', 'The path to your mongo db')
 .demand(['d'])
 .argv;
 */

var q = require('q');
var pmongo = require('promised-mongo');
var parsedJSON = require(process.cwd() + "/seed.json");
var dir = process.cwd()+'/seeds';
var db = pmongo('mongodb://' + parsedJSON.db);
var fs = require('fs'); // Used to get all the files in a directory
var util = require('util');
var path = require('path');
var _ = require('underscore');
var errno = require('errno');
var path = require('path');

module.exports.convert = function() {

	console.log('in here');

	// Call the method to actually seed the db and when it's complete, close the connection to mongo
	load_files().then(function(list) {
		seed_db(list).then(function () {
 			console.log('----------------------');
  		console.log('All done. Go play!');
  		db.close();
		}).fail(function(err) {
			console.log(err);
		});
	}).fail(function(err) {
		console.log(err);
	});

	/**
	 * Loads all the json files from the ./seeds folder
	 */
	function load_files() {

		var def = q.defer();
		
		// Read all the files in the ./seeds folder
	  fs.readdir(dir, function(err, files) {
  	
			if(err) {
				def.reject(errmsg(err));
			}
				
			if(_.isUndefined(files)) {
				def.reject('No /seeds folder exists');
			}

			// Filter out everything except the .json files
			files = files.filter(function(file) {

				// If the file extension is .json
				if(path.extname(file)) {
					return true;
				} else {
					return false;
				}
			});

			def.resolve(files);
		});
		
		return def.promise;
	}

  /**
   * Loops through all the .json files in ./seeds and removes all the records
   *
   * @param list
   */
  function seed_db(list) {

    console.log('Seeding files from directory ' + path.resolve(dir));
    console.log('----------------------');

    var removeOperations = [];
    var returnPromise = q.defer();

    // For every file in the list
    list.forEach(function (file) {

      // Set the filename without the extension to the variable collection_name
      var collection_name = file.split(".")[0];

      console.log('Seeding collection ' + collection_name);

      // Parses the contents of the current .json file
      var parsedJSON = require(dir + '/' + file);

      // If the seed file is NOT an array
      if (!util.isArray(parsedJSON)) {
        returnPromise.reject(new Error('Seed file ' + collection_name + ' does not start with an Array'));
      }

      //Get collection to insert into
      var collection = db.collection(collection_name);

      //Queue up the "clear collection" promise
      removeOperations.push(
          collection.remove({})
              .then(function () {

                var insertPromises = [];

                //Queue up an "insert" promise for each record to be inserted
                for (var i = 0; i < parsedJSON.length; i++) {

                  insertPromises.push(
                      collection
                          .insert(parsedJSON[i])
                          .fail(function (err) {
                            //If insert fails...
														returnPromise.reject(err);
                          }
                      )
                  );

                }

                // The "clear collection" promise will resolve to the array of insert promises
                return insertPromises;
              })
              .fail(function (err) {
                //If clear collection fails...
								returnPromise.reject(err);
              })
      );
    });

    //Wait until all removes are either resolved or rejected
    q.allSettled(removeOperations)
        .spread(function () {

          var allDone = [];

          // Populate array to hold all "insert" promises (arguments will be an array of arrays, with the
          // array values being the insert promises
          for (var x = 0; x < arguments.length; x++) {
            allDone = allDone.concat(arguments[x].value);
          }

          // Once all insert promises are either resolved or rejected, resolve the final promise
          q.allSettled(allDone).done(function () {
            returnPromise.resolve();
          });
        });

    //Return the deferred promise
    return returnPromise.promise;
  }
	
	/**
	 * Formats error messages to display the actual error message instead of all the errno codes and what not.
	 */
	function errmsg(err) {
	    var str = 'Error: '
	    // if it's a libuv error then get the description from errno
	    if (errno.errno[err.errno]) {
	        str += errno.errno[err.errno].description
	    } else {
	        str += err.message
	    }

	    // if it's a `fs` error then it'll have a 'path' property
	    if (err.path) {
	        str += ' [' + err.path + ']'
	    }
	    return str
	}
}