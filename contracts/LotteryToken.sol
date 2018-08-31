pragma solidity ^0.4.19;
import "../installed_contracts/oraclize-api/contracts/usingOraclize.sol";
import "./BasicToken.sol";
import "./Ownable.sol";

contract LotteryToken is usingOraclize, BasicToken, Ownable {

    string public symbol;
    string public name;
    uint8 public decimals;
    uint randomNumber;
    address[] public participants;
    mapping (address => bool) participantsMap;
    mapping (bytes32 => bool) queriesActive;
    bool public mintingFinished = false;

    event newRandomNumber_bytes(bytes);
    event newRandomNumber_uint(uint);
    event Mint(address indexed to, uint256 amount);
    event MintFinished();

    modifier canMint() {
        require(!mintingFinished);
        _;
    }

    modifier hasMintPermission() {
        require(msg.sender == owner);
        _;
    }

    function getParticipantsCount()
    returns (uint256)
    {
        return participants.length;
    }

    // Constructor
    function LotteryToken()
    payable
    public {
        symbol = "RNDT";
        name = "Random draw token";
        decimals = 2;

        // Replace the next line with your version:
//        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
//        oraclize_setProof(proofType_Ledger);
    }

    function() payable onlyOwner public {
    }

    function __callback(bytes32 _queryId, string _result, bytes _proof) public
    {
        require(msg.sender == oraclize_cbAddress());
        require(queriesActive[_queryId]);
        require(oraclize_randomDS_proofVerify__returnCode(_queryId, _result, _proof) == 0);

        uint maxRange = participants.length; // this is the highest uint we want to get. It should never be greater than 2^(8*N), where N is the number of random bytes we had asked the datasource to return
        randomNumber = uint(keccak256(_result)) % maxRange; // this is an efficient way to get the uint out in the [0, maxRange] range

        newRandomNumber_uint(randomNumber); // this is the resulting random number (uint)
        queriesActive[_queryId] = false;
    }

    function update() payable {
        uint N = 7; // number of random bytes we want the datasource to return
        uint delay = 0; // number of seconds to wait before the execution takes place
        uint callbackGas = 200000; // amount of gas we want Oraclize to set for the callback function
        bytes32 queryId = oraclize_newRandomDSQuery(delay, N, callbackGas); // this function internally generates the correct oraclize_query and returns its queryId
        queriesActive[queryId] = true;
    }

    function mint(uint256 _amount) public hasMintPermission canMint returns (bool)
    {
        totalSupply_ = totalSupply_.add(_amount);
        balances[msg.sender] = balances[msg.sender].add(_amount);
        Mint(msg.sender, _amount);
        Transfer(address(0), msg.sender, _amount);
        return true;
    }

    /**
     * @dev Function to stop minting new tokens.
     * @return True if the operation was successful.
     */
    function finishMinting() public onlyOwner canMint returns (bool) {
        mintingFinished = true;
        MintFinished();
        return true;
    }

    function transfer(address _to, uint256 _value) public onlyOwner returns (bool) {
        super.transfer(_to, _value);
        if (!participantsMap[_to]) {
            participants.push(_to);
            participantsMap[_to] = true;
            update();
        }
    }

    function getParticipants(uint256 _from, uint256 _to)
    public
    constant
    returns (bytes)
    {
        require(_from >= 0 && _to >= _from && participants.length >= _to);

        // Size of bytes
        uint256 size = 20 * (_to - _from + 1);
        uint256 counter = 0;
        bytes memory b = new bytes(size);
        for (uint256 x = _from; x < _to + 1; x++) {
            bytes memory elem = toBytes(participants[x]);
            for (uint y = 0; y < 20; y++) {
                b[counter] = elem[y];
                counter++;
            }
        }
        return b;
    }

    function getRandomParticipant() public returns(address) {
        require(participants.length > 0);
        update();
//        uint random = uint(sha3(block.timestamp)) % participants.length;
        return participants[randomNumber];
    }

    function toBytes(address a) constant returns (bytes b){
        assembly {
            let m := mload(0x40)
            mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))
            mstore(0x40, add(m, 52))
            b := m
        }
    }
}
