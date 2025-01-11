import React from 'react'
import './Header.css'
import sandImage from '/sand.png'
const Header = () => {
  const headerStyle = {
    height: '30vw',//ver
    margin: '35px auto',
    backgroundImage: `url(${sandImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center', //ver
    backgroundRepeat: 'no-repeat',
    position: 'relative'
  };
  return (
    <div classname='header' style={headerStyle}>
        <div className="header-info">
            <h2>¡Ven y disfruta!</h2>
            <p>La mejor experiencia esta en el El Nono</p>
        </div>
      
    </div>
  )
}

export default Header
