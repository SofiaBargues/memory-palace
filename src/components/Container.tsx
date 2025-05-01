import React from "react";

export  function Container({children}: {children: React.ReactNode}) {
  return <div className="max-w-3xl mx-auto p-4">{children}</div>;
}
