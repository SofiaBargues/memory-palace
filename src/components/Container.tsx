import React from "react";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full md:mx-auto md:max-w-3xl md:p-4">{children}</div>
  );
}
