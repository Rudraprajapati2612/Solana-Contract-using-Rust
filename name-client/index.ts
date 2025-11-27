import { Keypair,Connection,SystemProgram,Transaction } from "@solana/web3.js"

const connection = new Connection("http://127.0.0.1:8899");
async function main (){
    const kp = new Keypair();
    const dataAccount = new Keypair();
     const signature = await connection.requestAirdrop(kp.publicKey,3000_000_000);
    await connection.confirmTransaction(signature);
     //  await new Promise(r=>setTimeout(r,5000));
     const balance = await connection.getBalance(kp.publicKey);

     console.log(balance);



     const ix = SystemProgram.createAccount({
        fromPubkey : kp.publicKey,
        newAccountPubkey:dataAccount.publicKey,
        lamports:1000_000_000,
        space : 8,
        programId : SystemProgram.programId
     });
     

     const tx = new Transaction().add(ix);

     tx.feePayer = kp.publicKey;

     tx.recentBlockhash =  (await connection.getLatestBlockhash()).blockhash;

     tx.sign(kp);

     await connection.sendTransaction(tx , [kp,dataAccount]);
     console.log(dataAccount.publicKey.toBase58());
     
}

main()