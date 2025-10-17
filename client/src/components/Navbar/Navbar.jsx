import React from 'react'
import { assets } from '../../assets/assets'


const Navbar = () => {
  return (
    <div>
      <div className="logo_img">
        <img src={assets.logo} alt="logo" class='w-35'/>
      </div>
    </div>
  )
}

export default Navbar
