
const { segmentBinary, desegmentBinary } = require("./index");

// segment blocks of data

const segmentedBuf = Buffer.concat([
    segmentBinary(Buffer.from("first data block", "utf8")),
    segmentBinary(Buffer.from("second data block", "utf8")),
    segmentBinary(Buffer.from("third data block", "utf8")),
    Buffer.from("unsegmented data block", "utf8"),
]);

// desegment buffer to blocks of data

const { blocks, remainder } = desegmentBinary(segmentedBuf);

console.log("blocks:", blocks.map(v => v.toString('utf8')));

console.log("remainder:", remainder.toString('utf8'));