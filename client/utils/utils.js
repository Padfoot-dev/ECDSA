import {getPublicKey,sign} from "ethereum-cryptography/secp256k1";
import {keccak256} from "ethereum-cryptography/keccak"
import {toHex , utf8ToBytes} from "ethereum-cryptography/utils"


const generateAddress = (privateKey) => {
    const publicK = getPublicKey(privateKey,false).slice(1);
    const walletAddress = toHex(keccak256(publicK).slice(-20));
    return `0x${walletAddress}`;
 }

export const signTransaction = async (sendAmount,recipient,address,privateKey) => {
    const msgHash = await keccak256(utf8ToBytes(`${sendAmount}${recipient}${address}${Date.now()}`));
    const signature = await sign(msgHash,privateKey,{recovered :true});
    return {signature,msgHash};

} 

 export default generateAddress;