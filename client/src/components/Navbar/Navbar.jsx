import React, { useState } from "react";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div>
      <div className="logo_img">
        <img src={assets.logo} alt="logo" class="w-35" />
      </div>

      {/* nav-items */}
      <div>
        <ul>
          <li>Calculator</li>
          <li>Bias</li>
          <li>News</li>
          <li>Plan</li>
        </ul>
      </div>

      {/* Auth */}
      <div>
        <div>
          {isLogin ? "Hello Trader👋" : <button>Get Started</button>}
          <button>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
