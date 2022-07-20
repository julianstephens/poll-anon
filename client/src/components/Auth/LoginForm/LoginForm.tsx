import { useMutation } from "@apollo/client";
import { useAuth } from "@common/common.hooks";
import { IAuthResp, IFormInput } from "@common/common.models";
import Loader from "@components/Loader";
import isEmpty from "lodash/isEmpty";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CgDanger } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../../../graphql";
import {
  Form,
  FormCol,
  FormError,
  FormInput,
  FormRow,
  FormSubmit,
} from "../AuthCommon";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [loginResp, setLoginResp] = useState<IAuthResp>();

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<IFormInput>({ mode: "onBlur" });

  const [login, { loading, error }] = useMutation(LOGIN);

  const handleFormChange = (event) => {
    setLoginInput({
      ...loginInput,
      [event.target.name]: event.target.value,
    });
  };

  const resetInput = () => setLoginInput({ email: "", password: "" });
  const verifyAuth = () => {
    const token = loginResp?.token;
    if (token) {
      setAuthToken(token);
      navigate("/users/" + loginResp?.user.id);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (input, event) => {
    event?.preventDefault();

    const { email, password } = input;

    const resp = (
      await login({
        variables: { email: email, password: password },
      })
    ).data?.login as IAuthResp;

    if (resp) {
      setLoginResp(resp);
      resetInput();
      verifyAuth();
    }
  };

  return (
    <div>
      {error && !loading && (
        <FormError>
          <span className="pr-1 pt-1">
            <CgDanger />
          </span>
          Hmmm something went wrong. Please try again.
        </FormError>
      )}
      {!loading && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
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
              {errors.password && (
                <FormError>
                  <span className="pr-1 pt-1">
                    <CgDanger />
                  </span>
                  This is required.
                </FormError>
              )}
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

export default LoginForm;
