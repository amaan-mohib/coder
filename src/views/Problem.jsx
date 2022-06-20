import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import api, { judge0Api } from "../utils/api";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Editor from "@monaco-editor/react";
import "react-tabs/style/react-tabs.css";
import "react-markdown-editor-lite/lib/index.css";
import Button from "../components/Button";
import { problemDifficulty } from "../utils/utils";
import LoadingScreen from "./LoadingScreen";
import Loader from "../components/Loader";
import { ChevronDown, Terminal2 } from "tabler-icons-react";
import LinkComp from "../components/Link";

const StyledDiv = styled.div`
  display: flex;
  height: calc(100vh - var(--nav-height));
  overflow: hidden;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .diff {
    font-size: small;
  }
  .diff-0 {
    color: green;
  }
  .diff-1 {
    color: orangered;
  }
  .diff-2 {
    color: red;
  }
  .panel {
    padding: 10px 15px;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-left: 1px solid var(--shadow);
  }
  .left,
  .right {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  .editor * {
    font-family: monospace !important;
  }
  .editor {
    textarea:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  }
  .tabs {
    font-size: 12px;
    border-bottom: 1px solid #aaa;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    /* border-bottom: 1px solid var(--shadow); */
    select {
      width: min-content;
      font-size: 12px;
      padding: 5px 8px;
    }
  }
  .footer {
    border-bottom: 0;
    border-top: 1px solid var(--shadow);
    justify-content: space-between;
    & > div > * {
      margin-left: 10px;
    }
    position: relative;
    font-size: small;
  }
  .test-window {
    position: absolute;
    overflow: auto;
    top: 0;
    width: 100%;
    right: 0;
    transform: translateY(-101%);
    z-index: 100;
    background-color: var(--background);
    min-height: 150px;
    max-height: 200px;
    border-top: 1px solid var(--shadow);
    padding: 10px;
    .test-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      .but {
        cursor: pointer;
      }
    }
    pre {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      p {
        font-size: 14px;
      }
    }
  }
  .time {
    color: var(--secondary-text);
  }
  .custom-html-style {
    pre {
      padding: 10px;
    }
  }
  .description {
    display: flex;
    flex-direction: column;
    table {
      width: 100%;
      text-align: left;
      margin-top: 10px;
      border-collapse: collapse;
    }
    thead {
      tr > th {
        /* border-bottom: 1px solid var(--shadow); */
        font-size: small;
        font-weight: normal;
        color: var(--secondary-text);
      }
    }
    th,
    td {
      padding: 10px;
      font-size: small;
    }
    table,
    th,
    td {
      border: 1px solid var(--shadow);
    }
    tbody tr:nth-child(even) {
      background-color: var(--nav);
    }
  }
  .submission-result {
    display: flex;
    flex-direction: column;
    .info {
      font-size: small;
      margin: 10px 0;
    }
    .big {
      font-size: medium;
      font-weight: 500;
    }
    pre {
      display: flex;
    }
    pre,
    code {
      width: 100%;
    }
  }
`;

const Description = ({ problem }) => {
  return (
    <div className="panel">
      <div className="title">
        <h4>{`${problem.number}. ${problem.title}`}</h4>
        <p className={`diff diff-${problem.difficulty}`}>
          {problemDifficulty[problem.difficulty]}
        </p>
      </div>
      <hr />
      <div
        className="custom-html-style"
        dangerouslySetInnerHTML={{ __html: problem.description }}></div>
    </div>
  );
};

