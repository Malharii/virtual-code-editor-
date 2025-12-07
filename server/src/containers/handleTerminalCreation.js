export const handleTerminalCreation = async (container, ws) => {
  const exec = await container.exec(
    {
      Cmd: ["/bin/bash"],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
    },
    (err, exec) => {
      if (err) {
        console.error("Error creating exec instance:", err);
        return;
      }
      exec.start({ hijack: true, stdin: true }, (err, stream) => {
        if (err) {
          console.error("Error starting exec instance:", err);
          return;
        }
        // step 1: stream prosessing
        processStreamOutput(stream, ws);

        // stream.on("data", (data) => {
        //   console.log("➡️ ", data.toString());
        //   ws.send(data);
        // });

        // step 2: websocket processing
        ws.on("message", (data) => {
          if (data === "getPort") {
            container.inspect((err, data) => {
              const port = data.NetworkSettings;
              console.log("port data", port);
            });
            return;
          }
          stream.write(data);
        });

        ws.on("close", () => stream.end());
      });
    }
  );
};

function processStreamOutput(stream, ws) {
  let nextDataType = null; // it stores the type of next  message
  let nextDataLength = null; // it stores the length of next  message
  let buffer = Buffer.from(""); // it stores the incomplete data received so far

  function processStreamData(data) {
    // this is helper function to process incoming data in chunks

    if (data) {
      buffer = Buffer.concat([buffer, data]); // concatenate the incoming data to the buffer
    }

    if (!nextDataType) {
      // if the nextData type is not known, then we need to read the next 8 bytes to determine the type and length of next data message
      if (buffer.length >= 8) {
        const header = bufferSlicer(8);

        nextDataType = header.readUInt32BE(0); // the first byte represents the stream type (0=stdin, 1=stdout, 2=stderr)

        nextDataLength = header.readUInt32BE(4); // bytes 4represent the length of next data message

        processStreamData(); // recursively call the function to process the message
      }
    } else {
      if (buffer.length >= nextDataLength) {
        const content = bufferSlicer(nextDataLength); // slice the buffer to get the content of next data message

        ws.send(content); // send the content to the websocket
        nextDataType = null; // reset the nextDataType
        nextDataLength = null; // reset the nextDataLength

        processStreamData(); // recursively call the function to process the next message
      }
    }

    function bufferSlicer(end) {
      // this function slices the buffer and returns the sliced buffer
      const output = buffer.slice(0, end); // header of the chunk
      buffer = Buffer.from(buffer.slice(end, buffer.length)); // remaining part of chunk
      return output;
    }
  }

  stream.on("data", processStreamData);
}
