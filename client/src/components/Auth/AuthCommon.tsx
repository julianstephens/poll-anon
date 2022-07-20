import tw, { styled } from "twin.macro";

export const Form = tw.form`flex flex-col`;
export const FormCol = tw.div`flex flex-col w-full mr-2 last-of-type:mr-0`;
export const FormRow = styled.div(({ buttonRow }) => [
  tw`flex justify-between mb-12`,
  buttonRow && tw`justify-center mb-6`,
]);
export const FormInput = tw.input`p-2.5 border-b-4 bg-transparent w-full text-lg`;
export const FormSubmit = tw.button`p-4 w-1/3 text-xl justify-self-center rounded-lg bg-[#5B4CB9] drop-shadow duration-200 hover:bg-[#43378d] hover:drop-shadow-2xl disabled:bg-[#535673] `;
export const FormError = tw.p`flex items-center pt-2 text-red-400`;
