import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import { logo } from "./assets/index";
import { Home, CreatePost } from "./pages";
const App = () => {
  return (
    <BrowserRouter>
      <header className="w-full flex justify-between items-center bg-withe sm:px-89 px-4 py-4 border-b border-b-[#e6ebf4] ">
        <Link to="/">
          <img src={logo} alt="logo" className="w-28 object-contain " />
        </Link>
        <Link
          to="/create-post"
          className="font-inter font-medium bg-[#6469ff] text-wite px-4 py-2 text-white rounded-md"
        >
          Create
        </Link>
      </header>
      <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
