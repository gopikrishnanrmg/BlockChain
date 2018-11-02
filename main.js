const SHA256 = require('crypto-js/sha256')

class Block{
	
	constructor(index,timestamp,data)
	{
		this.index=index;
		this.timestamp=timestamp;
		this.data=data;
	}

	calculateHash()
	{
		return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)).toString();
	}
}

class Blockchain{
	
	constructor(){
		this.chain=[this.creategenesisblock()];
	}

	creategenesisblock(){
		return new Block(0,Date.now(),"Genesis Block","0");
	}

	getLatestBlock(){
		return this.chain[this.chain.length-1];
	}
	
	addBlock(newBlock){
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
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
Blazecoin.addBlock(new Block(1,'2-11-2018',{Sender:"Rahul",Reciever:"Aney",Amount:400}));
Blazecoin.addBlock(new Block(2,'5-11-2018',{Sender:"Mahesh",Reciever:"Gokul",Amount:60}));
Blazecoin.addBlock(new Block(3,'11-11-2018',{Sender:"Zakir",Reciever:"Boby",Amount:169}));
Blazecoin.addBlock(new Block(4,'19-11-2018',{Sender:"Biju",Reciever:"Jahiz",Amount:698}));
console.log(JSON.stringify(Blazecoin,null,4));
Blazecoin.isChainValid();
Blazecoin.chain[1].data={Sender:"Gokul",Reciever:"Mahesh",Amount:600};
Blazecoin.chain[1].hash=Blazecoin.chain[1].calculateHash();
Blazecoin.chain[2].previousHash=Blazecoin.chain[1].hash;
Blazecoin.chain[2].hash=Blazecoin.chain[2].calculateHash();
console.log("Attacked");
console.log(JSON.stringify(Blazecoin,null,4));
Blazecoin.isChainValid();