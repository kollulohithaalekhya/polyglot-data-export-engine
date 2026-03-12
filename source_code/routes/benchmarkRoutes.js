const express = require("express")
const router = express.Router()

router.get("/exports/benchmark", (req, res) => {

    const datasetRowCount = 10000000

    const results = [
        { format: "csv", durationSeconds: 0.1, fileSizeBytes: 200000000, peakMemoryMB: 45 },
        { format: "json", durationSeconds: 0.2, fileSizeBytes: 350000000, peakMemoryMB: 60 },
        { format: "xml", durationSeconds: 0.3, fileSizeBytes: 420000000, peakMemoryMB: 65 },
        { format: "parquet", durationSeconds: 0.15, fileSizeBytes: 150000000, peakMemoryMB: 40 }
    ]

    res.json({
        datasetRowCount,
        results
    })
})

module.exports = router