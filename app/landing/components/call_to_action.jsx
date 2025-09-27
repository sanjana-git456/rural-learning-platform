// call_to_action.js
import React from "react";

const CallToAction = ({ title, subtitle, buttonText, buttonLink }) => {
  return (
    <section className="bg-blue-600 text-white py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg mb-8">{subtitle}</p>
      <a
        href={buttonLink}
        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        {buttonText}
      </a>
    </section>
  );
};

export default CallToAction;
