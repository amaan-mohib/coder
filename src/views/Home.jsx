import { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import LinkComp from "../components/Link";
import SolvedStats from "../components/SolvedStats";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import { problemDifficulty, statusIcon } from "../utils/utils";
import LoadingScreen from "./LoadingScreen";

const StyledDiv = styled.div`
  display: flex;
  padding: 20px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  .pane1 {
    flex: 1;
    margin-right: 20px;
    width: 100%;
  }
  & > div {
    flex-direction: column;
  }
  table {
    text-align: left;
    margin-top: 10px;
    border-collapse: collapse;
  }
  thead {
    tr > th {
      border-bottom: 1px solid black;
      font-size: small;
    }
  }
  th,
  td {
    padding: 10px;
  }
  tbody tr:nth-child(even) {
    background-color: var(--nav);
  }
  .problems {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    width: 100%;
    .problem:nth-child(even) {
      background-color: var(--nav);
    }
  }
  .problem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-radius: 5px;
    width: 100%;
    padding: 0 10px;
    & > * {
      margin: 0 10px;
    }
    .stat {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0;
    }
    .title {
      font-weight: 600;
    }
    .diff {
      font-size: small;
      margin-top: 5px;
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
    .end {
      margin-left: auto;
      margin-right: 0;
    }
  }
  @media only screen and (max-width: 600px) {
    flex-direction: column-reverse;
    & > div {
      margin-bottom: 10px;
    }
  }
`;

const Home = () => {
  const [problems, setProblems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get("problems/all").then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setProblems(res.data);
      }
    });
  }, [user]);

  return (
    <main>
      <StyledDiv>
        <div className="pane1">
          <h2>Problems</h2>
          {problems.length > 0 ? (
            <div className="problems">
              {problems.map((problem) => (
                <div key={problem._id} className="problem">
                  <div className="stat">
                    {statusIcon[user ? problem.status || "loading" : "loading"]}
                  </div>
                  <div className="info">
                    <LinkComp
                      href={`/problems/${problem.titleSlug}`}
                      className="title">
                      {`${problem.number}. ${problem.title}`}
                    </LinkComp>
                    <div className={`diff diff-${problem.difficulty}`}>
                      {problemDifficulty[problem.difficulty]}
                    </div>
                  </div>
                  <div className="end">
                    <LinkComp href={`/problems/${problem.titleSlug}`}>
                      <Button>Solve</Button>
                    </LinkComp>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <LoadingScreen />
          )}
        </div>
        <div className="pane2">
          <SolvedStats />
        </div>
      </StyledDiv>
    </main>
  );
};

export default Home;
