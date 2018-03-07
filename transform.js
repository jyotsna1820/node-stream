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


const createReport = new Transform ({
    readableObjectMode:true,
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
    var dict = JSON.parse(chunk);
    var diff = process.hrtime(dict.elapsed_time)
    diff = diff[0] * 1e9 + diff[1]
    time_in_sec = diff/1e9;
    throughput = bytes/time_in_sec

    report = "this file contains " + dict.total_lines + " lines, " + dict.totalbytes + " bytes" + " and it takes " + time_in_sec +" seconds to process it.\n throughput:" + throughput + " bytes/sec";  
    console.log(report)
    callback()
  }

    });

// createReport.on('finish',function() {
//     var diff = process.hrtime(time)
//     diff = diff[0] * 1e9 + diff[1]
//     time_in_sec = diff/1e9;
//     throughput = bytes/time_in_sec
//     report = "this file contains " + totalLines1 + " lines, " + bytes + " bytes" + " and it takes " + time_in_sec +" seconds to process it.\n throughput:" + throughput + " bytes/sec";  
//     console.log(report)
//   })


rs = fs.createReadStream('test.log');
process.stdin.pipe(TransformStream).pipe(createReport)
