'use strict'

/**
 * Remeber to run from the project root or the tests will fail!
 */

const chai    = require('chai');
const expect  = chai.expect;
chai.use(require('chai-fs'));
const exec    = require('child_process').exec;
const path    = require('path');

describe('run seed-setup', () => {

  it('creates the seed.json file', done => {
    exec('cd test/empty; node ../../bin/setup', (err, stdout, stderr) => {
      expect(err).to.be.null;
      expect(path.resolve('./test/empty/seed.js')).to.be.a.file();
      exec('rm -f test/empty/seed.json');
      done()
    });
  });

});

describe('run seed', () => {

  it('fails with no seeds folder', done => {
    exec('cd test/invalid; node ../../bin/seed', (err, stdout, stderr) => {
      expect(err).to.be.null;
      // Give a reason why
      expect(stdout).to.match(/Error/);
      done();
    });
  });

  it('filters out non-json from the seeds folder', done => {
    exec('cd test/filter; node ../../bin/seed', (err, stdout, stderr) => {
      expect(err).to.be.null;
      // This is a cheap way to check that we did something
      expect(stdout).to.match(/Seeding collection testing/);
      expect(stdout).to.match(/All done. Go play!/);
      done();
    });
  });

  describe('with --seeds-folder set', () => {

    describe('with missing path', () => {
      it('run successfully with the default seeds folder', done => {
        exec('cd test/valid; node ../../bin/seed --seeds-folder ', (err, stdout, stderr) => {
          expect(err).to.be.null
          // This is a cheap way to check that we did something
          expect(stdout).to.match(/Seeding collection testing/);
          expect(stdout).to.match(/All done. Go play!/);
          done()
        })
      })
    })

    describe('with invalid path as param', () => {
      it('should show an error', done => {
        exec('cd test/invalid; node ../../bin/seed --seeds-folder ./some-temp-path-with-no-files-in-it', (err, stdout, stderr) => {
          expect(err).to.be.null
          expect(stdout).to.match(/Error reading \/seeds folder/);
          done()
        })
      })
    })

    describe('with valid relative path as param', () => {
      it('should show successfully seed the db', done => {
        exec('cd test/invalid; node ../../bin/seed --seeds-folder ../valid/seeds', (err, stdout, stderr) => {
          expect(err).to.be.null
          // This is a cheap way to check that we did something
          expect(stdout).to.match(/Seeding collection testing/);
          expect(stdout).to.match(/All done. Go play!/);
          done()
        })
      })
    })
  })

  describe('with no NODE_ENV set', () => {
    it('runs successfully with a seeds folder', done => {
      exec('cd test/valid; node ../../bin/seed', (err, stdout, stderr) => {
        expect(err).to.be.null;
        // This is a cheap way to check that we did something
        expect(stdout).to.match(/Seeding collection testing/);
        expect(stdout).to.match(/All done. Go play!/);
        done();
      });
    });
  });

  describe('with NODE_ENV set and with a matching key in seed.json', () => {

    describe('not specifying the mongodb protocol', () => {
      it('runs successfully with a seeds folder', done => {
        exec('cd test/protocol; NODE_ENV=dev node ../../bin/seed', (err, stdout, stderr) => {
          expect(err).to.be.null;
          // This is a cheap way to check that we did something
          expect(stdout).to.match(/Seeding collection testing/);
          expect(stdout).to.match(/All done. Go play!/);
          done();
        });
      });
    });

    describe('explicitly specifying the mongodb protocol', () => {
      it('runs successfully with a seeds folder', done => {
        exec('cd test/valid; NODE_ENV=dev node ../../bin/seed', (err, stdout, stderr) => {
          expect(err).to.be.null;
          // This is a cheap way to check that we did something
          expect(stdout).to.match(/Seeding collection testing/);
          expect(stdout).to.match(/All done. Go play!/);
          done();
        });
      });
    });

  });

  describe('using MongoDB Extended JSON format', () => {
    it('tests $date format', done => {
      exec('cd test/validExtended; node ../../bin/seed', (err, stdout, stderr) => {
          expect(err).to.be.null;

          // This is a cheap way to check that we did something
          expect(stdout).to.match(/Seeding collection extended/);
          expect(stdout).to.match(/All done. Go play!/);
          done();
      });
    });
  });

  describe('with NODE_ENV set and no matching key in seed.json', () => {
    it('errors out with a reason why', done => {
      exec('cd test/valid; NODE_ENV=test node ../../bin/seed', (err, stdout, stderr) => {
        expect(err).to.be.null;
        expect(stdout).to.match(/No key exists in seed.json for the passed in NODE_ENV/);
        done();
      });
    });
  });

});
