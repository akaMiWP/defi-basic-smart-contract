// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC20Metadata.sol";

contract DefiConsumerV3 is Ownable {
    struct PriceFeedPair {
        string ticker;
        address aggregatorAddress;
    }

    mapping(string => AggregatorV3Interface) public priceFeeds;

    constructor(PriceFeedPair[] memory priceFeedPairs) {
        for (uint i = 0; i < priceFeedPairs.length; i++) {
            priceFeeds[priceFeedPairs[i].ticker] = AggregatorV3Interface(
                priceFeedPairs[i].aggregatorAddress
            );
        }
    }

    function getPriceFeedFromPair(
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
        uint256 amount // parse in the smallest units
    ) external {
        int256 price = getPriceFeedFromPair(token1, token2);
        require(price > 0, "Invalid price");
        uint8 token1Decimals = IERC20Metadata(token1).decimals();
        uint8 token2Decimals = IERC20Metadata(token2).decimals();
        uint256 amountOfToken2 = (amount * uint256(price)) /
            (10 ** (18 + token1Decimals - token2Decimals));
        require(amountOfToken2 > 0, "Amount of tokens is too small");
        require(IERC20(token1).transferFrom(msg.sender, address(this), amount));
        require(IERC20(token2).transfer(msg.sender, amountOfToken2));
    }
}
