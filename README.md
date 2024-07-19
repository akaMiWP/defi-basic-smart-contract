# DeFi basic smart contract

In this project, it contains smart contract files necessary to create a very simple version for DeFi smart contract.
The contract mainly consists of two functionalities which are swapping tokens and retriving price feed of each ERC20 token pair

## High-level Overview

<img width="935" alt="Screenshot 2567-07-19 at 20 57 59" src="https://github.com/user-attachments/assets/595c6687-e823-4a05-ab4d-8498e9d281b5">

### DeFi smart contract
- it knows a set of AggregatorV3 smart contract in order to receive price feed of a token pair at the contract deployment stage
- it allows EOAs to retrieve price feed and swap ERC20 tokens (EOAs must approve the ERC20 token allowances first before calling the function)

### AggregatorV3
- it exposes `latestRoundData` via an interface and return the price feed (in this sample, it's a mock static price feed)

### ERC20 token
- it allows minting ERC20 tokens

### Installation

`npm install`
