import React from "react";
import { Form, Formik } from "formik";
import FormikTextfield from "./formik-textfield";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("FormikTextfield component test", () => {
  test("render currectly and changing value", () => {
    render(
      <Formik initialValues={{ email: "" }} onSubmit={() => {}}>
        <Form>
          <FormikTextfield name="email" label="Email" />
        </Form>
      </Formik>
    );
    const inputElement = screen.getByLabelText(/email/i);
    expect(inputElement).toBeInTheDocument();
    fireEvent.change(inputElement, {
      target: { value: "test-email@gmail.com" },
    });
    expect(inputElement).toHaveValue("test-email@gmail.com");
  });

  test("show error text while having error massage", async () => {
    render(
      <Formik
        initialValues={{ email: "" }}
        onSubmit={() => {}}
        validate={(values) => {
          const errors: { email?: string } = {};
          if (!values.email) {
            errors.email = "Required";
          }
          return errors;
        }}
      >
        <Form>
          <FormikTextfield name="email" label="Email" />
        </Form>
      </Formik>
    );
    const inputElement = screen.getByLabelText(/email/i);
    expect(inputElement).toBeInTheDocument();
    fireEvent.change(inputElement, {
      target: { value: "" },
    });
    expect(inputElement).toHaveValue("");

    fireEvent.blur(inputElement);
    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });
});
