import { useEffect } from "react";
import server from "./server";
import generateAddress from "../utils/utils";

function Wallet({ address, setAddress, balance, setBalance,privateKey ,setPrivateKey }) {


   

  useEffect(()=> {
    async function onChange() {
      if(privateKey){
        const add = generateAddress(privateKey);
        setAddress(add);
      }
      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    } 

    onChange();

  },[privateKey,address])



  const handleChange = (event)=> {
      const { value } = event.target;
      setPrivateKey(value);


  }


  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Your Account
        <input placeholder="Enter your private key, for example: 0x1" value={privateKey} onChange={handleChange}></input>
      </label>

      <div>Wallet Address: {address}</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
