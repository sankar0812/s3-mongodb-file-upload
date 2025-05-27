// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import S3Uploader from "./S3Uploader";
// import { ToastContainer } from "react-toastify";

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     // <>
//     //   <div>
//     //     <a href="https://vite.dev" target="_blank">
//     //       <img src={viteLogo} className="logo" alt="Vite logo" />
//     //     </a>
//     //     <a href="https://react.dev" target="_blank">
//     //       <img src={reactLogo} className="logo react" alt="React logo" />
//     //     </a>
//     //   </div>
//     //   <h1>Vite + React</h1>
//     //   <div className="card">
//     //     <button onClick={() => setCount((count) => count + 1)}>
//     //       count is {count}
//     //     </button>
//     //     <p>
//     //       Edit <code>src/App.jsx</code> and save to test HMR
//     //     </p>
//     //   </div>
//     //   <p className="read-the-docs">
//     //     Click on the Vite and React logos to learn more
//     //   </p>
//     // </>
//  <>
//    <div>
//      <h1>AWS S3 File Uploader</h1>
//      <S3Uploader />
//      <ToastContainer position="top-right" autoClose={3000} />
//    </div>
//   </>


//   )
// }

// export default App

import { useState } from "react";
import S3Uploader from "./components/S3Uploader";
import MongoUploader from "./components/MongoUploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

function App() {
  const [mode, setMode] = useState("mongo");

  return (
  <>
    <div id="root" className="container">
      <h1>📤 File Uploader</h1>

      {/* Toggle Buttons */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", gap: "1rem" }}>
        <button
          className={mode === "s3" ? "primary" : "secondary"}
          onClick={() => setMode("s3")}
        >
          Upload to S3
        </button>
        <button
          className={mode === "mongo" ? "primary" : "secondary"}
          onClick={() => setMode("mongo")}
        >
          Upload to MongoDB
        </button>
      </div>

      {/* Upload Section */}
      {mode === "s3" ? <S3Uploader /> : <MongoUploader />}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
   <footer>
     <p>Made with ❤️ by <a href="#">Sankar</a></p>
   </footer>
  </> 

  );
}

export default App;
