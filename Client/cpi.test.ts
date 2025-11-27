import { test } from "node:test";
import assert from "node:assert/strict";
import { LiteSVM } from "litesvm";
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { buffer } from "stream/consumers";

   
test("CPI wokrs as expected",()=>{
    let svm = new LiteSVM();
    let DoubleContract = PublicKey.unique();
    let CpiContract = PublicKey.unique();
    svm.addProgramFromFile(DoubleContract,"./Doublecontract.so");
    svm.addProgramFromFile(CpiContract,"./CPI.so");

    let userAccount = new Keypair();

    svm.airdrop(userAccount.publicKey,BigInt(1000_000_000));
    
    let dataAccount = new Keypair();
    createDataAccOnchain(svm,dataAccount,userAccount,DoubleContract);

    let ixn = new TransactionInstruction({
        keys : [
            {pubkey: dataAccount.publicKey,isSigner:true,isWritable:true},
            {pubkey:DoubleContract,isSigner:false,isWritable:false}
        ],
        programId: CpiContract,
        data : Buffer.from(""),

    });

    let transaction = new Transaction().add(ixn);

    transaction.recentBlockhash = svm.latestBlockhash();
    transaction.feePayer = userAccount.publicKey,
    transaction.sign(userAccount);
})


function createDataAccOnchain(svm :LiteSVM,dataAccount:Keypair,userAccount:Keypair,DoubleContract:PublicKey){
    const blockhash = svm.latestBlockhash();
   

	const ixs =
	[
	SystemProgram.createAccount({
		fromPubkey : userAccount.publicKey,
		newAccountPubkey:dataAccount.publicKey,
		lamports : Number(svm.minimumBalanceForRentExemption(BigInt(4))),
		space : 4 ,
		programId : DoubleContract
	}),
]
	const tx = new Transaction();
	tx.recentBlockhash = blockhash;
	
	// tx.sign(payer);
	tx.feePayer = userAccount.publicKey;
	tx.add(...ixs);
	tx.sign(userAccount,dataAccount);
	
	svm.sendTransaction(tx);
}     