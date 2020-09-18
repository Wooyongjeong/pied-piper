import React from 'react'
import './Menu.css'

function Menu({imgUrl, name, price, text}) {
    return(
        <div className="menu">
            {/* menu image */}
            <img className="menu__image" src={imgUrl}/>
            {/* menu detail */}
            <div className="menu__detail">
                <div className="menu__info">
                    <h3 className="menu__name"><strong>{name}</strong></h3>
                    <h3 className="menu__price"><strong>{price}원</strong></h3>
                </div>
                <h3 className="menu__text">{text}</h3>
            </div>            
        </div>
    )
}

export default Menu