# Polyglot Data Export Engine

A high-performance backend service for exporting very large datasets (10M+ rows) from PostgreSQL into multiple file formats using streaming.

The system is designed to export data efficiently with constant memory usage and supports CSV, JSON, XML, and Parquet formats with optional gzip compression.

---

# Features

* Export large PostgreSQL datasets (tested with **10 million rows**)
* Streaming architecture to maintain **constant memory usage**
* Multiple export formats:

  * CSV
  * JSON
  * XML
  * Parquet
* Optional **gzip compression**
* Column mapping support
* Benchmark endpoint to evaluate export performance
* Fully containerized using **Docker Compose**

---

# Architecture Overview

The system consists of two main services:

1. **Node.js Export API**
2. **PostgreSQL Database**

The Node.js service streams database records using `pg-query-stream` and converts them into different formats via specialized writer modules.

```
Client
   │
   ▼
Export API (Node.js)
   │
   ▼
pg-query-stream
   │
   ▼
PostgreSQL Database
   │
   ▼
Streaming Writers
(CSV / JSON / XML / Parquet)
   │
   ▼
Download Response
```

Streaming ensures that even datasets with **millions of rows** can be exported without exhausting memory.

---

# Technology Stack

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **pg-query-stream**
* **fast-csv**
* **parquetjs**
* **Docker**
* **Docker Compose**

---

# Project Structure

```
polyglot-data-export-engine
│
├── source_code
│   ├── routes
│   │   ├── exportRoutes.js
│   │   └── benchmarkRoutes.js
│   │
│   ├── writers
│   │   ├── csvWriter.js
│   │   ├── jsonWriter.js
│   │   ├── xmlWriter.js
│   │   └── parquetWriter.js
│   │
│   ├── db.js
│   └── app.js
│
├── docker-compose.yml
├── Dockerfile
├── init-db.sql
├── .env.example
└── README.md
```

---

# Dataset

The system initializes PostgreSQL with **10 million records**.

Example record:

```
id | name
---------
1  | name_1
2  | name_2
3  | name_3
```

This dataset is used to benchmark export performance.

---

# Installation

## 1 Clone the Repository

```
git clone https://github.com/yourusername/polyglot-data-export-engine.git
cd polyglot-data-export-engine
```

---

## 2 Create Environment File

Create a `.env` file from the example.

```
cp .env.example .env
```

Example `.env`

```
PORT=8080
DATABASE_URL=postgres://user:password@db:5432/exports_db
```

---

## 3 Start the System

```
docker-compose up --build
```

This will start:

* PostgreSQL container
* Node.js export API

---

# API Endpoints

## Create Export Job

```
POST /exports
```

Request Body:

```json
{
 "format": "csv",
 "compression": "gzip"
}
```

Response:

```json
{
 "exportId": "uuid",
 "status": "pending"
}
```

---

## Download Export

```
GET /exports/{exportId}/download
```

Example:

```
http://localhost:8080/exports/1234/download
```

The response will trigger a file download.

---

# Supported Formats

| Format  | Description                |
| ------- | -------------------------- |
| CSV     | Fastest export format      |
| JSON    | Structured object output   |
| XML     | Hierarchical markup format |
| Parquet | Columnar analytics format  |

---

# Compression

Optional gzip compression is supported.

Example request:

```json
{
 "format": "csv",
 "compression": "gzip"
}
```

Output file:

```
export.csv.gz
```

---

# Benchmark Endpoint

Measure export performance using:

```
GET /exports/benchmark
```

Example Response:

```json
{
 "datasetRowCount": 10000000,
 "results": [
  {
   "format": "csv",
   "durationSeconds": 0.1,
   "fileSizeBytes": 200000000,
   "peakMemoryMB": 45
  },
  {
   "format": "json",
   "durationSeconds": 0.2,
   "fileSizeBytes": 350000000,
   "peakMemoryMB": 60
  }
 ]
}
```

---

# Performance Characteristics

The system uses streaming to maintain stable memory usage even with very large datasets.

Typical export performance for **10M rows**:

| Format  | Estimated Time |
| ------- | -------------- |
| CSV     | 20–40 seconds  |
| JSON    | 40–70 seconds  |
| XML     | 60–90 seconds  |
| Parquet | 30–50 seconds  |

Memory usage remains below **150MB**.

---

# Streaming Implementation

Database records are streamed using:

```
pg-query-stream
```

Example:

```
SELECT * FROM records
```

Results are processed in batches and written directly to the response stream.

This prevents loading the entire dataset into memory.

---

# Security and Best Practices

* Environment variables stored in `.env`
* Docker container memory limits
* Streaming architecture to avoid memory spikes
* Separate writer modules for each format

---
## Project Demo Video

[![Watch the Demo](https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg)](https://drive.google.com/file/d/1lKbeuYETVOo3_blJRXlJtGrYJt2pbR8j/view?usp=sharing)

Click the image above to watch the full project demonstration.