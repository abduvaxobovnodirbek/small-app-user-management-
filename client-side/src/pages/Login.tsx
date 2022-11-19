import { Link } from "react-router-dom";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";

let validationSchema = Yup.object({
  email: Yup.string().required("*email field is required"),
  password: Yup.string().required("*password field is required"),
});

type FormValues = Yup.InferType<typeof validationSchema>;

const Login: React.FC = () => {
  const initialValues: FormValues = { email: "", password: "" };

  const handleSubmit = (data: FormValues, { resetForm }: any) => {
    console.log(data);
    resetForm({});
  };

  return (
    <>
      <div className="flex items-center align-middle h-5/6">
        <div className="container max-w-screen-sm center mx-auto">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched }: any) => (
              <Form className="bg-gray-600 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl mb-4 text-center">
                  Sign In to your account
                </h1>

                <div className="mb-4">
                  <label
                    className="block text-white text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Field
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      touched.email && errors.email && "border-red-700"
                    }`}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-500 mt-2 text-xs italic">
                      {errors.email}.
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label
                    className="block text-white text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Field
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      touched.password && errors.password && "border-red-700"
                    }`}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="******************"
                  />
                  {touched.password && errors.password && (
                    <p className="text-red-500 mt-2 text-xs italic">
                      {errors.password}.
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Sign In
                  </button>
                  <Link
                    className="inline-block align-baseline font-bold text-sm text-gray-300 hover:text-white"
                    to="/register"
                  >
                    Create an Account?
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
          <p className="text-center text-gray-500 text-xs">
            &copy;2022 Nodirbek Intern. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
