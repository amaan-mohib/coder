import styled from "styled-components";
import Button from "../components/Button";
import dynamic from "next/dynamic";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import { useState } from "react";
import api from "../utils/api";
import Helmet from "../HOC/Helmet";

const mdParser = new MarkdownIt();
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

const StyledDiv = styled.div`
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  padding: 20px;

  form {
    display: flex;
    flex-direction: column;
    & > * {
      margin: 8px 0;
    }

    input,
    select,
    textarea {
      max-width: 400px;
    }
    .signup {
      font-size: small;
      text-align: center;
      color: var(--secondary-text);
    }
    button {
      max-width: 300px;
      justify-content: center;
    }
  }
  label {
    margin-bottom: 0;
  }

  .error {
    color: red;
    font-size: small;
  }
  .mono {
    font-family: monospace !important;
  }
  .submit {
    align-self: flex-end;
    min-width: 180px;
  }
`;
const Contribute = ({ edit, editFunc, data }) => {
  const [title, settitle] = useState(data?.title || "");
  const [difficulty, setdifficulty] = useState(data?.difficulty || 0);
  const [testcases, settestcases] = useState(data?.testCases || "");
  const [example, setExample] = useState(data?.example || "");
  const [output, setoutput] = useState(data?.expectedOutput || "");
  const [description, setdescription] = useState(data?.description || "");
  const [descriptionMD, setdescriptionMD] = useState("");

  const reset = {
    title: null,
    testcase: null,
    output: null,
    description: null,
    all: null,
  };
  const [errors, setErrors] = useState(reset);

  function handleEditorChange({ html, text }) {
    setdescription(html);
    setdescriptionMD(text);
  }
  const validate = (title, testcase, output, description, example) => {
    if (
      !title.trim() ||
      !testcase.trim() ||
      !example.trim() ||
      !output.trim() ||
      !description.trim()
    ) {
      setErrors({ ...reset, all: "All fields are required" });
      return false;
    }

    return true;
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (validate(title, testcases, output, description, example)) {
      if (edit) {
        editFunc(data._id, {
          title,
          description,
          output,
          difficulty,
          testcases,
          example,
        });
      } else {
        api
          .post("problems/submit", {
            title,
            description,
            output,
            difficulty,
            testcases,
            example,
          })
          .then((res) => {
            if (res.status === 200) {
              alert("Your question has been sent for approval");
              setErrors(reset);
            } else {
              console.error(res);
              setErrors({ ...reset, all: res.data });
            }
          });
      }
    }
  };
  return (
    <main>
      {!edit && <Helmet title="Contribute" />}
      <StyledDiv>
        {!edit && <h1>Contribute a question</h1>}
        <hr />
        <form onSubmit={onSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Pick a title"
            value={title}
            onChange={(e) => settitle(e.target.value)}
          />
          <label htmlFor="difficulty">Difficulty</label>
          <select
            name="difficulty"
            value={difficulty}
            onChange={(e) => setdifficulty(e.target.value)}>
            <option value={0}>Easy</option>
            <option value={1}>Medium</option>
            <option value={2}>Hard</option>
          </select>
          <label htmlFor="testcases">Example Input</label>
          <textarea
            rows={5}
            type="text"
            name="example"
            placeholder="Example input for the program"
            className="mono"
            value={example}
            onChange={(e) => setExample(e.target.value)}
          />
          <label htmlFor="testcases">Testcases</label>
          <textarea
            rows={10}
            type="text"
            name="testcases"
            placeholder="Input for the program"
            className="mono"
            value={testcases}
            onChange={(e) => settestcases(e.target.value)}
          />
          <label htmlFor="output">Expected Output</label>
          <textarea
            type="text"
            rows={5}
            name="output"
            placeholder="Expected output"
            className="mono"
            value={output}
            onChange={(e) => setoutput(e.target.value)}
          />
          <label htmlFor="description">Description</label>
          {edit ? (
            <textarea
              type="text"
              rows={15}
              name="desc"
              placeholder="Description in HTML"
              className="mono"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            />
          ) : (
            <MdEditor
              style={{ height: "500px" }}
              value={descriptionMD}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
            />
          )}
          {errors.all && <p className="error">{errors.all}</p>}
          <Button type="submit" className="submit">
            Submit
          </Button>
        </form>
      </StyledDiv>
    </main>
  );
};

export default Contribute;
