import React, { useState } from 'react';
import About from './components/About';
import Auth from './components/Auth';
import Find from './components/Find';
import Cookies from "universal-cookie";
import "./styles/Home.css"
const cookies = new Cookies();
const App = () => {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [Email, setEmail] = useState("")
  const [Room, setRoom] = useState(0)
  const [Icon, setIcon] = useState("")
  if(!isAuth)
  {
    return(
      <Auth setIsAuth={setIsAuth} setEmail={setEmail} setIcon={setIcon}/>
    )
  }
  else{
    if (Room==0)
    {
      // alert(Icon)
      return(
        <Find setIsAuth={setIsAuth} setEmail={setEmail} setRoom={setRoom} Icon={Icon} setIcon={setIcon}/>
      )
    }
    else
    {
    return(
      <About setIsAuth={setIsAuth} setEmail={setEmail} Room={Room} setRoom={setRoom} Icon={Icon} setIcon={setIcon}/>
    )
    }
  }
};

export default App;
