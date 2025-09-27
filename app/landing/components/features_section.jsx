// features.js
import React from "react";

const Features = ({ features }) => {
  return (
    <section className="py-16 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="text-center p-6 border rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
