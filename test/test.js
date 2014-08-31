/**
 * Remeber to run from the project root or the tests will fail!
 */
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fs'));
var exec = require('child_process').exec;
var path = require('path');

describe('run seed-setup', function () {
  it.only('creates the seed.json file', function (done) {
    child = exec('cd test/temp; node ../../bin/setup', function(err, stdout, stderr) {
			expect(err).to.be.null;
			expect(path.resolve('./test/temp/seed.json')).to.be.a.file();
      done();
    })
  });
});

describe('run seed', function () {
  it('fails with no seeds folder', function () {

  });

  it('runs successfully with a seeds folder', function (done) {
		child = exec('cd test/temp; node ../../bin/seed', function(err, stdout, stderr) {
			expect(err).to.be.null;
			// Need to assert something else here
		})
  });


});
