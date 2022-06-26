import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "react-markdown-editor-lite/lib/index.css";
import styled from "styled-components";
import { ChevronDown, ChevronUp } from "tabler-icons-react";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import { problemDifficulty } from "../utils/utils";
import Contribute from "./Contribute";
import Helmet from "../HOC/Helmet";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
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
  .actions {
    display: flex;
    padding: 10px 0;
    justify-content: flex-end;
    & > * {
      margin-left: 10px;
    }
  }
`;

const AccordionList = ({ list, getList, approval }) => {
  const [selected, setSelected] = useState(null);
  const [formstate, setForm] = useState(false);
  if (list.length < 1) return null;

  const approve = (id, approved) => {
    api.patch("problems/approve", { _id: id, approved }).then((res) => {
      if (res.status === 200) {
        setSelected(null);
        getList();
      }
    });
  };
  const edit = (id, data) => {
    api.patch("problems/edit", { _id: id, ...data }).then((res) => {
      if (res.status === 200) {
        setSelected(null);
        getList();
      }
    });
  };
  const del = (id) => {
    if (!confirm("Do you to delete the record?")) return;
    api.delete("problems/delete", { _id: id }).then((res) => {
      if (res.status === 200) {
        setSelected(null);
        getList();
      }
    });
  };

  return list.map((item) => (
    <ListItem key={item._id}>
      <div
        className="accordion"
        onClick={() => setSelected(selected === item._id ? null : item._id)}>
        <div>
          <h4>{`${item.number}. ${item.title}`}</h4>
          &nbsp;
          <span>{`(${problemDifficulty[item.difficulty]})`}</span>
        </div>
        <div>
          <Button onClick={() => approve(item._id, approval)}>
            {approval ? "Approve" : "Unapprove"}
          </Button>
          {selected === item._id ? (
            <ChevronUp className="ml" />
          ) : (
            <ChevronDown className="ml" />
          )}
        </div>
      </div>
      {selected === item._id &&
        (formstate ? (
          <div>
            <Button onClick={() => setForm(false)}>Cancel</Button>
            <Contribute edit data={item} editFunc={edit} />
          </div>
        ) : (
          <>
            <hr />
            <div className="accordion-item">
              <div
                className="custom-html-style"
                dangerouslySetInnerHTML={{
                  __html: item.description,
                }}></div>
            </div>
            <div className="actions">
              <Button outlined onClick={() => del(item._id)}>
                Delete
              </Button>
              <Button onClick={() => setForm(true)}>Edit</Button>
            </div>
          </>
        ))}
    </ListItem>
  ));
};

const Dashboard = () => {
  const [list, setList] = useState([]);
  const [approvedList, setApprovedList] = useState([]);
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
    api.get("problems/approved").then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setApprovedList(res.data);
      }
    });
  };

  return (
    <main>
      <Helmet title="Dashboard" />
      <StyledDiv>
        <Tabs>
          <TabList>
            <Tab>Unapproved Contributions</Tab>
            <Tab>Approved Contributions</Tab>
          </TabList>
          <TabPanel>
            <AccordionList list={list} getList={getList} approval />
          </TabPanel>
          <TabPanel>
            <AccordionList
              list={approvedList}
              getList={getList}
              approval={false}
            />
          </TabPanel>
        </Tabs>
      </StyledDiv>
    </main>
  );
};

export default Dashboard;
