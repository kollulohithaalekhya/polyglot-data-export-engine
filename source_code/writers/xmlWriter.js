function streamXML(dbStream, res) {

    res.write("<records>")

    let buffer = []
    const BUFFER_SIZE = 1000

    dbStream.on("data", (row) => {

        let record = "<record>"

        for (const key in row) {
            record += `<${key}>${row[key]}</${key}>`
        }

        record += "</record>"

        buffer.push(record)

        if (buffer.length >= BUFFER_SIZE) {

            res.write(buffer.join(""))
            buffer = []
        }
    })

    dbStream.on("end", () => {

        if (buffer.length > 0) {
            res.write(buffer.join(""))
        }

        res.write("</records>")
        res.end()
    })

    dbStream.on("error", (err) => {
        console.error(err)
        res.end()
    })
}

module.exports = streamXML