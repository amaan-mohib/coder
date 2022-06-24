import styled from "styled-components";
import { Plus } from "tabler-icons-react";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import dynamic from "next/dynamic";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import { useEffect, useState } from "react";
import api from "../utils/api";
import LinkComp from "../components/Link";

const mdParser = new MarkdownIt();
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
  .head {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 0;
    & > * {
      margin-left: 10px;
    }
  }
  .form {
    display: flex;
    flex-direction: column;
  }
  form {
    display: flex;
    flex-direction: column;
    .head {
      padding: 0;
    }
    & > * {
      margin: 8px 0;
    }

    input,
    select,
    textarea {
      max-width: 400px;
    }
    .signup {
      font-size: small;
      text-align: center;
      color: var(--secondary-text);
    }
    button {
      max-width: 300px;
    }
  }
  label {
    margin-bottom: 0;
  }

  .error {
    color: red;
    font-size: small;
  }
  .mono {
    font-family: monospace !important;
  }
  .row {
    display: flex;
    flex-direction: column;
    .title {
      font-weight: 600;
      font-size: 20px;
    }
    .info {
      font-size: small;
      color: var(--secondary-text);
    }
  }
`;

const DiscussForm = ({ setShowForm, setRefresh, topic }) => {
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [descriptionMD, setdescriptionMD] = useState("");

  const reset = {
    title: null,
    description: null,
    all: null,
  };
  const [errors, setErrors] = useState(reset);

  function handleEditorChange({ html, text }) {
    setdescription(html);
    setdescriptionMD(text);
  }

  const validate = (title, description) => {
    if (!title.trim() || !description.trim()) {
      setErrors({ ...reset, all: "All fields are required" });
      return false;
    }

    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate(title, description)) {
      api
        .post("discussion/post", {
          title,
          description,
          topic: topic || "general",
        })
        .then((res) => {
          if (res.status === 200) {
            alert("Your discussion has been posted");
            setErrors(reset);
            setRefresh((p) => !p);
          } else {
            console.error(res);
          }
        });
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="head">
        <Button outlined onClick={() => setShowForm(false)}>
          Cancel
        </Button>
        <Button type="submit">Post</Button>
      </div>
      <input
        type="text"
        placeholder="Title"
        name="title"
        value={title}
        onChange={(e) => settitle(e.target.value)}
      />
      {errors.title && <p className="error">{errors.title}</p>}
      <MdEditor
        style={{ height: "500px" }}
        value={descriptionMD}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
      />
      {errors.description && <p className="error">{errors.description}</p>}
      {errors.all && <p className="error">{errors.all}</p>}
    </form>
  );
};
const Discuss = ({ topic, name }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    api
      .get(`discussion/all?topic=${topic ? topic : "general"}`)
      .then((res) => {
        console.log(res.data);
        setList(res.data);
      })
      .catch((err) => console.error(err));
  }, [refresh]);

  return (
    <main>
      <StyledDiv>
        <h3>{name || "General Discussions"}</h3>
        {user && (
          <div className="form">
            {showForm ? (
              <DiscussForm
                setShowForm={setShowForm}
                setRefresh={setRefresh}
                topic={topic}
              />
            ) : (
              <div className="head">
                <Button startIcon={<Plus />} onClick={() => setShowForm(true)}>
                  New
                </Button>
              </div>
            )}
          </div>
        )}
        <hr />
        {list.length > 0 ? (
          list.map((data, index) => (
            <div key={data._id} className="row">
              <LinkComp
                href={`/discuss/${data.discussion_id}`}
                className="title">
                {data.title}
              </LinkComp>
              <p className="info">{`${data.submitted_by.name} (${
                data.submitted_by.username
              }) | ${new Date(data.timestamp).toLocaleString()}`}</p>
              {index !== list.length - 1 && <hr />}
            </div>
          ))
        ) : (
          <p>Wow! it's empty</p>
        )}
      </StyledDiv>
    </main>
  );
};

export default Discuss;
