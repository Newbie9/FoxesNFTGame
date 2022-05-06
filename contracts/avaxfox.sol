
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

abstract contract AvaxFoxesToken {
    function getTotalClaimable(address _user) public view returns(uint256){}
    function getReward(address _from) public {}
    function burn(address _from, uint256 _amount) external {}
	function balanceOf(address _user) external view returns(uint256) {}
    function mint(address _to, uint256 _amount) external {}    
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor (){
        address msgSender = _msgSender();
        _owner = msgSender;
        //emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

contract SlyFoxSale is Ownable {
AvaxFoxesToken AvaxFoxesTokenC = AvaxFoxesToken(0xa92CDF589C8977f9caC394121F4bACFc47F9b64C);
uint256 public avax_price = 0.1 ether;
uint256 public token_price = 20 ether;
uint256 public max_supply = 20000 ether;
uint256 public total_supply = 0;	

function set_avax_price(uint256 price) external onlyOwner{
	avax_price = price;
}
function set_token_price(uint256 price) external onlyOwner{
	token_price = price;
}
function set_max_supply(uint256 _max_supply) external onlyOwner{
	max_supply = _max_supply;
}

function buy(uint256 amount) external payable{
    require(amount*avax_price == msg.value, "AvaxFoxes: invalid ether value");
    require(total_supply+amount*token_price<max_supply);
    total_supply+=amount*token_price;
    AvaxFoxesTokenC.mint(msg.sender, amount*token_price);
}


}