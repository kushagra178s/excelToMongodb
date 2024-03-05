const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const exceljs = require("exceljs");
const mongoose = require("mongoose");
const async = require("async");

const app = express();
const PORT = process.env.PORT || 9000;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/exceltomogodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const Candidate = require("./models/Candidate");

// Use cors middleware
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("File is here at the backend");
});
app.post("/file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const workbook = new exceljs.Workbook();
    const buffer = req.file.buffer;
    const worksheet = await workbook.xlsx
      .load(buffer)
      .then(() => workbook.worksheets[0]);

    const data = worksheet.getSheetValues();

    data.splice(0, 2);
    console.log("data = ", data);

    // Use async.eachSeries to process candidates one by one here
    async.eachSeries(
      data,
      async (rowData, callback) => {
        try {
          const hasNonEmptyCell = rowData.some(
            (cellValue) =>
              cellValue !== null && cellValue !== undefined && cellValue !== ""
          );

          if (hasNonEmptyCell) {
            rowData.splice(0, 1);
            rowData[2] = rowData[2].toString();
            rowData[3] = rowData[3].toString();

            const newCandidate = new Candidate({
              name: rowData[0],
              email: rowData[1],
              mobileNo: rowData[2],
              dateOfBirth: rowData[3],
              workExperience: rowData[4],
              resumeTitle: rowData[5],
              currentLocation: rowData[6],
              postalAddress: rowData[7],
              currentEmployer: rowData[8] || "unavailable",
              currentDesignation: rowData[9] || "unavailable",
            });

            const find = await Candidate.find({ email: newCandidate.email });

            if (find.length === 0) {
              await newCandidate.save();
            } else {
              console.log(
                "Candidate with the same email already exists:",
                newCandidate.email
              );
            }
          }

          callback(); // Proceed to the next candidate
        } catch (error) {
          // callback(error); // Pass error to the final callback
        }
      },
      (error) => {
        if (error) 
        {
          console.error("Error processing file:", error);
          res.status(500).send("Internal Server Error");
        } else {
          res.status(200).send("File uploaded and data saved to MongoDB.");
        }
      }
    );
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {console.log(`Server is running on ${PORT}`);});