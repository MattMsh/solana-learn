import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';

const suppliedPublicKey = process.argv[2];
if (!suppliedPublicKey) {
  throw new Error('Provide a public key to check the balance of!');
}

const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
const publicKey = await resolvePublicKey(suppliedPublicKey);
const balanceInLamports = await connection.getBalance(publicKey);
const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;

console.log(
  `The balance of the account at ${publicKey} is ${balanceInSol} SOL`
);
console.log(`✅ Finished!`);

const FAKE_DOMAIN_NAME_SERVICE = {
  get: (domain: string) => {
    const FAKE_DOMAIN_NAMES = {
      'toly.sol': '86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY',
      'shak.sol': 'gacMrsrxNisAhCfgsUAVbwmTC3w9nJB6NychLAnTQFv',
      'mccann.sol': 'JCZjJcmuWidrj5DwuJBxwqHx7zRfiBAp6nCLq3zYmBxd',
    };
    return FAKE_DOMAIN_NAMES[domain];
  },
};

async function resolvePublicKey(publicKey: string) {
  const errors: string[] = [];

  try {
    return new PublicKey(publicKey);
  } catch (e) {
    errors.push(e.message);
  }

  try {
    return new PublicKey(FAKE_DOMAIN_NAME_SERVICE.get(publicKey));
  } catch (e) {
    errors.push(e.message);
  }

  throw new Error(errors.join('\n'));
}