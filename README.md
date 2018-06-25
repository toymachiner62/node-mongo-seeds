# node-mongo-seeds
[![Build Status](https://travis-ci.org/toymachiner62/node-mongo-seeds.svg?branch=master)](https://travis-ci.org/toymachiner62/node-mongo-seeds)
[![Code Climate](https://codeclimate.com/github/toymachiner62/node-mongo-seeds/badges/gpa.svg)](https://codeclimate.com/github/toymachiner62/node-mongo-seeds)
[![Coverage Status](https://coveralls.io/repos/github/toymachiner62/node-mongo-seeds/badge.svg?branch=master)](https://coveralls.io/github/toymachiner62/node-mongo-seeds?branch=master)
[![BCH compliance](https://bettercodehub.com/edge/badge/toymachiner62/node-mongo-seeds?branch=master)](https://bettercodehub.com/)

> A tool to quickly populate your mongo db from a set of .json files. The concept is very similar to Ruby on Rails idea of seeding a database. This allows a new developer to pull down the source code for a project (which contains .json files to populate their mongodb with) and run a command and bingo!! database populated and ready to rock.

## Setup

```sh
$ npm install -g node-mongo-seeds
```

## Usage

### seed-setup
Generate the setup file `seed.js`.

- From the root of your project:

	```sh
	$ seed-setup
	```

- Replace `"localhost/LOCAL_DB_NAME"` with the path to your mongodb in your brand new `seed.js` file

- Create a `/seeds` folder in your project root and put `.json` files or `.js` files which **export a json object** in there.
		The name of the file is going to be the collection name in mongo and the contents
		of the file will be populated into that mongo collection.
	- Note that this package supports the [mongo-extended-json syntax](https://docs.mongodb.com/manual/reference/mongodb-extended-json/)

### seed
Seed your mongodb with all your data from your `/seeds` folder.

- From the root of your project:

	```sh
	$ seed
	``` 
	
	```sh
	$ seed --help
	
	Usage: seed [options]

  Options:

    -s, --seeds-folder [folder]  Use seeds folder [folder]
    -h, --help                   output usage information
	```

**Note**: Every time you run `$ seed` it will blow away all the data in your collections and re-populate them with whatever is in your `/seeds` directory.

### Separate databases per NODE_ENV

You can have separate databases for each NODE_ENV that you are using. Just a put a line in `seed.js` for each `NODE_ENV` that you are going to use. It defaults to `undefined`, `dev`, and `prod` but can be changed to whatever.

## Contributing

1. Clone project and run `npm install -g ./` from project root
2. Add feature(s)
3. Add tests for it
4. Submit pull request

### Running Tests

To run the tests, follow these instructions.

1. Start mongod process		
2. From project root `$ npm install`
3. Run test command `$ npm test`

Enjoy!
