const fs = require('fs');
const util = require('util');
const Transform = require('stream').Transform;

//init timer and transform stream
const TransformStream = new Transform({
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
    const lines = (this.buffer.toString().split('\n').length);
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


var totalLines1 = 0;
var bytes = 0;
var time = null;

const createReport = new Transform ({
    readableObjectMode:true,
    writableObjectMode: true,
    transform(chunk, encoding, next) {
    var dict = JSON.parse(chunk);
    if(time === null)
        time = dict.elapsed_time;
    bytes += dict.totalbytes;
    totalLines1 += dict.total_lines;

    process.nextTick(() => next())
    },
    });

createReport.on('finish',function() {
    var diff = process.hrtime(time)
    diff = diff[0] * 1e9 + diff[1]
    time_in_sec = diff/1e9;
    throughput = bytes/time_in_sec
    report = "this file contains " + totalLines1 + " lines, " + bytes + " bytes" + " and it takes " + time_in_sec +" seconds to process it.\n throughput:" + throughput + " bytes/sec";  
    console.log(report)
  })


rs = fs.createReadStream('test.log');
process.stdin.pipe(TransformStream).pipe(createReport)
