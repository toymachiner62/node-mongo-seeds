node-mongo-seeds
================

A tool to quickly populate your mongo db from a set of .json files. The concept is very similar to Ruby on Rails idea of seeding a database. This allows a new developer to pull down the source code for a project (which contains .json files to populate their mongodb with) and run a command and bingo!! database populated and ready to rock.

## Usage

- Run `npm install node-mongo-seeds --save`
- Run `npm run node-mongo-seeds setup`
- Replace `"localhost/CHANGE_ME_TO_YOUR_DB_NAME"` with the path to your mongodb in your brand new seed.json file
- Create a `/seeds` folder in your project root and put `.json` files in there.
		The name of the file is going to be the collection name in mongo and the contents
		of the file will be populated into that mongo collection.
- Run `npm run node-mongo-seeds seed` to seed your mongodb with all your data from your `/seeds` folder.

**Note**: Every time you run `npm run node-mongo-seeds seed` it will blow away all the data in your collections and re-populate them with whatever is in your `/seeds` directory.

Enjoy!
