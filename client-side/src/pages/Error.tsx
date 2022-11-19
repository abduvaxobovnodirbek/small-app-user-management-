import React from "react";
import { Link } from "react-router-dom";
const Zoom = require("react-reveal/Zoom");

const Error = () => {
  return (
    <Zoom>
      <section className="bg-transparent">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              404
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-slate-900 md:text-4xl">
              Something's missing.
            </p>
            <p className="mb-4 text-lg font-light text-slate-500">
              Sorry, we can't find that page.
            </p>
            <Link
              to={"/"}
              className="inline-flex border border-slate-500 shadow-md hover:bg-slate-500 transition ease-in-out bg-primary-600  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>
    </Zoom>
  );
};

export default Error;
