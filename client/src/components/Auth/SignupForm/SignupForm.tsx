import { useMutation } from "@apollo/client";
import { useAuth } from "@common/common.hooks";
import { IAuthResp, IAuthInput } from "@common/common.models";
import Loader from "@common/Loader";
import { SIGNUP } from "../../../graphql";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CgDanger } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormRow,
  FormCol,
  FormInput,
  FormError,
  FormSubmit,
} from "../AuthCommon";

const SignupForm = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();

  const [signupInput, setSignupInput] = useState<Partial<IAuthInput>>({});
  const [signupResp, setSignupResp] = useState<Partial<IAuthResp>>({});

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    watch,
    getValues,
  } = useForm<IAuthInput>({ mode: "onBlur" });

  const [signup, { loading, error }] = useMutation(SIGNUP);

  const handleFormChange = (event) => {
    setSignupInput({
      ...signupInput,
      [event.target.name]: event.target.value,
    });
  };

  const resetInput = () =>
    setSignupInput({ name: "", email: "", password: "" });
  const verifyAuth = () => {
    const token = signupResp?.token;
    if (token) {
      setAuthToken(token);
      navigate("/users/" + signupResp?.user?.id);
    }
  };

  const onSubmit: SubmitHandler<IAuthInput> = async (input, event) => {
    event?.preventDefault();

    const { name, email, password } = input;

    const resp = (
      await signup({
        variables: { name, email, password },
      })
    ).data?.login as IAuthResp;

    if (resp) {
      setSignupResp(resp);
      resetInput();
      verifyAuth();
    }
  };
  return (
    <div>
      {error && !loading && (
        <div className="mb-4 mx-auto w-fit">
          <FormError>
            <span className="pr-1 pt-1">
              <CgDanger />
            </span>
            Hmm something went wrong. Please try again.
          </FormError>
        </div>
      )}
      {!loading && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <FormCol>
              <FormInput
                {...register("name", {
                  required: true,
                })}
                placeholder="Name"
                onChange={handleFormChange}
              />
              {errors.name && (
                <FormError>
                  <span className="pr-1 pt-1">
                    <CgDanger />
                  </span>
                  This is required.
                </FormError>
              )}
            </FormCol>
            <FormCol>
              <FormInput
                type="email"
                {...register("email", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                placeholder="Email"
                onChange={handleFormChange}
              />
              {errors.email && (
                <FormError>
                  <span className="pr-1 pt-1">
                    <CgDanger />
                  </span>
                  Please provide a valid email address.
                </FormError>
              )}
            </FormCol>
          </FormRow>
          <FormRow>
            <FormCol>
              <FormInput
                type="password"
                {...register("password", { required: true })}
                placeholder="Password"
                onChange={handleFormChange}
              />
              {errors.password?.type === "required" && (
                <FormError>
                  <span className="pr-1 pt-1">
                    <CgDanger />
                  </span>
                  This field is required.
                </FormError>
              )}
              {errors.password?.type === "minLength" && (
                <FormError>
                  <span className="pr-1 pt-1">
                    <CgDanger />
                  </span>
                  Password must be at least 8 characters.
                </FormError>
              )}
            </FormCol>
            <FormCol>
              <FormInput
                type="password"
                {...register("confirmPassword", {
                  required: true,
                })}
                placeholder="Confirm password"
                onChange={handleFormChange}
              />
              {watch("confirmPassword") !== watch("password") &&
              getValues("confirmPassword") ? (
                <FormError>
                  <span className="pr-1 pt-1">
                    <CgDanger />
                  </span>
                  Passwords must match.
                </FormError>
              ) : null}
            </FormCol>
          </FormRow>
          <FormRow buttonRow={true}>
            <FormSubmit
              type="submit"
              disabled={!isDirty || !isEmpty(errors) || loading}
            >
              Submit
            </FormSubmit>
          </FormRow>
        </Form>
      )}
      {loading && (
        <div className="w-fit mx-auto">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default SignupForm;
