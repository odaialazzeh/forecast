import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-white">
      <h1 className="text-9xl font-extrabold text-secondary tracking-widest">
        404
      </h1>
      <div className="bg-primary text-white px-2 mb-10 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <p className="text-2xl mt-6 mb-8 md:text-2xl dark:text-gray-300">
        Sorry, the page you are looking for doesn't exist.{" "}
      </p>

      <button className="mt-5">
        <Link
          to="/"
          className="px-8 py-4 text-xl font-semibold rounded bg-primary text-white hover:text-gray-200"
        >
          Back To Home
        </Link>
      </button>
    </main>
  );
};

export default NotFoundPage;
