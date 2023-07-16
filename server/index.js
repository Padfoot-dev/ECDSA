const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const seeds= require("./scripts/keygen").seeds;
const recoverKeyAndVerify = require("./scripts/keygen").recoverKeyAndVerify;

app.use(cors());
app.use(express.json());

const balances = {
  "0x767bbe6c38cf2252ab3f9a5961f3784134ddadc4": 100,
  "0xee7930f22da58e9a30c3c99205ffd38d971106cf": 50,
  "0x48b8b6ee5ed2efd194c5b219b3b74e8b2ccfa649": 75,
};


app.get("/" , (req,res)=> {
  console.log("root hit");
  res.send(Object.keys(balances));
})

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async(req, res) => {
  
  const { sender, amount, recipient,signature,msgHash, recoveryBit } = req.body;


  setInitialBalance(sender);
  setInitialBalance(recipient);
  
  const {walletAddress , isVerified} = await recoverKeyAndVerify(new Uint8Array(msgHash) ,new Uint8Array(signature) ,recoveryBit);


  if( !isVerified || !walletAddress in balances) {
    res.status(400).send({ message: "user not found enter correct address" });
  }
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    console.log(amount,balances[sender],balances[recipient])
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
