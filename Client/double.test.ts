import { test } from "node:test";
import assert from "node:assert/strict";
import { LiteSVM } from "litesvm";
import {
	PublicKey,
	Transaction,
	SystemProgram,
	Keypair,
	LAMPORTS_PER_SOL,
	TransactionInstruction,
} from "@solana/web3.js";

test("one transfer", () => {
	const svm = new LiteSVM();
    const CounterContract =  PublicKey.unique();
    svm.addProgramFromFile(CounterContract,"./Doublecontract.so");
	const payer = new Keypair();
	svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL));
	const dataAccount = new Keypair();
	const blockhash = svm.latestBlockhash();
   

	const ixs =
	[
	SystemProgram.createAccount({
		fromPubkey : payer.publicKey,
		newAccountPubkey:dataAccount.publicKey,
		lamports : Number(svm.minimumBalanceForRentExemption(BigInt(4))),
		space : 4 ,
		programId : CounterContract
	}),
]
	const tx = new Transaction();
	tx.recentBlockhash = blockhash;
	
	// tx.sign(payer);
	tx.feePayer = payer.publicKey;
	tx.add(...ixs);
	tx.sign(payer,dataAccount);
	
	svm.sendTransaction(tx);
	const balanceAfter = svm.getBalance(dataAccount.publicKey);
	assert.strictEqual(balanceAfter, svm.minimumBalanceForRentExemption(BigInt(4)));

	const ix2 = new TransactionInstruction({
		keys : [
			{pubkey :dataAccount.publicKey ,isSigner :false , isWritable:true},
			{pubkey :payer.publicKey ,isSigner :true , isWritable:true}
		],
		programId : CounterContract,
		data  :Buffer.from(""),
	})

	const tx2 = new Transaction();
	tx2.recentBlockhash = blockhash;
	tx2.feePayer = payer.publicKey;
	tx2.add(ix2);
	tx2.sign(payer);
	const response = svm.sendTransaction(tx2);
	console.log(response.toString());
	
	svm.expireBlockhash()



	
});