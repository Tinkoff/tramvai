export function writeStream(data, stream) {
  const write = stream.__write || stream.write;

  return write.call(stream, data);
}
