
var chai = require('chai');
var expect = chai.expect;
var exec = require('child_process').exec;

describe('npm run node-mongo-seeds setup', function () {
  it.only('creates the seed.json file', function (done) {
    child = exec('node bin/create_config_file', function(err, stdout, stderr) {
      console.log(err);
      console.log(stdout);
      console.log(stderr);
      done();
    })


  });
});

describe('npm run node-mongo-seeds seed', function () {
  it('fails with no seeds folder', function () {

  });

  it('runs successfully with a seeds folder', function () {

  });


});
