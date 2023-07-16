import { useState } from "react";
import server from "./server";
import { signTransaction } from "../utils/utils";

function Transfer({ address, setBalance , privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (event) => {
    const {name , value} = event.target;
    if(name === "Recipient") {
      setRecipient(`0x${value}`)
    } 
    if(name === "Send Amount") {
      setSendAmount(value);
    }
    
  }

{/*
  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

*/}

async function transfer(evt) {
  evt.preventDefault();
  if(!sendAmount || !recipient) {
    alert("Amount or recipient not specified")
  }
  const {signature,msgHash} = await signTransaction(sendAmount , recipient , address , privateKey);
  const payload = {
    sender: address,
    amount: parseInt(sendAmount),
    recipient,
    signature : Array.from(signature[0]),
    recoveryBit : signature[1],
    msgHash : Array.from(msgHash)
  };

  try {
    const {
      data: { balance },
    } = await server.post(`send`,payload );
    setBalance(balance);
  } catch (ex) {
    alert(ex.response.data.message);
  }
 
}


  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
        name="Send Amount"
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue}
        ></input>
      </label>

      <label>
        Recipient
        <input
        name="Recipient"
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
