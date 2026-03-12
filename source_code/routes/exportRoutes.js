const express = require("express")
const router = express.Router()
const zlib = require("zlib")
const { v4: uuidv4 } = require("uuid")
const QueryStream = require("pg-query-stream")

const pool = require("../db")

const streamCSV = require("../writers/csvWriter")
const streamJSON = require("../writers/jsonWriter")
const streamXML = require("../writers/xmlWriter")
const streamParquet = require("../writers/parquetWriter")

const jobs = {}



// CREATE EXPORT JOB
router.post("/exports", (req, res) => {

    const { format, columns, compression } = req.body

    if (!format) {
        return res.status(400).json({ error: "format is required" })
    }

    const exportId = uuidv4()

    jobs[exportId] = {
        format,
        columns,
        compression,
        status: "pending"
    }

    console.log("JOB CREATED:", exportId)

    res.status(201).json({
        exportId,
        status: "pending"
    })
})



// DOWNLOAD EXPORT
router.get("/exports/:exportId/download", async (req, res) => {

    const exportId = req.params.exportId

    console.log("DOWNLOAD REQUEST:", exportId)

    const job = jobs[exportId]

    if (!job) {
        return res.status(404).json({ error: "Export job not found" })
    }

    const client = await pool.connect()

    try {

        let selectedColumns = "*"

        if (job.columns && job.columns.length > 0) {
            selectedColumns = job.columns
                .map(c => `${c.source} AS ${c.target}`)
                .join(", ")
        }

        // STREAM QUERY (safe for 10M rows)
        const query = new QueryStream(
            `SELECT ${selectedColumns} FROM records`,
            [],
            { batchSize: 2000 }
        )

        const dbStream = client.query(query)

        dbStream.on("end", () => {
            console.log("DB stream finished")
            client.release()
        })

        dbStream.on("error", (err) => {
            console.error(err)
            client.release()
        })

        let outputStream = res

        // GZIP compression (not allowed for parquet)
        if (job.compression === "gzip" && job.format !== "parquet") {

            res.setHeader("Content-Encoding", "gzip")

            const gzip = zlib.createGzip({
                level: 1
            })

            gzip.pipe(res)

            outputStream = gzip
        }


        // CSV EXPORT
        if (job.format === "csv") {

            res.setHeader("Content-Type", "text/csv")
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=export.csv"
            )

            streamCSV(dbStream, outputStream)
        }


        // JSON EXPORT
        else if (job.format === "json") {

            res.setHeader("Content-Type", "application/json")
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=export.json"
            )

            streamJSON(dbStream, outputStream)
        }


        // XML EXPORT
        else if (job.format === "xml") {

            res.setHeader("Content-Type", "application/xml")
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=export.xml"
            )

            streamXML(dbStream, outputStream)
        }


        // PARQUET EXPORT
        else if (job.format === "parquet") {

            res.setHeader(
                "Content-Type",
                "application/vnd.apache.parquet"
            )

            res.setHeader(
                "Content-Disposition",
                "attachment; filename=export.parquet"
            )

            streamParquet(dbStream, res)
        }


        else {
            res.status(400).json({
                error: "Unsupported format"
            })
        }

    } catch (err) {

        console.error(err)

        client.release()

        res.status(500).json({
            error: err.message
        })
    }
})

module.exports = router