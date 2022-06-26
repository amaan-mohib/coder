import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api, { judge0Api } from "../utils/api";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Editor from "@monaco-editor/react";
import "react-tabs/style/react-tabs.css";
import "react-markdown-editor-lite/lib/index.css";
import Button from "../components/Button";
import LoadingScreen from "./LoadingScreen";
import Loader from "../components/Loader";
import { ChevronDown, Terminal2 } from "tabler-icons-react";
import Discuss from "./Discuss";
import { useAuth } from "../contexts/AuthContext";
import StyledDiv from "./Problem.styles";
import { Description, Submission } from "../components/ProblemComp";
import Helmet from "../HOC/Helmet";

export const encodeBase64 = (value) => Buffer.from(value).toString("base64");
export const decodeBase64 = (value) => Buffer.from(value, "base64").toString();

const Problem = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { user } = useAuth();
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

  useEffect(() => {
    let val = localStorage.getItem(`${slug}_${languageCode}`);
    if (val) {
      val = JSON.parse(val);
      setCode(val);
    } else {
      setCode("");
    }
  }, [languageCode, slug]);

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
    localStorage.setItem(`${slug}_${languageCode}`, JSON.stringify(val));
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
      stdin: encodeBase64(type === 0 ? problem.example : problem.testCases),
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
        } else {
          setSubmissionResult(res.data);
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
      <Helmet title={problem?.title || "Loading"} />
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
            <TabPanel>
              <Discuss
                name={`${problem.number}. ${problem.title}`}
                topic={problem.titleSlug}
              />
            </TabPanel>
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
                      {running && !submitting
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
                  {running && !submitting ? (
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
                      {submissionResult.message && (
                        <p>{decodeBase64(submissionResult.message)}</p>
                      )}
                      {submissionResult?.stderr && (
                        <>
                          <code>{decodeBase64(submissionResult?.stderr)}</code>
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
                <Button onClick={() => onSubmit(1)} disabled={!user || running}>
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
