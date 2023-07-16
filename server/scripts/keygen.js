const {toHex} = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const {keccak256} = require("ethereum-cryptography/keccak");

const seeds = (n) => {
    const keyPairs = [];

    for(let i =0;i < n;i++) {
        const privateKey = toHex(secp.utils.randomPrivateKey());
        const publicK = secp.getPublicKey(privateKey,false).slice(1);
        const walletAddress = toHex(keccak256(publicK).slice(-20));
        const publicKey  = toHex(secp.getPublicKey(privateKey,false));
        keyPairs.push({privateKey,publicKey,walletAddress});

    }

    return keyPairs;
}

const recoverKeyAndVerify = async (msgHash,signature,recoveryBit) => {

    const publicKey =  await secp.recoverPublicKey(msgHash, signature, recoveryBit);

    const isVerified = await secp.verify(signature,msgHash,publicKey);

    const sliceKey = publicKey.slice(1);
    const hashKey = keccak256(sliceKey);
    const wallet =  hashKey.slice(-20);
    return {walletAddress : `0x${toHex(wallet)}` , isVerified };


}

seeds(3)

module.exports = {seeds,recoverKeyAndVerify}