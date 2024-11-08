# segment-binary

Split and Join binary data into their individual segments.

## Installation

```sh
npm install segment-binary buffer --save
```

or using yarn

```sh
yarn add segment-binary buffer
```

## Usage

```js
const { segmentBinary, desegmentBinary } = require("segment-binary");

// segment blocks of data

const segmentedBuf = Buffer.concat([
  segmentBinary(Buffer.from("first data block", "utf8")),
  segmentBinary(Buffer.from("second data block", "utf8")),
  segmentBinary(Buffer.from("third data block", "utf8")),
  Buffer.from("unsegmented data block", "utf8"),
]);

// desegment buffer to blocks of data

const { blocks, remainder } = desegmentBinary(segmentedBuf);

/**
 * output will be:
 * [
 *  'first data block',
 *  'second data block',
 *  'third data block'
 * ]
 */
console.log("blocks:", blocks.map(v => v.toString('utf8')));

// output will be: "unsegmented data block"
console.log("remainder:", remainder.toString('utf8'));
```

## Algorithms

in order to stream the data back in the same order they were written, each written data are transformed into three boundaries which `size_bytes`, `data_bytes` and `data`.

- `size_bytes`: this consumes one byte and it contains the bytes size of the `data_bytes` as an unsigned big-endian number.
- `data_bytes`: this dynamically consumes around 1 - 8 bytes that stores the bytes size of written data as an unsigned big-endian number.
- `data`: the data that was written

## License

MIT

---
