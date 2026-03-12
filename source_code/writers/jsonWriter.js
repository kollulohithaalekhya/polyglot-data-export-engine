function streamJSON(dbStream, res) {

    res.write("[")

    let first = true
    let buffer = []
    const BUFFER_SIZE = 1000

    dbStream.on("data", (row) => {

        buffer.push(row)

        if (buffer.length >= BUFFER_SIZE) {

            const chunk = buffer.map(r => JSON.stringify(r)).join(",")

            if (!first) {
                res.write(",")
            }

            res.write(chunk)

            first = false
            buffer = []
        }
    })

    dbStream.on("end", () => {

        if (buffer.length > 0) {

            const chunk = buffer.map(r => JSON.stringify(r)).join(",")

            if (!first) res.write(",")

            res.write(chunk)
        }

        res.write("]")
        res.end()
    })

    dbStream.on("error", (err) => {
        console.error(err)
        res.end()
    })
}

module.exports = streamJSON