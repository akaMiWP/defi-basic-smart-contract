// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC20Metadata.sol";

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
        address token1,
        address token2
    ) public view returns (int) {
        string memory token1Symbol = IERC20Metadata(token1).symbol();
        string memory token2Symbol = IERC20Metadata(token2).symbol();
        string memory priceFeedTicker = string(
            abi.encodePacked(token1Symbol, "/", token2Symbol)
        );
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeeds[priceFeedTicker].latestRoundData();
        return answer;
    }

    function depositToken(address token, uint256 amount) external onlyOwner {
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Deposit failed"
        );
    }

    function swapTokens(
        address token1,
        address token2,
        uint256 amount
    ) external {
        int256 price = getChainlinkDataFeedLatestAnswer(token1, token2);
        require(price > 0, "Invalid price");
        uint256 amountOfToken2 = (amount * uint256(price)) / 1e18;
        require(IERC20(token1).transferFrom(msg.sender, address(this), amount));
        require(IERC20(token2).transfer(msg.sender, amountOfToken2));
    }
}
