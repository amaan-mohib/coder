import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

import "react-circular-progressbar/dist/styles.css";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 250px;
  max-width: 400px;
  width: 100%;
  padding: 10px 20px;
  border-radius: 4px;
  background-color: var(--nav);
  border: 1px solid var(--shadow);
  position: sticky;

  .header {
    color: var(--secondary-text);
    font-size: 14px;
  }
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .desc {
    display: flex;
    flex-direction: column;
  }
  .progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    padding-left: 0;
    min-width: 100px;
    min-height: 100px;
    width: min-content;
    height: min-content;
    hr {
      width: 50%;
    }
  }
  .all {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: -5px;
  }
  .total {
    color: var(--secondary-text);
    font-size: small;
  }
  .desc {
    font-size: 14px;
    margin-left: 10px;
    width: 100%;
  }
  .diff {
    display: flex;
    justify-content: space-between;
    margin: 2px 0;
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
  .big {
    margin-left: 15px;
    font-weight: 500;
  }
`;
const SolvedStats = () => {
  const { user } = useAuth();
  const [details, setDetails] = useState({
    all: 0,
    total: 1,
    easy: 0,
    medium: 0,
    hard: 0,
  });

  useEffect(() => {
    if (!user) return;
    api
      .get("userinfo/solved")
      .then((res) => {
        console.log(res.data);
        setDetails(res.data);
      })
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <StyledDiv>
      {user ? (
        <>
          <p className="header">Solved Problems</p>
          <div>
            <div className="info">
              <div className="progress">
                <CircularProgressbarWithChildren
                  value={details.all}
                  maxValue={details.total}
                  strokeWidth={5}
                  styles={buildStyles({
                    pathColor: "black",
                    trailColor: "var(--shadow)",
                  })}>
                  <span className="all">{details.all}</span>
                  <hr />
                  <span className="total">{details.total}</span>
                </CircularProgressbarWithChildren>
              </div>
              <div className="desc">
                <span className="diff diff-0">
                  {"Easy "}
                  <span className="big">{details.easy}</span>
                </span>
                <span className="diff diff-1">
                  {"Medium "}
                  <span className="big">{details.medium}</span>
                </span>
                <span className="diff diff-2">
                  {"Hard "}
                  <span className="big">{details.hard}</span>
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Sign in to see progress</p>
      )}
    </StyledDiv>
  );
};

export default SolvedStats;
