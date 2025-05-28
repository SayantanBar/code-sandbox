export function handleTerminalCreation(container, ws) {
  container.exec(
    {
      Cmd: ["/bin/bash"],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      User: "sandbox",
    },
    (err, exec) => {
      if (err) {
        console.log("Error while creating exec", err);
        return;
      }
      exec.start(
        {
          hijack: true,
        },
        (err, stream) => {
          if (err) {
            console.log("Error while starting error", err);
            return;
          }
          // step: Stream process
          processStreamOutput(stream, ws);
          // step: Stream writing

          ws.on("message", (data) => {
            if (data === "getPort") {
              container.inspect((err, data) => {
                const port = data.NetworkSettings;
                console.log("get port event received!");
              });
              return;
            }
            stream.write(data);
          });
        }
      );
    }
  );
}

function processStreamOutput(stream, ws) {
  let nextDataType = null;
  let nextDataLength = null;
  let buffer = Buffer.from("");

  function processStreamData(data) {
    if (data) {
      buffer = Buffer.concat([buffer, data]);
    }
    if (!nextDataType) {
      // if the next data type is not known then we need to read the next 8 bytes to determine the type and length of the message
      if (buffer.length >= 8) {
        const header = bufferSlicer(8);
        nextDataType = header.readUInt32BE(0); // The first 4 bytes represent the type of the message
        nextDataLength = header.readUInt32BE(4); // The next 4 bytes represent the length of the message
        processStreamData();
      }
    } else {
      if (buffer.length >= nextDataLength) {
        const content = bufferSlicer(nextDataLength);
        ws.send(content);
        nextDataType = null;
        nextDataLength = null;
        processStreamData();
      }
    }
  }
  function bufferSlicer(end) {
    const output = buffer.slice(0, end); // header of the chunk
    buffer = Buffer.from(buffer.slice(end, buffer.length)); // Remaining part of the chunk
    return output;
  }
  stream.on("data", processStreamData);
}
