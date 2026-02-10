import React, { useState, useEffect } from "react";
import Prism from "prismjs";
import Editor from "react-simple-code-editor";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import Markdown from "react-markdown";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState("");

  useEffect(() => {
    window.Prism = Prism;
    Prism.highlightAll();
  }, [code]);

  async function reviewCode() {
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      // ✅ set only the review text, not the entire object
      setReview(response.data.review || "No review returned");
    } catch (error) {
      console.error("❌ Error while fetching review:", error);
      setReview("Error fetching review");
    }
  }

  return (
    <main>
      {/* LEFT SIDE */}
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.javascript, "javascript")
            }
            padding={10}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 18,
              backgroundColor: "#1e1e1e",
              color: "#f8f8f2",
              borderRadius: "0.7rem 2rem",
              border: "1px solid red",
              height: "100%",
              width: "100%",
              overflowY: "auto",
            }}
          />
        </div>

        {/* REVIEW BUTTON */}
        <div onClick={reviewCode} className="review">
          Review
        </div>
      </div>

      {/* RIGHT SIDE — SHOW REVIEW */}
      <div className="right">
        <Markdown>{review}</Markdown>
      </div>
    </main>
  );
}

export default App;
