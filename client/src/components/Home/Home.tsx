import Auth from "@components/Auth/Auth";
import Modal from "@components/Modal/Modal";
import { useState } from "react";
import tw, { styled } from "twin.macro";

const FlexCol = tw.div`flex flex-col items-start`;
const FlexRow = styled.div(({ justify, align }) => [
  tw`flex`,
  `align-items: ${align};`,
  `justify-content: ${justify};`,
]);
const Header = tw.h1`text-5xl`;
const Description = tw.h3`text-3xl italic`;
const SignInLink = tw.h4`font-bold text-2xl ease-in duration-200 hover:text-yellow-300 hover:drop-shadow-md`;
const NumberCirlce = tw.div`flex justify-center items-center w-14 h-14 text-3xl mr-3 rounded-full border-4 border-yellow-300`;
const InfoText = tw.p`text-2xl flex-wrap`;

const Home = () => {
  const [show, setShow] = useState(false);

  const showModal = () => setShow(true);
  const hideModal = () => setShow(false);

  return (
    <>
      <FlexRow justify="space-between" align="start">
        <FlexCol>
          <Header>Poll Anon</Header>
          <Description>Truly anonymous polling.</Description>
        </FlexCol>
        <SignInLink className="btn" onClick={showModal}>
          Sign In
        </SignInLink>
      </FlexRow>
      <FlexRow justify="space-around" align="center" className="mt-16">
        <FlexRow justify="center" align="center">
          <NumberCirlce>1</NumberCirlce>
          <InfoText>Create a poll about anything you want!</InfoText>
        </FlexRow>
        <FlexRow justify="center" align="center">
          <NumberCirlce>2</NumberCirlce>
          <InfoText>
            Share the link with your friends and get to voting 😎
          </InfoText>
        </FlexRow>
      </FlexRow>
      <Modal show={show} title="Welcome to Poll Anon!" handleClose={hideModal}>
        <Auth />
      </Modal>
    </>
  );
};

export default Home;
