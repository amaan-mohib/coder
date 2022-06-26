import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  height: calc(100vh - var(--nav-height));
  overflow: hidden;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .diff {
    font-size: small;
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
  .panel {
    padding: 10px 15px;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-left: 1px solid var(--shadow);
  }
  .left,
  .right {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  .editor * {
    font-family: monospace !important;
  }
  .editor {
    textarea:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  }
  .tabs {
    font-size: 12px;
    border-bottom: 1px solid #aaa;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    /* border-bottom: 1px solid var(--shadow); */
    select {
      width: min-content;
      font-size: 12px;
      padding: 5px 8px;
    }
  }
  .footer {
    border-bottom: 0;
    border-top: 1px solid var(--shadow);
    justify-content: space-between;
    & > div {
      display: flex;
    }
    & > div > * {
      margin-left: 10px;
    }
    position: relative;
    font-size: small;
  }
  .test-window {
    position: absolute;
    overflow: auto;
    top: 0;
    width: 100%;
    right: 0;
    transform: translateY(-101%);
    z-index: 100;
    background-color: var(--background);
    min-height: 150px;
    max-height: 200px;
    border-top: 1px solid var(--shadow);
    padding: 10px;
    .test-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      .but {
        cursor: pointer;
      }
    }
    pre {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      p {
        font-size: 14px;
      }
    }
  }
  .time {
    color: var(--secondary-text);
  }
  .custom-html-style {
    pre {
      padding: 10px;
    }
  }
  .description {
    display: flex;
    flex-direction: column;
    table {
      width: 100%;
      text-align: left;
      margin-top: 10px;
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
  }
  .submission-result {
    display: flex;
    flex-direction: column;
    .info {
      font-size: small;
      margin: 10px 0;
    }
    .big {
      font-size: medium;
      font-weight: 500;
    }
    pre {
      p {
        font-size: small;
      }
      display: flex;
      flex-direction: column;
    }
    pre,
    code {
      width: 100%;
    }
  }
  .signed-out {
    text-align: center;
    color: var(--secondary-text);
    padding: 30px;
  }
`;

export default StyledDiv;
