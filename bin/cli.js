#!/usr/bin/env node

const { program } = require('commander');
const { compileCircuit } = require('../lib/compile');
const { testCircuit } = require('../lib/test');
const { deployVerifier } = require('../lib/deploy');
const { verifyProof } = require('../lib/verify');

program
  .command('compile <circomFilePath>')
  .description('Compile a circom circuit')
  .action((circomFilePath) => {
    compileCircuit(circomFilePath);
  });

  program
  .command('test <folder> <inputJson>')
  .description('Test the circuit with input.json and generate proof/public.json')
  .action((folder, inputJson) => {
    testCircuit(folder, inputJson);
  });

  program
  .command('deploy <folder> <privateKey>')
  .description('Deploy verifier.sol in folder to Avalanche (Fuji by default, --mainnet for C-Chain)')
  .option('--mainnet', 'Deploy to Avalanche C-Chain mainnet instead of Fuji testnet')
  .action((folder, privateKey, options) => {
    deployVerifier(folder, privateKey, { mainnet: !!options.mainnet });
  });


  program.parse(process.argv);


module.exports = {
  verifyProof
};    