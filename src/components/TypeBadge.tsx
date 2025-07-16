import React from "react";

const TypeBadge: React.FC<{ type: string, show?: boolean, customtext?: string, dot?: boolean }> = ({ type, show = true, customtext, dot }) => {
  return <span className={`type-badge px-${dot ? 1 : 3} py-1 type-${type.toLowerCase()} ${show ? "" : "w-full"}`}>{(show ? customtext || type : "")}</span>;
};

export default TypeBadge;