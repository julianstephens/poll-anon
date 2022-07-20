import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@components/Home/Home";
import Layout from "@components/Layout";
import Login from "@components/Auth/Auth";
import NotFound from "@components/NotFound";
import Profile from "@components/Profile/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="users/:id" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
