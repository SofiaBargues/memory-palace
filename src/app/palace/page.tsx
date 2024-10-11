"use client";
import React, { useState } from "react";

const Palace = () => {
  let data = [
    "Casa",
    "Bufanda",
    "Árbol",
    "Teléfono",
    "Libro",
    "Silla",
    "Computadora",
    "Reloj",
    "Bolso",
  ];

  const [formValues, setFormValues] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.target.elements["input_0"].value);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {data.map((x, index) => (
          <input
            key={index}
            type="text"
            id="myInput"
            className="border"
            placeholder={"Word " + (index + 1)}
            name={"input_" + index.toString()}
            value={formValues[index]}
          />
        ))}
        <button type="submit">Submit</button>
      </form>
      <div>Remember</div>
      <ul>
        {data.map((x, index) => (
          <li key={index}>{x}</li>
        ))}
      </ul>
    </>
  );
};

export default Palace;
