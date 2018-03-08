var expect = require('chai').expect;

var createTransform = require('../generate_report').createTransform;
var createReport = require('../generate_report').createReport;

describe('', function () {
  it('should match number of lines', function () {
    const random = "This is the first line\n This is the second line"
    const transformStream = createTransform();

    transformStream.on('data', (chunk) => {
        data = JSON.parse(chunk);
        lines = data.total_lines;

        expect(lines).to.equal(2);
        });

    transformStream.write(random);
    transformStream.end();

  });
});


describe('', function () {
  it('should not consider blank lines', function () {
    const random = "this is first line\n\nthis is second line\nthis is third line"
    const transformStream = createTransform();

    transformStream.on('data', (chunk) => {
        data = JSON.parse(chunk);
        lines = data.total_lines;

        expect(lines).to.equal(3);
        });

    transformStream.write(random);
    transformStream.end();

  });
});


