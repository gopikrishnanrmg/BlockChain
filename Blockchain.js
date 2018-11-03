const SHA256 = require('crypto-js/sha256')

class Block{
	
	constructor(timestamp,transaction,previousHash='')
	{
		this.timestamp=timestamp;
		this.transaction=transaction;
		this.previousHash=previousHash;
		this.hash=this.calculateHash(); 
		this.nonce=0;
	}

	calculateHash()
	{
		return SHA256(this.transaction+this.previousHash+this.timestamp+this.nonce+JSON.stringify(this.data)).toString();
	}

	mineBlock(difficulty){
		while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0")){
			this.nonce++;
			this.hash=this.calculateHash();
		}
		console.log("Block mined "+this.hash);
	}

}

class Transaction{

	constructor(fromAddress,toAddress,amount){
		this.fromAddress=fromAddress;
		this.toAddress=toAddress;
		this.amount=amount;
	}
}

class Blockchain{
	
	constructor(){
		this.chain=[this.creategenesisblock()];
		this.difficulty=5;
		this.pendingTransactions=[];
		this.miningreward=100;
	}

	
	creategenesisblock(){
		return new Block(Date.now(),"Genesis Block","0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length-1];
	}
	

	minependingTransactions(miningRewardAddress){
		let block = new Block(Date.now(),this.pendingTransactions);
		block.mineBlock(this.difficulty);
		console.log("Block mined successfully");
		block.previousHash=this.getLatestBlock().hash;
		this.chain.push(block);
		this.pendingTransactions=[];
		this.createTransaction(new Transaction(null,miningRewardAddress,this.miningreward));
	}

	createTransaction(transaction){
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address){
		let balance = 0;
		for(const block of this.chain){
			for(const trans of block.transaction){
				if(trans.fromAddress===address){
					balance-=trans.amount;
				}
				if(trans.toAddress===address){
					balance+=trans.amount;
				}
			}
		}
		return balance;
	}

	 isChainValid(){
		for(let i = 1;i<this.chain.length;i++){
			var currentBlock = this.chain[i];
			var previousBlock = this.chain[i-1];
			if(currentBlock.hash!=currentBlock.calculateHash()){
				console.log("Invalid");
				return;
			}

			if(currentBlock.previousHash!=previousBlock.hash){
				console.log("Invalid");
				return;
			}
		}
		console.log("Valid");
	}
}

// Calling APIs 

let Blazecoin = new Blockchain();
Blazecoin.createTransaction(new Transaction("address1","address2",100));
Blazecoin.createTransaction(new Transaction("address2","address1",60));
console.log("mining started");
Blazecoin.minependingTransactions("address3");
console.log("Balance is: "+Blazecoin.getBalanceOfAddress("address3"));
Blazecoin.minependingTransactions("address3");
console.log("Balance is: "+Blazecoin.getBalanceOfAddress("address3"));

