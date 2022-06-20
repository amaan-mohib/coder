import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ChevronDown, ChevronUp } from "tabler-icons-react";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import { problemDifficulty } from "../utils/utils";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--nav);
  border-radius: 3px;
  padding: 10px;
  margin: 10px 0;
  .accordion {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > div {
      display: flex;
      align-items: center;
    }
  }
  .ml {
    margin-left: 10px;
  }
`;
const Dashboard = () => {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user && !user.admin) {
      router.replace("/login");
      return;
    }
    getList();
  }, [user]);

  const getList = () => {
    api.get("problems/unapproved").then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setList(res.data);
      }
    });
  };

  const approve = (id) => {
    api.patch("problems/approve", { _id: id }).then((res) => {
      if (res.status === 200) {
        setSelected(null);
        getList();
      }
    });
  };
  return (
    <main>
      <StyledDiv>
        <h1>Approve Contributions</h1>
        {list.map((item) => (
          <ListItem key={item._id}>
            <div
              className="accordion"
              onClick={() =>
                setSelected(selected === item._id ? null : item._id)
              }>
              <div>
                <h4>{`${item.number}. ${item.title}`}</h4>
                &nbsp;
                <span>{`(${problemDifficulty[item.difficulty]})`}</span>
              </div>
              <div>
                <Button onClick={() => approve(item._id)}>Approve</Button>
                {selected === item._id ? (
                  <ChevronUp className="ml" />
                ) : (
                  <ChevronDown className="ml" />
                )}
              </div>
            </div>
            {selected === item._id && (
              <>
                <hr />
                <div className="accordion-item">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.description,
                    }}></div>
                </div>
              </>
            )}
          </ListItem>
        ))}
      </StyledDiv>
    </main>
  );
};

export default Dashboard;
