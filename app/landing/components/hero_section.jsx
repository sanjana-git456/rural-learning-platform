// hero_section.js
import React from "react";

const HeroSection = ({ title, subtitle, buttonText, buttonLink, image }) => {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
        {/* Text content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg mb-6">{subtitle}</p>
          <a
            href={buttonLink} // Link to the login/register page
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {buttonText}
          </a>
        </div>

        {/* Image */}
        {image && (
          <div className="md:w-1/2">
            <img src={image} alt="Hero Illustration" className="rounded-lg shadow-lg" />
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
