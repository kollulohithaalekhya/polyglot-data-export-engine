const csv = require("fast-csv")

function streamCSV(dbStream, res) {

    res.setHeader("Content-Type","text/csv")
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=export.csv"
    )

    const csvStream = csv.format({ headers:true })

    dbStream
        .pipe(csvStream)
        .pipe(res)
        .on("error",(err)=>{
            console.error(err)
            res.end()
        })
}

module.exports = streamCSV