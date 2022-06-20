import { useEffect, useState } from "react";
import styled from "styled-components";
import LinkComp from "../components/Link";
import api from "../utils/api";
import { problemDifficulty } from "../utils/utils";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
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
`;

const Home = () => {
  const [problems, setProblems] = useState([]);
  useEffect(() => {
    api.get("problems/all").then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setProblems(res.data);
      }
    });
  }, []);
  return (
    <main>
      <StyledDiv>
        <h1>Problems</h1>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Title</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id}>
                <td></td>
                <td>
                  <LinkComp href={`/problems/${problem.titleSlug}`}>
                    {`${problem.number}. ${problem.title}`}
                  </LinkComp>
                </td>
                <td>{problemDifficulty[problem.difficulty]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </StyledDiv>
    </main>
  );
};

export default Home;
