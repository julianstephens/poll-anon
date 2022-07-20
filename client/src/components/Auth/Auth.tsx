import React, { useState } from "react";
import tw, { styled } from "twin.macro";
import LoginForm from "./LoginForm/LoginForm";
import SignupForm from "./SignupForm/SignupForm";

const TabGroup = tw.ul`flex justify-between text-center mb-12`;
const TabButton = styled.li(({ isActive }) => [
  tw`w-3/6 p-5 text-xl cursor-pointer ease-in duration-200 bg-[#6B6E94] hover:bg-[#6355bc]`,
  isActive && tw`bg-[#5B4CB9]`,
]);

const Auth = () => {
  const [isLoginTab, setTab] = useState(true);

  const toggle = (prev) => !prev;

  return (
    <>
      {/* Form Tabs */}
      <TabGroup>
        <TabButton isActive={!isLoginTab} onClick={() => setTab(toggle)}>
          Sign Up
        </TabButton>
        <TabButton isActive={isLoginTab} onClick={() => setTab(toggle)}>
          Login
        </TabButton>
      </TabGroup>

      {/* Form */}
      {isLoginTab ? <LoginForm /> : <SignupForm />}
    </>
  );
};

export default Auth;
