import React from 'react'
import './Menu.css'
import { menu_list} from '../../assets/assets'
const Menu = ({category,setCategory}) => {
  return (
    <div className='initial-menu' id = 'initial-menu'>
      <h1>Disfruta de nuestro menu</h1>
      <p className='initial-menu-text'>Elige tu plato favorito</p>
      <div className='initial-menu-list'>

        {menu_list.map((item, index) => {
          return (
            <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)}key={index} className='initial-menu-list-item'>
              <img className={category===item.menu_name?"active":""}src={item.menu_image} alt="" />
              <p>{item.menu_name}</p>
            </div>
          )
        })}
      </div>
      <hr />
    </div>
  )
}

export default Menu
