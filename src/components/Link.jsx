import Link from "next/link";

const LinkComp = ({ href, className, style, children }) => {
  return (
    <Link href={href}>
      <a className={className || ""} style={style || {}}>
        {children}
      </a>
    </Link>
  );
};

export default LinkComp;
