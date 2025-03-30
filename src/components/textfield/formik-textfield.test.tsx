import { Form, Formik } from "formik";
import FormikTextfield from "./formik-textfield";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { object } from "yup";

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
  test("test submission click", async () => {
    const handleSubmit = jest.fn();
    render(
      <Formik initialValues={{ test: "" }} onSubmit={handleSubmit}>
        <Form>
          <FormikTextfield name="test" label="test" />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    );
    const inputElement = screen.getByLabelText(/test/i);
    expect(inputElement).toBeInTheDocument();
    fireEvent.change(inputElement, { target: { value: "test" } });
    expect(inputElement).toHaveValue("test");
    fireEvent.click(screen.getByText(/submit/i));
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ test: "test" }, expect.anything());
    });
  });
  test("using schema and show error", async () => {
    const handleSubmit = jest.fn();
    const testSchema = object({
      test: object().required("Required"),
    });
    render(
      <Formik
        initialValues={{ test: "" }}
        validationSchema={testSchema}
        isInitialValid={false}
        onSubmit={handleSubmit}
      >
        <Form>
          <FormikTextfield name="test" label="test" />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    );
    const inputElement = screen.getByLabelText(/test/i);
    expect(inputElement).toBeInTheDocument();
    fireEvent.change(inputElement, { target: { value: "" } });
    fireEvent.click(screen.getByText(/submit/i));
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });
});
