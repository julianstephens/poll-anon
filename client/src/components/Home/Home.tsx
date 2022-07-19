import { Sign } from "crypto";
import tw from "twin.macro";

const FlexCol = tw.div`flex flex-col items-start`;
const FlexRow = tw.div`flex justify-between items-start`;
const Header = tw.h1`text-5xl`;
const Description = tw.h3`text-3xl italic`;
const SignInLink = tw.h3`font-bold text-3xl`;

function Home() {
  return (
    <>
      <FlexRow>
        <FlexCol>
          <Header>Poll Anon</Header>
          <Description>Truly anonymous polling.</Description>
        </FlexCol>
        <SignInLink>Sign In</SignInLink>
      </FlexRow>
    </>
  );
}

export default Home;
