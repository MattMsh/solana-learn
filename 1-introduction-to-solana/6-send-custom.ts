import {
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
  clusterApiUrl,
  Keypair,
  Cluster,
} from '@solana/web3.js';
import 'dotenv/config';

const CLUSTER: Cluster = 'devnet';

const secretKey = process.argv[2];
const suppliedPubkey = process.argv[3];
const lamportsToSend = process.argv[4];

if (!secretKey) {
  console.log(`Please provide a private key to send from`);
  process.exit(1);
}

if (!suppliedPubkey) {
  console.log(`Please provide a public key to send to`);
  process.exit(1);
}

if (!lamportsToSend) {
  console.log(`Please provide an amount in lamports to send`);
  process.exit(1);
}

const uintArraySecret = Uint8Array.from(Buffer.from(secretKey, 'base64'));
const senderKeypair = Keypair.fromSecretKey(uintArraySecret);

const toPubkey = new PublicKey(suppliedPubkey);

const connection = new Connection(clusterApiUrl(CLUSTER), 'confirmed');

console.log(
  `✅ Loaded our own keypair, the destination public key, and connected to Solana`
);

const transaction = new Transaction();

const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: senderKeypair.publicKey,
  toPubkey,
  lamports: parseInt(lamportsToSend),
});

transaction.add(sendSolInstruction);

console.time('sendAndConfirmTransaction');
const signature = await sendAndConfirmTransaction(connection, transaction, [
  senderKeypair,
]);
console.timeEnd('sendAndConfirmTransaction');

console.log(
  `💸 Finished! Sent ${lamportsToSend} from ${senderKeypair.publicKey.toBase58()} to the address ${toPubkey}.`
);
console.log(`Transaction signature is ${signature}`);
console.log(
  `You can view your transaction on Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=${CLUSTER}`,
);
