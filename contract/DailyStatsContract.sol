// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title DailyStatss
 * @dev Store daily number of transactions and gas fees inside a Contract
 */
contract DailyStats {
    address public owner = msg.sender;

    struct Stat {
        uint256 transactionsCount; // Number of transactions
        uint256 gasFees; // Sum of gas fees for all transactions
        string date; // Date format in a form of YYYY-mm-dd
    }

    Stat[] stats;

    modifier onlyOwner()
    {
        require(msg.sender != owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function store(
        uint256 transactionsCount,
        uint256 gasFees,
        string memory timeformat
    ) public onlyOwner{
        stats.push(Stat(transactionsCount, gasFees, timeformat));
    }
}
