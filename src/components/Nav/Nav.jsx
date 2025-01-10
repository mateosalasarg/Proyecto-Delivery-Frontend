import React from 'react'
import './Nav.css'
import { assets } from '../../assets/assets'

const Nav = () => {
  return (
    <div className='nav'>
        <img src={assets.logo} alt="" className="logo" />
        <ul className="nav-links">
            <li>inicio</li>
            <li>menu</li>
            <li>contactanos</li>
        </ul>
        <div className="nav-right">
            <img src={assets.search_icon} alt="" />
            <div className="nav-search-icon">
                <img src={assets.bowl_icon} alt="" />
                <div className="dot"></div>
            </div>
            <button>iniciar sesion</button>
        </div>
    </div>
  )
}

export default Nav
