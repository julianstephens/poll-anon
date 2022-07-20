import React from "react";
import tw from "twin.macro";

const Container = tw.div`flex justify-between items-center w-full`;
const Brand = tw.h1`text-4xl`;
const AuthButton = tw.button`py-2 px-4 rounded-lg font-bold bg-[#FA71D1] drop-shadow-md ease-in duration-200 hover:bg-[#f83cc0] hover:drop-shadow-xl`;

const Header = () => {
  const isLoggedIn = localStorage.getItem("JWT_TOKEN");

  const handleAuth = () => {};

  return (
    <Container>
      <Brand>Poll Anon</Brand>
      <AuthButton onClick={handleAuth}>
        {isLoggedIn ? "Logout" : "Login/Signup"}
      </AuthButton>
    </Container>
  );
};

export default Header;
