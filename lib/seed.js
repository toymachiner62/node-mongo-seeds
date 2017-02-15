/**
 * This script inserts into mongo the contents of all the .json files in the /seeds directory.
 *
 * The name of the file is the collection that the contents of that file will be inserted into.
 *      Example: This script will insert all the records in cohort.json into the collection "cohort"
 *
 * Usage: $ node seed
 *
 * @author Tom Caflisch
 */

var Q       = require('q');
var mongo   = require('mongodb').MongoClient;
var config  = require(process.cwd() + "/seed.json");
var dir     = process.cwd()+'/seeds';
var fs      = require('fs'); // Used to get all the files in a directory
var util    = require('util');
var _       = require('lodash');
var errno   = require('errno');
var path    = require('path');
var json2mongo = require('json2mongo');

/**
 * Reads the .json files from the ./seeds folder and inserts them into mongo
 */
module.exports.seed = function() {

  var listOfFiles = null;

  load_files().then(function(list) {
    listOfFiles = list;
    return getConnection();
  }).then(function(db) {
    return seed_db(db, listOfFiles);
  }).then(function () {
    console.log('----------------------');
    console.log('All done. Go play!');
  }).fail(function(err) {
    console.log('err = ', err);
  }).done();
}


/*************************
 * Private
 ************************/


/**
 * Loads all the json files from the ./seeds folder
 */
function load_files() {

  return Q.promise(function(resolve, reject, notify) {

    // Read all the files in the ./seeds folder
    fs.readdir(dir, function(err, files) {

      if(err || _.isUndefined(files)) {
        return reject('Error reading /seeds folder');
      } else {
        // Filter out everything except the .json files
        files = files.filter(function(file) {
          return path.extname(file) === '.json';
        });

        return resolve(files);
      }
    });
  });
}


/**
 * Loops through all the .json files in ./seeds and removes all the records
 *
 * @param db    - The mongo object to run queries against
 * @param list  - An array of all the .json files from the seeds folder
 */
function seed_db(db, list) {

  console.log('Seeding files from directory ' + path.resolve(dir));
  console.log('----------------------');

  return Q.promise(function(resolve, reject, notify) {

    var operations = [];

    // Loop through every file in the list
    list.forEach(function (file) {

      // Set the filename without the extension to the variable collection_name
      var collection_name = file.split(".")[0];
      var contents = null;

      // True if the current file has contents, false if it's empty
      var hasContents = fs.statSync(path.resolve(dir + '/' + file)).size > 0;

      console.log('Seeding collection ' + collection_name);

      // If the file has contents, load them
      if(hasContents) {
        contents = require(dir + '/' + file);

        // If the seed file is NOT an array
        if (!util.isArray(contents)) {
          return reject(new Error('Seed file ' + collection_name + ' does not start with an Array'));
        }
      }

      // The chain of operations to occur for each file. Drop the existing collection if it exists, create it, insert data into it
      var chain = dropCollection(db, collection_name).then(function() {
        return createCollection(db, collection_name);
      }).then(function() {
        if(contents) {
          return insert(db, collection_name, contents)
        }
      }).fail(function(err) {
        return reject(errmsg(err));
      });

      // Push the chain for each file to an array of promises
      operations.push(chain);
    });

    // When all the drop/create/inserts are complete, we're finished
    Q.allSettled(operations).then(function() {
      return resolve();
    }).fail(function(err) {
      return reject(err);
    }).fin(function() {
      db.close();
    });
  });
}


/**
 * Gets a connection to mongo
 *
 * @returns {promise|*|Q.promise}
 */
function getConnection() {

  return Q.promise(function(resolve, reject, notify) {

    var NODE_ENV = process.env.NODE_ENV;
    var connectionString = null;

    // If NODE_ENV is set and there is no key in seed.json matching, throw an error
    if(NODE_ENV && !config[NODE_ENV]) {
      return reject('No key exists in seed.json for the passed in NODE_ENV');
    }

    // If the connection string does not start with "mongodb://", add it
    if(_.startsWith(config[NODE_ENV], "mongodb://")) {
      connectionString = config[NODE_ENV];
    } else {
      connectionString = 'mongodb://' + config[NODE_ENV];
    }

    mongo.connect(connectionString, function(err, db) {

      if(err) {
        return reject(err);
      }

      resolve(db);
    });
  });
}


/**
 * Creates a collection in mongo
 *
 * @param collection
 * @returns {*}
 */
function createCollection(db, name) {

  return Q.promise(function(resolve, reject, notify) {

    db.createCollection(name, function(err, collection) {

      if(err) {
        return reject(err);
      }

      resolve();
    });
  });
}


/**
 * Drops a collection from mongo if it exists
 *
 * @param collection  - The collection to drop
 * @returns {*}
 */
function dropCollection(db, name) {

  return Q.promise(function(resolve, reject, notify) {

    // Check if the collection exists, else don't do anything
    collectionExist(db, name).then(function(exists) {

      // If the collection exists, drop it
      if(exists) {

        db.dropCollection(name, function(err, reply) {

          if(err) {
            return reject(err);
          }

          resolve();
        });
      } else {
        resolve();
      }
    });
  });
}


/**
 * Checks if a collection exists
 *
 * @param db    - The db to check if a collection exists in
 * @param name  - The name of the collection we want to see if exists
 * @returns {promise|*|Q.promise}
 */
function collectionExist(db, name) {

  return Q.promise(function(resolve, reject, notify) {

    db.listCollections().toArray(function(err, collections) {

      if(err) {
        return reject(err);
      }

      // If the collection exists in the mongo db
      if(_.findWhere(collections, {name: name})) {
        return resolve(true);
      } else {
        return resolve(false);
      }
    });
  });
}

/**
 * Inserts an array of objects into mongo
 *
 * @param db              - The db to insert into
 * @param collection_name - The collection to insert into
 * @param contents        - The contents to be inserted
 * @returns {*}
 */
function insert(db, collection_name, contents) {

  return Q.promise(function(resolve, reject, notify) {

    // If it's an empty array, there's nothing to insert
    if(contents.length !== 0) {

      var data = contents.map(function(content){
        return json2mongo(content);
      });

      db.collection(collection_name).insertMany(data, function(err, result) {
        if(err) {
          return reject(err);
        }

        return resolve(result);
      });
    } else {
      return resolve();
    }
  });
}


/**
 * Formats error messages to display the actual error message instead of all the errno codes and what not.
 *
 * @param err         - The error object that may or may not contain an errno code
 * @returns {string}  - A simple message
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
