pragma solidity >=0.7.0 <0.9.0;

/**
 * @title DailyStatss
 * @dev Store daily number of transactions and gas fees inside a Contract
 */
contract DailyStats {
    address public owner;

    struct Stat {
        uint256 transactionsCount; // Number of transactions
        uint256 gasFees; // Sum of gas fees for all transactions
        string date; // Date format in a form of YYYY-mm-dd
    }

    Stat[] stats;
    uint256 counter = 0;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function store(
        uint256 _transactionsCount,
        uint256 _gasFees,
        string memory _date
    ) public onlyOwner {
        // check if timeformat is in format "YYYY-mm-dd"
        stats.push(Stat(_transactionsCount, _gasFees, _date));
    }

    function latest() public view returns (Stat memory) {
        require(stats.length == 0, 'No stats yet');
        return stats[stats.length - 1];
    }
}
