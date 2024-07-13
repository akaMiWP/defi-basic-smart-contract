// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract DefiConsumerV3 is Ownable {
    mapping(string => AggregatorV3Interface) public priceFeeds;

    constructor() {
        priceFeeds["BTC/ETH"] = AggregatorV3Interface(
            0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22
        );
        priceFeeds["BTC/USD"] = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );
        priceFeeds["DAI/USD"] = AggregatorV3Interface(
            0x14866185B1962B63C3Ea9E03Bc1da838bab34C19
        );
        priceFeeds["ETH/USD"] = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        priceFeeds["LINK/ETH"] = AggregatorV3Interface(
            0x42585eD362B3f1BCa95c640FdFf35Ef899212734
        );
        priceFeeds["LINK/USD"] = AggregatorV3Interface(
            0xc59E3633BAAC79493d908e63626716e204A45EdF
        );
    }

    function getChainlinkDataFeedLatestAnswer(
        string calldata priceFeed
    ) public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeeds[priceFeed].latestRoundData();
        return answer;
    }

    function depositToken(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(msg.sender, amount), "Deposit failed");
    }
}
