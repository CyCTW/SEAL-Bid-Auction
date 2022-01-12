import React from "react";
import {web3} from "../utils";

const button_style = {
    width:  '30px',
    height: '30px',
}


const NavBar = ({account, setAccount}) => {
    const updateAccount = async (uid) => {
        let accounts = await web3.eth.getAccounts();
        web3.eth.defaultAccount = accounts[uid];
        setAccount(accounts[uid])
    }

    return (
        <div className="ui stackable menu">
            <div className="item">
                <input type="image" src={require("./img/Logo.png")} style={button_style} onClick={() => window.location = '/'}/>
            </div>
            <div className="item">
                <select onChange={e => updateAccount(e.target.value)}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                </select>
            </div>
            <div className="item">
                {account}
            </div>
        </div>
    )
};
  
export default NavBar;
