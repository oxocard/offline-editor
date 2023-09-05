/* This webworker is needed because the serial needs to read data ina an infinite loop.
   Otherwise the UI would be affected by this loop.
   
   The webworker can only connect to ports already unlocked by the UI.
   Thats why navigator.serial.requestPort happens in the serial middleware */

let port: SerialPort | undefined = undefined;
let reader: ReadableStreamDefaultReader<Uint8Array>;
let keepReading = true;
let closedPromise: Promise<void> | null = null;

async function readUntilClosed() {
  /* Read until reader.cancel() was called, the port is no longer available
        or keepReading is set to false */
  while (port?.readable && keepReading) {
    reader = port.readable.getReader();
    try {
      let receivedString = '';
      let timeoutRef: NodeJS.Timeout | undefined;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          /* reader.cancel() has been called. */
          break;
        }
        /* value is a Uint8Array and can be only a chunk of the whole data.
              We need to get it as a string and add it to the received string */
        const newString = new TextDecoder().decode(value);
        receivedString += newString;
        const finalString = receivedString;

        /* Add a timeout to wait for all packages received of one message */
        clearTimeout(timeoutRef);
        timeoutRef = setTimeout(() => {
          receivedString = '';
          /* split the string into the different lies */
          const massages = finalString.split('\n');
          massages.forEach((msg) => {
            /* only send JSON data to the UI (No ESP log messages) */
            if (msg.at(0) === '{' && msg.at(-2) === '}') {
              /* Send the dataReceived message with the text to the UI */
              postMessage({ type: 'dataReceived', data: msg });
            } else if (msg.at(0) === '{') {
              receivedString = msg;
            }
          });
        }, 50);
      }
    } catch (error) {
      console.log('Serial read failed', error);
    } finally {
      /* Allow the serial port to be closed */
      reader.releaseLock();
    }
  }
  /* If the worker reaches here, the connection is terminated */
  await port?.close();

  /* Send the disconnected message to the UI */
  postMessage({ type: 'disconnected' });
}

onmessage = async (e) => {
  const message = e.data;
  switch (message.type) {
    case 'connect':
      try {
        /* Connect to the Oxocard */
        [port] = await navigator.serial.getPorts();

        await port.open({ baudRate: 115200 });
        await port.setSignals({ dataTerminalReady: false, requestToSend: false });

        /* Send the connected message to the UI */
        postMessage({ type: 'connected' });

        /* Start the reading procedure */
        closedPromise = readUntilClosed();
      } catch (error) {
        console.log(error);
      }
      break;

    case 'disconnect':
      try {
        if (port) {
          keepReading = false;
          reader.cancel();
          await closedPromise;
          port = undefined;
        }
      } catch (error) {
        console.log(error);
      }
      break;

    case 'send':
      try {
        if (port) {
          /* Get the writer, encode the Text to Uint8Array and send it */
          const writer = port?.writable?.getWriter();
          const enc = new TextEncoder();
          await writer?.write(enc.encode(message.data));

          /* Release the writer after the transmission */
          writer?.releaseLock();
        }
      } catch (error) {
        console.log('Serial send failed', error);
      }
      break;

    default:
      break;
  }
};
