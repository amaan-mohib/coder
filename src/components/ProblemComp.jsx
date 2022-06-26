import { useAuth } from "../contexts/AuthContext";
import { problemDifficulty } from "../utils/utils";
import LoadingScreen from "../views/LoadingScreen";
import { decodeBase64 } from "../views/Problem";
import LinkComp from "./Link";

export const Description = ({ problem }) => {
  return (
    <div className="panel">
      <div className="title">
        <h4>{`${problem.number}. ${problem.title}`}</h4>
        <p className={`diff diff-${problem.difficulty}`}>
          {problemDifficulty[problem.difficulty]}
        </p>
      </div>
      <hr />
      <div
        className="custom-html-style"
        dangerouslySetInnerHTML={{ __html: problem.description }}></div>
    </div>
  );
};

export const Submission = ({
  submissionList,
  submitting,
  submissionResult,
  name,
}) => {
  const { user } = useAuth();
  if (!user)
    return (
      <div className="panel description signed-out">
        Sign in to keep track of your submissions
      </div>
    );
  return (
    <div className="panel description">
      {submitting ? (
        <LoadingScreen />
      ) : (
        submissionResult && (
          <div className="submission-result">
            <span style={{ margin: "10px 0" }}>
              <span
                style={{
                  fontWeight: 600,
                  color:
                    submissionResult.status.description === "Accepted"
                      ? "green"
                      : "red",
                }}>
                {submissionResult.status.description}
              </span>
            </span>
            {submissionResult.time && (
              <span className="info">
                {"Took "}
                <span className="big">
                  {submissionResult.time
                    ? `${submissionResult.time} ms`
                    : "N/A"}
                </span>
                {", with "}
                <span className="big">
                  {submissionResult.memory
                    ? `${submissionResult.memory} KB`
                    : "N/A"}
                </span>
                {" in "}
                <span>{`${submissionResult.language.name}`}</span>
                {` for ${name}`}
              </span>
            )}
            <pre>
              {submissionResult.compile_output && (
                <code>{decodeBase64(submissionResult.compile_output)}</code>
              )}
              {submissionResult.message && (
                <p>{decodeBase64(submissionResult.message)}</p>
              )}
              {submissionResult.stderr && (
                <code>{decodeBase64(submissionResult.stderr)}</code>
              )}
            </pre>
            <hr />
          </div>
        )
      )}
      <div>
        {submissionList.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Submitted At</th>
                <th>Status</th>
                <th>Runtime</th>
                <th>Memory</th>
                <th>Language</th>
              </tr>
            </thead>
            <tbody>
              {submissionList.map((sub) => (
                <tr key={sub._id}>
                  <td>{`${new Date(sub.timestamp).toLocaleString()}`}</td>
                  <td>
                    <LinkComp
                      href={`/submissions/${sub.sub_id}`}
                      style={{
                        color:
                          sub.status.description === "Accepted"
                            ? "green"
                            : "red",
                      }}>
                      {sub.status.description}
                    </LinkComp>
                  </td>
                  <td>{sub.time ? `${sub.time} ms` : "N/A"}</td>
                  <td>{sub.memory ? `${sub.memory} KB` : "N/A"}</td>
                  <td>{sub.language.name.replace(/\([^()]*\)/g, "").trim()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No submissions till now</p>
        )}
      </div>
    </div>
  );
};
