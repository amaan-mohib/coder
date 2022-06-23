import { useEffect, useState } from "react";
import styled from "styled-components";
import { ExternalLink, Link } from "tabler-icons-react";
import LinkComp from "../components/Link";
import api from "../utils/api";

const StyledDiv = styled.div`
  padding: 10px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  .subs {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    .small {
      font-size: 14px;
      margin-top: 5px;
    }
    .sub {
      padding: 10px 20px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .title {
      font-weight: 600;
    }
    .date {
      color: var(--secondary-text);
      font-style: italic;
    }
    .desc {
      display: flex;
      flex-direction: column;
      text-align: right;
      .time {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        p {
          margin-left: 10px;
        }
      }
    }
    .sub:nth-child(even) {
      background-color: var(--nav);
    }
    .right {
      display: flex;
      align-items: center;
      .link {
        margin-left: 20px;
      }
    }
  }
`;
const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    api.get("submissions/all").then((res) => {
      if (res.status === 200) setSubmissions(res.data);
    });
  }, []);

  return (
    <main>
      <StyledDiv>
        <h2>All Submissions</h2>
        <div className="subs">
          {submissions.length > 0 &&
            submissions.map((sub) => (
              <div className="sub" key={sub.token}>
                <div className="info">
                  <LinkComp href={sub.titleSlug} className="title">
                    {sub.title}
                  </LinkComp>
                  <p className="small date">
                    {new Date(sub.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="right">
                  <div className="desc">
                    <LinkComp
                      className="link"
                      href={`/submissions/${sub.sub_id}`}
                      style={{
                        fontWeight: 600,
                        color:
                          sub.status.description === "Accepted"
                            ? "green"
                            : "red",
                      }}>
                      <p>{sub.status.description}</p>
                    </LinkComp>
                    <span className="time small">
                      <p>{sub.time ? `${sub.time} ms` : "N/A"}</p>
                      <p>|</p>
                      <p>{sub.memory ? `${sub.memory} KB` : "N/A"}</p>
                      <p>|</p>
                      <p>
                        {sub.language.name.replace(/\([^()]*\)/g, "").trim()}
                      </p>
                    </span>
                  </div>
                  <LinkComp
                    className="link"
                    href={`/submissions/${sub.sub_id}`}>
                    <ExternalLink />
                  </LinkComp>
                </div>
              </div>
            ))}
        </div>
      </StyledDiv>
    </main>
  );
};

export default Submissions;
