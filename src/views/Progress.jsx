import { useEffect, useState } from "react";
import styled from "styled-components";
import LinkComp from "../components/Link";
import api from "../utils/api";
import { problemDifficulty } from "../utils/utils";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  table {
    width: 100%;
    text-align: left;
    margin-top: 20px;
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
  .date {
    color: var(--secondary-text);
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
  .title {
    font-weight: 500;
  }
`;
const Progress = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    api
      .get("progress")
      .then((res) => {
        console.log(res.data);
        setList(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <main>
      <StyledDiv>
        <h2>Progress</h2>
        <div>
          {list.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Last Solved</th>
                  <th>Question</th>
                  <th>Difficulty</th>
                  <th>Rejected</th>
                  <th>Accepted</th>
                </tr>
              </thead>
              <tbody>
                {list.map((sub) => (
                  <tr key={sub._id}>
                    <td className="date">
                      {new Date(sub.last_solved).toLocaleString()}
                    </td>
                    <td>
                      <LinkComp
                        href={`/problems/${sub.titleSlug}`}
                        className="title">
                        {`${sub.number}. ${sub.title}`}
                      </LinkComp>
                    </td>
                    <td className={`diff diff-${sub.difficulty}`}>
                      {problemDifficulty[sub.difficulty]}
                    </td>
                    <td>{sub.rejected}</td>
                    <td>{sub.accepted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Solve some problems to view your progress</p>
          )}
        </div>
      </StyledDiv>
    </main>
  );
};

export default Progress;
