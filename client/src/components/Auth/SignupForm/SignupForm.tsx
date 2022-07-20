import { IFormInput } from "@common/common.models";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CgDanger } from "react-icons/cg";
import {
  Form,
  FormRow,
  FormCol,
  FormInput,
  FormError,
  FormSubmit,
} from "../AuthCommon";

const SignupForm = () => {
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<IFormInput>({ mode: "onBlur" });

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow>
        <FormCol>
          <FormInput
            {...register("name", { required: true })}
            placeholder="Name"
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
      </FormRow>
      <FormRow>
        <FormCol>
          <FormInput
            type="email"
            {...register("email", { required: true })}
            placeholder="Email"
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
        <FormCol>
          <FormInput
            type="password"
            {...register("password", { required: true })}
            placeholder="Password"
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
        <FormSubmit type="submit" disabled={!isDirty || !errors}>
          Submit
        </FormSubmit>
      </FormRow>
    </Form>
  );
};

export default SignupForm;
