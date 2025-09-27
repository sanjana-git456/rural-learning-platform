// footer.js
import React from "react";

const Footer = ({ contactInfo, socialLinks }) => {
  return (
    <footer className="bg-blue-600 text-white py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Contact Info */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h4 className="font-semibold text-lg mb-2">Contact Us</h4>
          <p>Email: {contactInfo.email}</p>
          <p>Phone: {contactInfo.phone}</p>
        </div>

        {/* Social Links */}
        <div className="flex gap-6 text-2xl">
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
              📘
            </a>
          )}
          {socialLinks.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
              🐦
            </a>
          )}
        </div>
      </div>

      <div className="text-center mt-6 text-gray-200">
        &copy; {new Date().getFullYear()} RuralEdu. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
