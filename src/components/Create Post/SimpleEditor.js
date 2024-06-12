/* eslint-disable no-debugger */
import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const SimpleEditor = ({
  handlePostBodyChange,
  toolBarID,
  oldValue,
  PreviewClassName,
}) => {
  const [editorHtml, setEditorHtml] = useState(oldValue);
  const quillRef = useRef(null);
  useEffect(() => {
    const editor = quillRef.current.getEditor();
    editor.on("text-change", () => {
      setEditorHtml(editor.root.innerHTML);
    });
  }, []);

  const handleChange = (html) => {
    setEditorHtml(html);
    handlePostBodyChange(html);
  };

  return (
    <div className="Editor-wrapper" id="Editor">
      <div id={toolBarID}>
        <select className="ql-header" defaultValue="">
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
          <option value="">Normal</option>
        </select>
        <select className="ql-size">
          <option defaultValue="small"></option>
          <option value="normal"></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
        <button className="ql-bold">Bold</button>
        <button className="ql-italic">Italic</button>
        <button className="ql-underline">Underline</button>
        <button className="ql-strike">strike</button>
        <button className="ql-blockquote">blockquote</button>
        <button className="ql-clean">clean</button>
        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <button className="ql-link">Link</button>

        <select className="ql-align">
          <option defaultValue=""></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>
      </div>
      <ReactQuill
        modules={{
          toolbar: {
            container: `#${toolBarID}`,
          },
        }}
        ref={quillRef}
        onChange={handleChange}
        theme="snow"
        value={editorHtml}
      />
      <h5 style={{ marginTop: "20px" }}>Live Preview:</h5>
      <div
        className={`Preview ${PreviewClassName}`}
        dangerouslySetInnerHTML={{ __html: editorHtml }}
      ></div>
    </div>
  );
};

export default SimpleEditor;
