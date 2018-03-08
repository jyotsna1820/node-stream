const fs = require('fs');
const util = require('util');
const Transform = require('stream').Transform;
var _ = require('underscore');


function createTransform() {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform(chunk, encoding, callback){
      var sumBytes = 0;
      var totalLines = 0;
      // transform before
      // console.log("Transform:" + chunk);
      this.buffer = new Buffer(chunk);
      
      // transforming here
      // getting total number of lines
      const lines_array = (this.buffer.toString().split('\n'));

      //strips blank lines
      var lines_strip = _.filter(lines_array, function(n) {
        return n.length > 0;
      });
      const lines = lines_strip.length
      totalLines += lines;

      // summing total length
      sumBytes += (this.buffer.length);
      //transform after 
      // console.log(this.buffer);
      const start = process.hrtime();
      // pushing chunk out of transfor

      const summaryObj = {"elapsed_time": start, "totalbytes": sumBytes, "total_lines": totalLines}
      this.push(JSON.stringify(summaryObj));

      callback();
  }
});
}

//creates new instance of createTransform
const transformStream = createTransform();


function createReport(byte_unit) {

  return new Transform ({
    readableObjectMode:true,
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
    var bytes
    var unit


    //defining block size by argv
    if (byte_unit == "kb")
    {
       bytes = 1e3
       unit = "kb"
    }
    else if(byte_unit == "mb")
    {
      bytes = 1e6;
      unit = "mb"
    }
    else
    {
      bytes = 1;
      unit = "bytes"
    }
    
    //converting string to object and performing calculations
    var dict = JSON.parse(chunk);
    var diff = process.hrtime(dict.elapsed_time)
    diff = diff[0] * 1e9 + diff[1]
    time_in_sec = diff/1e9;
    block_size = dict.totalbytes/bytes
    var throughput = block_size/time_in_sec

    report = "this file contains " + dict.total_lines + " lines, " + " block size is " + block_size + unit + " and it takes " + time_in_sec + " seconds to process it.\n throughput:" + throughput + unit +"/sec";  
    console.log(report)

    callback();
  }

    });
}


//creates new createReport instance and decouples argv from stream
const newReport = createReport(process.argv[process.argv.length -1]);

process.stdin.pipe(transformStream).pipe(newReport)

module.exports = {
  createTransform: createTransform,
  createReport: createReport
};
