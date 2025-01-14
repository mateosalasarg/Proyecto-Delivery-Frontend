import React,{ useContext } from 'react'
import './Food.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const Food = ({category}) => {
    const {food_list} = useContext(StoreContext)
  return (
    <div className='food' id='food'>
      <div className="food-list">
        {food_list.map((item,index)=>{
            return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
        })}
      </div>
    </div>
  )
}

export default Food
