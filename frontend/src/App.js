import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [file, setFile] = useState(null);
  const [showDone, setShowDone] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  async function handleSubmit() {
    const formdata = new FormData();
    formdata.append("file", file);
    try {
      const res = await axios.post("http://localhost:9000/file", formdata);
      setShowDone(!showDone);
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <div>
      <h2>Add Candidates to Database</h2>
      <div className="main">
        {!showDone && <div>
          <input type="file" onChange={(e) => handleFileChange(e)} /> <br />
          <button onClick={handleSubmit}>click</button>
        </div>}

        {showDone && <div>
          <h2>Thank You!</h2>
          <h2>File Uploaded</h2>
          <h2>Your reacords will be processed shortly.</h2>
        </div>}
      </div>
    </div>
  );
};

export default App;