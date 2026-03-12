const parquet = require("parquetjs")
const fs = require("fs")
const path = require("path")

async function streamParquet(dbStream, res) {

  const filePath = path.join("/tmp", "export.parquet")

  const schema = new parquet.ParquetSchema({
    id: { type: "INT64" },
    name: { type: "UTF8" }
  })

  const writer = await parquet.ParquetWriter.openFile(schema, filePath)

  for await (const row of dbStream) {
    await writer.appendRow(row)
  }

  await writer.close()

  res.setHeader(
    "Content-Type",
    "application/vnd.apache.parquet"
  )

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=export.parquet"
  )

  const fileStream = fs.createReadStream(filePath)

  fileStream.pipe(res)
}

module.exports = streamParquet