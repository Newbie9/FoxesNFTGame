// log
import store from "../store";


const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  //console.log("success")

  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  //console.log("failed")
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let name = await store
        .getState()
        .blockchain.smartContract.methods.name()
        .call();
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();

      totalSupply=totalSupply*1+144;
      
      let tokensOfUser = await store
        .getState()
        .blockchain.smartContract.methods.walletOfOwner(account)
        .call();      
      let reward = await store
        .getState()
        .blockchain.smartContract.methods.getReflectionBalances()
        .call({from:store.getState().blockchain.account });

      let totalClaimable = await store
        .getState()
        .blockchain.gameContract.methods.getTotalClaimable(account)
        .call();
      let joinPVPTokenPrice = await store
        .getState()
        .blockchain.gameContract.methods.joinPVPTokenPrice()
        .call();
      let joinPVPprice = await store
        .getState()
        .blockchain.gameContract.methods.joinPVPprice()
        .call();
      let balanceOf = await store
        .getState()
        .blockchain.gameContract.methods.balanceOf(account)
        .call();
      let lastwinner = await store
        .getState()
        .blockchain.gameContract.methods.lastwinner()
        .call();
      let id1 = await store
        .getState()
        .blockchain.gameContract.methods.team1ids(0)
        .call();
      let id2 = await store
        .getState()
        .blockchain.gameContract.methods.team1ids(1)
        .call();
      let id3 = await store
        .getState()
        .blockchain.gameContract.methods.team2ids(0)
        .call();
      let id4 = await store
        .getState()
        .blockchain.gameContract.methods.team2ids(1)
        .call();
      let currentplayerno = 0;
      if(id1!=='0'){
        currentplayerno+=1;
      }
      if(id2!=='0'){
        currentplayerno+=1;
      }
      if(id3!=='0'){
        currentplayerno+=1;
      }
      if(id4!=='0'){
        currentplayerno+=1;
      }       
        
      //console.log(reward)
      let temp = await dispatch(
        fetchDataSuccess({
          name,
          totalSupply,          
          tokensOfUser,
          reward,
          totalClaimable,
          joinPVPprice,
          joinPVPTokenPrice,
          balanceOf,
          currentplayerno,
          lastwinner
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
