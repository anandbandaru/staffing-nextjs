import React, { useContext, useState } from "react";
import './sidebar.css';
import {assets} from '../../assets/assets'
import { Context } from "../../context/context";

const Sidebar = () => {

    const [menuExtended, setMenuExtended] = useState(false);
    const {onselectionchange, previousPrompts, setRecentPrompt, onSent} = useContext(Context);

    //for making recent click work
    const loadPrompt = async(prompt) => {
        setRecentPrompt(prompt);
        await onSent(prompt);
    }

  return(
    <div className="sidebar">
        <div className="top">
            <div className="toggleMenu">
                <img onClick={()=> setMenuExtended(prev=>!prev)} className="menu" src={assets.menu_squares_icon} alt="" />
            </div>
            {/* <div className="new-chat">
                <img src={assets.plus_icon} alt="" />
                {menuExtended?<p>New chat</p>:null}
            </div> */}

            {menuExtended?
                <div className="recent">
                    <p className="recent-title"> 
                        Recent 
                    </p>
                    {previousPrompts.map((item, index) => {
                        return(
                            <div className="recent-entry" onClick={()=> loadPrompt(item)}>
                                <img src={assets.message_dots_icon} alt="" />
                                <p title={item}>{item.slice(0,18)}..</p>
                            </div>
                        )
                    })}
                </div>
            :null}
            
        </div>

        <div className="bottom">
            <div className="bottom-item recent-entry">
                <img src={assets.help_icon} alt="" />
                {menuExtended?<p>Help</p>:null}
            </div>
            <div className="bottom-item recent-entry">
                <img src={assets.info_icon} alt="" />
                {menuExtended?<p>Info</p>:null}
            </div>
        </div>
    </div>
  )
}

export default Sidebar;