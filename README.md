# node-stream

Creates transform stream that takes line-separated file as input and generates one line reports in the console containing *number of lines, size in bytes, elapsed time and throughput.*

## Usage
Use `npm install` to download all dependencies.

Can be piped to any `stdin` command. For example,

`cat <mylogfile> | node generate_report.js`
 
`tail -f <mylogfile> | node generate_report.js`

## options
###### mb | kb

Additional options (argv) can be used for changing the unit of block size (and throughput) of the file, like

`cat <mylogfile> | node generate_report.js mb`

By defaults, it uses *bytes* for all calculations.

## Running tests

Use `npm test` to run tests.
