import React from "react";
import { CgClose } from "react-icons/cg";
import "@assets/css/modal.css";
import tw, { styled } from "twin.macro";
import { IconContext } from "react-icons/lib";

const FlexRow = styled.div(({ hasTitle }) => [
  tw`flex justify-between items-center mb-16`,
  hasTitle && tw`mb-8`,
]);
const Title = tw.h1`text-3xl`;

const Modal = ({ handleClose, show, title, children }) => {
  const showModalClass = show ? "modal block" : "modal hidden";
  return (
    <div className={showModalClass}>
      <section className="modal-main p-7">
        <FlexRow hasTitle={title ? true : false}>
          <Title>{title}</Title>
          <button onClick={handleClose}>
            <IconContext.Provider
              value={{
                size: "1.5rem",
                className: "hover:text-red-400 hover:drop-shadow-md",
              }}
            >
              <CgClose />
            </IconContext.Provider>
          </button>
        </FlexRow>
        {children}
      </section>
    </div>
  );
};

export default Modal;
