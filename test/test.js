/**
 * Remeber to run from the project root or the tests will fail!
 */
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fs'));
var exec = require('child_process').exec;
var path = require('path');

describe('run seed-setup', function () {

	it('creates the seed.json file', function (done) {
    child = exec('cd test/temp; node ../../bin/setup', function(err, stdout, stderr) {
			expect(err).to.be.null;
			expect(path.resolve('./test/temp/seed.json')).to.be.a.file();
      done();
    });
  });

});

describe('run seed', function () {

  it('fails with no seeds folder', function (done) {
		child = exec('cd test/temp; node ../../bin/seed', function (err, stdout, stderr) {
			expect(err).to.be.null;
			// Need to assert something here
			done();
		});
  });

	describe('with no NODE_ENV set', function() {

		it('runs successfully with a seeds folder', function (done) {
			child = exec('cd test/temp; node ../../bin/seed', function(err, stdout, stderr) {
				expect(err).to.be.null;
				// Need to assert that the correct database was created successfully
				done();
			});
		});
	});

	describe('with NODE_ENV set and with a matching key in seed.json', function() {

		it('runs successfully with a seeds folder', function (done) {
			child = exec('cd test/temp; NODE_ENV=dev node ../../bin/seed', function(err, stdout, stderr) {
				expect(err).to.be.null;
				// Need to assert that the correct database was created successfully
				done();
			});
		});
	});

	describe('with NODE_ENV set and no matching key in seed.json', function() {

		it('errors out with a reason why', function (done) {
			child = exec('cd test/temp; NODE_ENV=test node ../../bin/seed', function(err, stdout, stderr) {
				expect(err).to.be.null;
				expect(stdout).to.match(/No key exists in seed.json for the passed in NODE_ENV/);
				done();
			});
		});
	});

});
