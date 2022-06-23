import { useEffect, useState } from "react";
import styled from "styled-components";
import LinkComp from "../components/Link";
import SolvedStats from "../components/SolvedStats";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
  .top {
    display: flex;
  }
  .profile {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px 20px;
    border-radius: 4px;
    background-color: var(--nav);
    border: 1px solid var(--shadow);
    margin-right: 10px;
    .username,
    .email {
      color: var(--secondary-text);
    }
    .email {
      font-size: 14px;
      margin-top: 10px;
    }
  }
  .recent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    border-radius: 5px;
  }
  .recent:nth-child(even) {
    background-color: var(--background);
    border: 1px solid var(--shadow);
  }
  .subs {
    margin-top: 10px;
    h3 {
      margin-bottom: 10px;
    }
  }
  .title {
    font-weight: 500;
  }
  .date {
    font-size: 14px;
    color: var(--secondary-text);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
const Profile = () => {
  const { user } = useAuth();
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get("userinfo/recentaccept").then((res) => {
      console.log(res.data);
      setRecent(res.data);
    });
  }, [user]);
  if (!user) return <div></div>;
  return (
    <main>
      <StyledDiv>
        <div className="top">
          <div className="profile">
            <h2>{user.name}</h2>
            <p className="username">{user.username}</p>
            <p className="email">{user.email}</p>
          </div>
          <SolvedStats />
        </div>
        <div className="profile subs">
          <div className="header">
            <h3>Recent Submissions</h3>
            <LinkComp href="/submissions" className="date">
              View all &gt;
            </LinkComp>
          </div>
          {recent.length > 0 ? (
            recent.map((data) => (
              <LinkComp
                href={`/submissions/${data.sub_id}`}
                className="recent"
                key={data._id}>
                <p className="title">{data.title}</p>
                <p className="date">
                  {new Date(data.last_solved).toLocaleString()}
                </p>
              </LinkComp>
            ))
          ) : (
            <p>Nothing found</p>
          )}
        </div>
      </StyledDiv>
    </main>
  );
};

export default Profile;
