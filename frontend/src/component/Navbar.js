import React from "react";

const button_style = {
    width:  '30px',
    height: '30px',
}


const NavBar = () => {
    return (  
        <div className="ui stackable menu">
            <div className="item">
                <input type="image" src={require("./img/Logo.png")} style={button_style} onClick={() => window.location = '/'}/>
            </div>
        </div>
    )
};
  
export default NavBar;
