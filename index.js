const { Buffer } = require('buffer');

const segmentBinary = (buf) => {
    if (!Buffer.isBuffer(buf)) throw 'first argument of segmentBinary() must be a buffer';
    const neededBytes = calculateBytesNeeded(buf.length);
    const offsetDataBuffer = Buffer.alloc(neededBytes);
    offsetDataBuffer.writeUIntBE(buf.length, 0, neededBytes);

    const neededBytesBuf = Buffer.alloc(1);
    neededBytesBuf.writeUIntBE(neededBytes, 0, 1);

    return Buffer.concat([neededBytesBuf, offsetDataBuffer, buf]);
};

const BYTES_TO_SIZE_MAP = [
    [1, 2 ** 8],
    [2, 2 ** 16],
    [3, 2 ** 24],
    [4, 2 ** 32],
    [5, 2 ** 40],
    [6, 2 ** 48],
    [7, 2 ** 56],
    [8, 2 ** 64]
];

// Function to calculate the minimum number of bytes needed to store a length
function calculateBytesNeeded(length) {
    const requiredBytes = BYTES_TO_SIZE_MAP.find(([_, v]) => length < v)?.[0];
    if (requiredBytes) return requiredBytes;
    throw new Error('allocatable byte exceeded for byte:' + length);
}

/**
 * @type {( buf: Buffer ) => null | [Buffer, Buffer]}
 */
const desegmentBinary = (buf) => {
    if (!Buffer.isBuffer(buf)) throw 'first argument of desegmentBinary() must be a buffer';
    let offset = 0, thisSegment;
    const blocks = [];

    while ((thisSegment = readVariableLength(buf, offset)) !== null) {
        const { byteSize, byteOffset } = thisSegment;
        const binary = buf.subarray(offset = byteOffset, offset += byteSize);
        blocks.push(binary);
    }

    if (!blocks.length) return null;
    return { blocks, remainder: buf.subarray(offset, buf.length) };
}

function readVariableLength(buffer, offset) {
    if (buffer.length - offset === 0) return null;
    const unsignIntSize = buffer.readUIntBE(offset, 1);

    if (++offset + unsignIntSize > buffer.length) return null;

    const byteSize = buffer.readUIntBE(offset, unsignIntSize);

    if (offset + unsignIntSize + byteSize > buffer.length) return null;

    return {
        byteOffset: offset + unsignIntSize,
        byteSize
    };
}

module.exports.segmentBinary = segmentBinary;
module.exports.desegmentBinary = desegmentBinary;