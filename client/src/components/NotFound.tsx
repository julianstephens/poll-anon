import React from "react";
import tw from "twin.macro";

const Container = tw.div`flex flex-col justify-start items-center w-screen h-screen mt-16`;

const NotFound = () => {
  return (
    <Container>
      <h1 className="text-4xl">Oops!</h1>
      <p className="text-2xl">
        We couldn't find the page you were looking for 😢
      </p>
    </Container>
  );
};

export default NotFound;