const Submission = ({ submissionList, submitting, submissionResult, name }) => {
  return (
    <div className="panel description">
      {submitting ? (
        <LoadingScreen />
      ) : (
        submissionResult && (
          <div className="submission-result">
            <span style={{ margin: "10px 0" }}>
              <span
                style={{
                  fontWeight: 600,
                  color:
                    submissionResult.status.description === "Accepted"
                      ? "green"
                      : "red",
                }}>
                {submissionResult.status.description}
              </span>
            </span>
            {submissionResult.time ? (
              <span className="info">
                {"Took "}
                <span className="big">{`${submissionResult.time} ms`}</span>
                {", with "}
                <span className="big">{`${submissionResult.memory} KB`}</span>
                {" in "}
                <span>{`${submissionResult.language.name}`}</span>
                {` for ${name}`}
              </span>
            ) : (
              <pre>
                <code>{decodeBase64(submissionResult.compile_output)}</code>
              </pre>
            )}
            <hr />
          </div>
        )
      )}
      <div>
        {submissionList.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Submitted At</th>
                <th>Status</th>
                <th>Runtime</th>
                <th>Memory</th>
                <th>Language</th>
              </tr>
            </thead>
            <tbody>
              {submissionList.map((sub) => (
                <tr key={sub._id}>
                  <td>{`${new Date(sub.timestamp).toLocaleString()}`}</td>
                  <td>
                    <LinkComp
                      href={`/`}
                      style={{
                        color:
                          sub.status.description === "Accepted"
                            ? "green"
                            : "red",
                      }}>
                      {sub.status.description}
                    </LinkComp>
                  </td>
                  <td>{`${sub.time} ms`}</td>
                  <td>{`${sub.memory} KB`}</td>
                  <td>{sub.language.name.replace(/\([^()]*\)/g, "").trim()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
const encodeBase64 = (value) => Buffer.from(value).toString("base64");
const decodeBase64 = (value) => Buffer.from(value, "base64").toString();

const Problem = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [problem, setProblem] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [code, setCode] = useState("");
  const [theme, setTheme] = useState("light");
  const [languages, setlanguages] = useState([]);
  const [submissionList, setSubmissionList] = useState([]);
  const [language, setlanguage] = useState("cpp");
  const [languageCode, setlanguageCode] = useState(54);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const themes = [
    { name: "Light", value: "light" },
    { name: "Dark", value: "vs-dark" },
  ];

  useEffect(() => {
    judge0Api
      .get("languages")
      .then((res) => {
        // console.log(res.data);
        setlanguages(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (languages.length > 0) setlanguage(getCleanedLang(languageCode));
  }, [languageCode, languages]);

  useEffect(() => {
    if (!slug) return;
    api.get("problems/" + slug).then((res) => {
      if (res.status === 200) {
        setProblem(res.data);
        console.log(res.data);
      }
    });
    getSubmissionList();
  }, [slug]);

  const getSubmissionList = () => {
    api.get("submissions/" + slug).then((res) => {
      if (res.status === 200) {
        setSubmissionList(res.data);
        console.log(res.data);
      }
    });
  };

  const handleEditorChange = (val, event) => {
    // console.log(val, event);
    setCode(val);
  };

  const getCleanedLang = (code) => {
    const lang = languages.filter((lang) => lang.id == code)[0].name;
    const cleanedLang = lang
      .replace(/\([^()]*\)/g, "")
      .toLowerCase()
      .trim();
    if (cleanedLang === "c++") cleanedLang = "cpp";
    if (cleanedLang === "c#") cleanedLang = "csharp";

    return cleanedLang;
  };

  const onSubmit = (type) => {
    if (!code.trim()) return;
    const data = JSON.stringify({
      stdin: encodeBase64(problem.testCases),
      expected_output: encodeBase64(problem.expectedOutput),
      source_code: encodeBase64(code),
      language_id: languageCode,
    });
    console.log(data);
    setRunning(true);
    if (type === 0) setTesting(true);
    if (type === 1) {
      setTabIndex(2);
      setSubmitting(true);
    }
    judge0Api
      .post("submissions", data, {
        params: {
          wait: true,
          base64_encoded: true,
          fields:
            "stdout,time,memory,stderr,token,compile_output,message,status,status_id,language",
        },
      })
      .then((res) => {
        setRunning(false);
        setSubmissionResult(res.data);
        console.log(res.data);
        if (type === 1) {
          setSubmittedResult(res.data);
          api
            .post("/submissions", {
              ...res.data,
              code,
              title: problem.title,
              titleSlug: problem.titleSlug,
            })
            .then(() => {
              setSubmitting(false);
              getSubmissionList();
            })
            .catch((err) => {
              setSubmitting(false);
              console.error(err);
            });
        }
      })
      .catch((err) => {
        setRunning(false);
        console.error(err);
      });
  };

  const onLangChange = (e) => {
    setlanguageCode(e.target.value);
  };
  const onThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <main>
      {problem ? (
        <StyledDiv>
          <Tabs
            className="left"
            disableUpDownKeys={true}
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}>
            <TabList className="tabs">
              <Tab>Description</Tab>
              <Tab>Discussion</Tab>
              <Tab>Submissions</Tab>
            </TabList>
            <TabPanel>
              <Description problem={problem} />
            </TabPanel>
            <TabPanel></TabPanel>
            <TabPanel>
              <Submission
                submissionList={submissionList}
                submitting={submitting}
                submissionResult={submittedResult}
                name={problem.title}
              />
            </TabPanel>
          </Tabs>
          <div className="right">
            <div className="header">
              <select onChange={onLangChange} value={languageCode}>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id} name={lang.name}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <select onChange={onThemeChange} value={theme}>
                {themes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <Editor
              className="editor"
              value={code}
              language={language}
              loading={<Loader />}
              onChange={handleEditorChange}
              theme={theme}
              options={{ minimap: false, scrollBeyondLastLine: false }}
            />
            <div className="header footer">
              <Terminal2
                size={18}
                onClick={() => setTesting(!testing)}
                style={{ cursor: "pointer" }}
              />
              {testing && (
                <span className="test-window">
                  <div className="test-title">
                    <p className="time">
                      {running
                        ? "—"
                        : submissionResult?.time
                        ? `${submissionResult?.time} ms`
                        : "—"}
                    </p>
                    <ChevronDown
                      size={18}
                      className="but"
                      onClick={() => !running && setTesting(false)}
                    />
                  </div>
                  {running ? (
                    <Loader size={24} />
                  ) : submissionResult ? (
                    <pre>
                      {submissionResult?.compile_output && (
                        <>
                          <p>Compilation Error</p>
                          <code>
                            {decodeBase64(submissionResult?.compile_output)}
                          </code>
                        </>
                      )}
                      {submissionResult?.stdout && (
                        <>
                          <p>Output</p>
                          <code>{decodeBase64(submissionResult?.stdout)}</code>
                        </>
                      )}
                    </pre>
                  ) : (
                    <p>Run your code first</p>
                  )}
                </span>
              )}
              <div>
                <Button outlined onClick={() => onSubmit(0)} disabled={running}>
                  Test Code
                </Button>
                <Button onClick={() => onSubmit(1)} disabled={running}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </StyledDiv>
      ) : (
        <LoadingScreen />
      )}
    </main>
  );
};

export default Problem;
