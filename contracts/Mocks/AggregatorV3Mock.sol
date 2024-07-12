// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract AggregatorV3Mock {
    int256 private latestAnswer;

    constructor(int256 answer) {
        latestAnswer = answer;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, latestAnswer, 0, 0, 0);
    }
}
