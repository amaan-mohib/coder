import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../utils/api";
import "react-markdown-editor-lite/lib/index.css";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import Helmet from "../HOC/Helmet";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 0 auto;
  max-width: 800px;
  width: 100%;
  .info {
    color: var(--secondary-text);
    font-size: small;
  }
  .description {
    padding: 5px 0;
  }
  .form {
    display: flex;
    align-items: flex-start;
    margin: 10px 0;
    textarea {
      width: 100%;
      margin-right: 10px;
    }
  }
`;
const Discussion = () => {
  const [data, setData] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  const { discussion_id } = router.query;
  const { user } = useAuth();
  useEffect(() => {
    if (!discussion_id) return;
    api
      .get(`discussion/${discussion_id}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.error(err));
  }, [discussion_id]);
  useEffect(() => {
    api
      .get(`comment/${discussion_id}`)
      .then((res) => {
        console.log(res.data);
        setComments(res.data);
      })
      .catch((err) => console.error(err));
  }, [refresh]);

  const onSubmit = () => {
    if (!comment.trim()) return;
    api
      .post("comment/post", {
        discussion_id,
        description: comment,
      })
      .then(() => {
        setRefresh(!refresh);
      })
      .catch((err) => console.error(err));
  };
  return (
    <main>
      <Helmet title={data?.title || "Not Found"} />
      <StyledDiv>
        {data && (
          <div>
            <h3>{data.title}</h3>
            <hr />
            <p className="info">
              {`${data.submitted_by.name} (${
                data.submitted_by.username
              }) | ${new Date(data.timestamp).toLocaleString()}`}
            </p>
            <div
              className="description custom-html-style"
              dangerouslySetInnerHTML={{ __html: data.description }}></div>
            <hr />
          </div>
        )}
        <p className="info">{`Comments (${comments.length})`}</p>
        {user && (
          <div className="form">
            <textarea
              placeholder="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={onSubmit}>Post</Button>
          </div>
        )}
        <div>
          {comments.length > 0 &&
            comments.map((cmt) => (
              <div>
                <hr />
                <p className="info">
                  {`${cmt.submitted_by.name} (${
                    cmt.submitted_by.username
                  }) | ${new Date(cmt.timestamp).toLocaleString()}`}
                </p>
                <p>{cmt.description}</p>
              </div>
            ))}
        </div>
      </StyledDiv>
    </main>
  );
};

export default Discussion;
