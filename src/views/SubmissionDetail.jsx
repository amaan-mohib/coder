import Editor from "@monaco-editor/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import LinkComp from "../components/Link";
import Loader from "../components/Loader";
import Helmet from "../HOC/Helmet";
import api from "../utils/api";
import LoadingScreen from "./LoadingScreen";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
  padding: 20px;
  & > div > * {
    margin: 15px 0;
  }
  .editor * {
    font-family: monospace !important;
  }
  .editor {
    border: 1px solid var(--shadow);
    textarea:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  }
  .detail {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--nav);
    padding: 20px;
    border-radius: 4px;
    border: 1px solid var(--shadow);

    & > span {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      color: var(--secondary-text);
      & > span {
        margin: 8px 0;
      }
    }
  }
  .big {
    font-size: medium;
    color: initial;
    font-weight: 500;
  }
  .right {
    text-align: right;
  }
  .lang {
    font-size: 14px;
    color: var(--secondary-text);
  }
`;

const SubmissionDetail = () => {
  const router = useRouter();
  const { sid } = router.query;
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!sid) return;
    api
      .get(`submissions/detail/${sid}`)
      .then((res) => {
        console.log(res.data);
        setDetails(res.data);
      })
      .catch((err) => console.error(err));
  }, [sid]);

  const getLang = (lang) => {
    let cleanedLang = lang
      .replace(/\([^()]*\)/g, "")
      .toLowerCase()
      .trim();
    if (cleanedLang == "c++") cleanedLang = "cpp";
    if (cleanedLang == "c#") cleanedLang = "csharp";
    return cleanedLang;
  };

  return (
    <main>
      <Helmet title={`${details?.title || "Loading"} - Submission Details`} />
      <StyledDiv>
        {details ? (
          <div>
            <LinkComp href={`/problems/${details.titleSlug}`}>
              <h2>{details.title}</h2>
            </LinkComp>
            <h3>Submission Detail</h3>
            <div className="detail">
              <span>
                <span>
                  {"Runtime: "}
                  <span className="big">
                    {details.time ? `${details.time} ms` : "N/A"}
                  </span>
                </span>
                <span>
                  {"Memory Usage: "}
                  <span className="big">
                    {details.memory ? `${details.memory} KB` : "N/A"}
                  </span>
                </span>
              </span>
              <span className="right">
                <span>
                  {"Status: "}
                  <span
                    className="big"
                    style={{
                      fontWeight: 600,
                      color:
                        details.status.description === "Accepted"
                          ? "green"
                          : "red",
                    }}>
                    {details.status.description}
                  </span>
                </span>
                <span>
                  {"Submitted At: "}
                  <span className="big">
                    {new Date(details.timestamp).toLocaleString()}
                  </span>
                </span>
              </span>
            </div>
            <hr />
            <h3>Submitted Code</h3>
            <p className="lang">{`Language: ${details.language.name}`}</p>
            <Editor
              className="editor"
              value={details.code}
              language={getLang(details.language.name)}
              loading={<Loader />}
              options={{
                domReadOnly: true,
                minimap: false,
                scrollBeyondLastLine: false,
              }}
              height={details.code.split("\r\n").length * 2 * 10 + "px"}
            />
          </div>
        ) : (
          <LoadingScreen />
        )}
      </StyledDiv>
    </main>
  );
};

export default SubmissionDetail;
