const MAGIC = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])

export type Chunk = {
    type: string
    payload: Uint8Array
}

export function parse(data: Uint8Array): Chunk[] {
    // Return value
    const chunks = []

    // Pointer
    let ptr = 0

    // Check signature.
    if (MAGIC.some((v) => v !== data[ptr++])) throw new Error("ERROR: invalid signature")

    // Value converter.
    const u8 = new Uint8Array(4)
    const u32 = new Uint32Array(u8.buffer)

    // Check has IHDR chunk
    let hasIHDR = false

    // Read and shift 32bit
    const read32 = (invert = false) => {
        const order = [3, 2, 1, 0]
        if (invert) order.reverse()
        order.forEach(index => u8[index] = data[ptr++])
    }

    // 
    while (ptr < data.length) {
        // Get data length
        read32()
        const length = u32[0]

        // Get data type
        read32(true)
        const type = String.fromCharCode(...u8)

        // Check IHDR
        if (!hasIHDR) {
            if (type !== "IHDR") throw new Error("ERROR: missing IHDR")
            hasIHDR = true
        }

        // Check IEND
        if (type === "IEND") break

        // Read payload
        const payload = data.slice(ptr, ptr += length)
        chunks.push({ type, payload })

        // TODO: Check CRC
        read32(false)
    }

    return chunks
}
