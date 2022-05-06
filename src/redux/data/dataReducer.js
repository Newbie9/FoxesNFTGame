const initialState = {
  loading: false,
  name: "",
  totalSupply: 0,  
  tokensOfUser: [],
  joinPVPTokenPrice: 0,
  joinPVPprice: 0,
  balanceOf: 0,
  lastwinner: false,
  error: false,
  errorMsg: "",  
  reward: 0,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        name: action.payload.name,
        totalSupply: action.payload.totalSupply,        
        tokensOfUser: action.payload.tokensOfUser,
        reward: action.payload.reward,
        totalClaimable: action.payload.totalClaimable,
        joinPVPTokenPrice: action.payload.joinPVPTokenPrice,
        joinPVPprice : action.payload.joinPVPprice,
        balanceOf : action.payload.balanceOf,
        lastwinner : action.payload.lastwinner,
        currentplayerno : action.payload.currentplayerno,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      console.log("check data failed")
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
