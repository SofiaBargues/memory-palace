"use client";
import React, { useState } from "react";
const data = [
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
const Palace = () => {
  const [formValues, setFormValues] = useState<string[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const total = results.filter((x) => x === true).length;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const newArr = [];
    e.preventDefault();
    for (let i = 0; i < data.length; i++) {
      newArr.push(e.target.elements["input_" + i].value);
    }
    setFormValues(newArr);

    const isCorrectArr = [];
    for (let i = 0; i < newArr.length; i++) {
      const palabra = newArr[i];
      if (palabra.toLowerCase() === data[i].toLowerCase()) {
        isCorrectArr.push(true);
      } else {
        isCorrectArr.push(false);
      }
    }
    setResults(isCorrectArr);
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
      <div className="font-bold">Total: {total}</div>
    </>
  );
};

export default Palace;
