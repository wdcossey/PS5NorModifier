window.serialInterop = {
    port: null,
    reader: null,
    writer: null,

    Object : ResponseCode = Object.freeze({
        Success: 0,
        Failed: 1,
        Exception: 2
    }),

    async requestPort() {
        if ("serial" in navigator) {
            try {
                this.port = await navigator.serial.requestPort();

            }
            catch (e) {
                this.port = null
                console.error(e);
                return ({code: ResponseCode.Exception, message: e.message});
            }
        }

        if (this.port == null) {
            return ({code: ResponseCode.Failed, message: "No port found" })
        }

        return ({code: ResponseCode.Success, message: null })
    },

    async openPort(baudRate) {

        try {
            if (!this.port) {
                return ({code: ResponseCode.Failed, message: "No port selected"});
            }

            await this.port.open({baudRate});
            await this.port.setSignals({requestToSend: false});
            this.reader = this.port.readable.getReader();
            this.writer = this.port.writable.getWriter();
            return ({code: ResponseCode.Success, message: null })
        }
        catch (e) {
            console.error(e);
            return ({code: ResponseCode.Exception, message: e.message});
        }
    },

    // Write text to the port
    async write(data) {
        const enc = new TextEncoder();
        await this.writer.write(enc.encode(data));
    },

    // Read one chunk (Uint8Array) from the port
    async read() {
        if (!this.reader) throw 'Port not open';
        const { value, done } = await this.reader.read();
        if (done) {
            await this.reader.releaseLock();
            return null;
        }
        const dec = new TextDecoder();
        return dec.decode(value);
    },

    // Close everything
    async close() {
        if (this.reader) await this.reader.cancel();
        if (this.writer) await this.writer.releaseLock();
        if (this.port)  await this.port.close();
        this.port = this.reader = this.writer = null;
    }
};