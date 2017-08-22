/**
 * Remeber to run from the project root or the tests will fail!
 */
var chai    = require('chai');
var expect  = chai.expect;
chai.use(require('chai-fs'));
var exec    = require('child_process').exec;
var path    = require('path');

describe('run seed-setup', function () {

  it('creates the seed.json file', function (done) {
    child = exec('cd test/empty; node ../../bin/setup', function(err, stdout, stderr) {
      expect(err).to.be.null;
      expect(path.resolve('./test/empty/seed.json')).to.be.a.file();
      exec('rm -f test/empty/seed.json');
      done();
    });
  });

});

describe('run seed', function () {

  it('fails with no seeds folder', function (done) {
    child = exec('cd test/invalid; node ../../bin/seed', function (err, stdout, stderr) {
      expect(err).to.be.null;
      // Give a reason why
      expect(stdout).to.match(/Error/);
      done();
    });
  });

  it('filters out non-json from the seeds folder', function (done) {
    child = exec('cd test/filter; node ../../bin/seed', function (err, stdout, stderr) {
      expect(err).to.be.null;
      // This is a cheap way to check that we did something
      expect(stdout).to.match(/Seeding collection testing/);
      expect(stdout).to.match(/All done. Go play!/);
      done();
    });
  });

  describe('with no NODE_ENV set', function() {

    it('runs successfully with a seeds folder', function (done) {
      child = exec('cd test/valid; node ../../bin/seed', function(err, stdout, stderr) {
        expect(err).to.be.null;
        // This is a cheap way to check that we did something
        expect(stdout).to.match(/Seeding collection testing/);
        expect(stdout).to.match(/All done. Go play!/);
        done();
      });
    });
  });

  describe('with NODE_ENV set and with a matching key in seed.json', function() {

    describe('not specifying the mongodb protocol', function() {

      it('runs successfully with a seeds folder', function (done) {
        child = exec('cd test/protocol; NODE_ENV=dev node ../../bin/seed', function(err, stdout, stderr) {
          expect(err).to.be.null;
          // This is a cheap way to check that we did something
          expect(stdout).to.match(/Seeding collection testing/);
          expect(stdout).to.match(/All done. Go play!/);
          done();
        });
      });
    });

    describe('explicitly specifying the mongodb protocol', function() {

      it('runs successfully with a seeds folder', function (done) {
        child = exec('cd test/valid; NODE_ENV=dev node ../../bin/seed', function(err, stdout, stderr) {
          expect(err).to.be.null;
          // This is a cheap way to check that we did something
          expect(stdout).to.match(/Seeding collection testing/);
          expect(stdout).to.match(/All done. Go play!/);
          done();
        });
      });
    });

  });

  describe('using MongoDB Extended JSON format', function() {

    it('tests $date format', function (done) {
      child = exec('cd test/validExtended; node ../../bin/seed', function(err, stdout, stderr) {
          expect(err).to.be.null;

          // This is a cheap way to check that we did something
          expect(stdout).to.match(/Seeding collection extended/);
          expect(stdout).to.match(/All done. Go play!/);
          done();
      });
    });
  });

  describe('with NODE_ENV set and no matching key in seed.json', function() {

    it('errors out with a reason why', function (done) {
      child = exec('cd test/valid; NODE_ENV=test node ../../bin/seed', function(err, stdout, stderr) {
        expect(err).to.be.null;
        expect(stdout).to.match(/No key exists in seed.json for the passed in NODE_ENV/);
        done();
      });
    });
  });

});
