import React from "react";
import { Github, Twitter, Mail, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 text-gray-400 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-15 text-center md:text-left">
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Tradiscope</h3>
          <p className="text-sm text-gray-400">
            AI-powered insights for smarter trading decisions. Real-time data
            analysis to help you stay ahead of the market. Start your journey to
            better returns today.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/plan" className="hover:text-white">
                Trade Plan
              </a>
            </li>
            <li>
              <a href="/news" className="hover:text-white">
                News
              </a>
            </li>
            <li>
              <a href="/calculator" className="hover:text-white">
                Calculator
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Connect</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="hover:text-white">
              <Github />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter />
            </a>
            <a href="mailto:contact@tradiscope.ai" className="hover:text-white">
              <Mail />
            </a>
            <a href="#" className="hover:text-white">
              <Globe />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Tradiscope. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
