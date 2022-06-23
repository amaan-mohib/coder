import { Ballpen, Check, LineDashed } from "tabler-icons-react";

export const problemDifficulty = ["Easy", "Medium", "Hard"];

export const statusIcon = {
  todo: <LineDashed color="var(--secondary-text)" />,
  attempted: <Ballpen color="orangered" />,
  solved: <Check color="green" />,
  loading: <LineDashed color="var(--secondary-text)" />,
};
