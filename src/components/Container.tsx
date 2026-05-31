import React from "react";

export  function Container({children}: {children: React.ReactNode}) {
  return <div className="md:max-w-3xl md:mx-auto md:p-4">{children}</div>;
}
