import { Buffer } from 'buffer';

/**
 * segement buffer into three blocks with are `size_bytes`, `data_bytes` and `data`
 * 
 * - `size_bytes`: this consumes one byte and it contains the bytes size of the `data_bytes` as an unsigned big-endian number.
 * - `data_bytes`: this dynamically consumes around 1 - 8 bytes that stores the bytes size of written data as an unsigned big-endian number.
 * - `data`: the data that was written
 * @param buffer the buffer to be segmented
 */
export function segmentBinary(buffer: Buffer): Buffer;

interface DesegmentedResult {
    /**
     * individual block data
     */
    blocks: Buffer[];
    /**
     * the remaining buffer that couldn't be desegmented. This is useful in cases like streaming when the data is not yet completed.
     */
    remainder: Buffer;
}

/**
 * desegment buffer into their respective blocks
 * 
 * @param buffer the buffer to be desegmented
 */
export function desegmentBinary(buffer: Buffer): DesegmentedResult | null;