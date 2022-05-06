import React, { useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import { Box, Container, Text, Spacer, VStack, HStack, Button, Center, Flex, Image, SimpleGrid , Accordion, AccordionItem,  AccordionButton,  AccordionPanel,  AccordionIcon, Divider  } from "@chakra-ui/react";
import Countdown from "react-countdown";
import { Input, InputGroup, InputRightElement  } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/react"
import { Progress } from '@chakra-ui/react'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react"
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react"
import { ScrollTo } from "react-scroll-to";

import pvp_sword from "../assets/images/fight_img.png"
import attack_icon from "../assets/images/attack-icon.png"
import health_icon from "../assets/images/health-icon.png"
import critical_icon from "../assets/images/critical-icon.png"
import hitrate_icon from "../assets/images/hitrate-icon.png"
import evasion_icon from "../assets/images/evasion-icon.png"
import hunt_img from "../assets/images/hunt_img.png"
import fight_img from "../assets/images/fight_img.png"
import slyfox_img from "../assets/images/SlyFox.png"

function Game() {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [feedback, setFeedback] = useState("");
    const [NFTS, setNFTS] = useState([]);    
    const [LoadingNFTS, setLoadingNFTS] = useState(false);
    const [lastBattle1NFTS, setlastBattle1NFTS] = useState([]);    
    const [Loadinglast1NFTS, setLoadinglast1NFTS] = useState(false);
    const [lastBattle2NFTS, setlastBattle2NFTS] = useState([]);    
    const [Loadinglast2NFTS, setLoadinglast2NFTS] = useState(false);
    const [bestNFTS, setbestNFTS] = useState([]);    
    const [LoadingbestNFTS, setLoadingbestNFTS] = useState(false);
    const [lastwinner_bg_str, setlastwinner_bg_str] = useState("");
    const [lastwinner_bg_str_m, setlastwinner_bg_str_m] = useState("");
    const [selectedNFT, setselectedNFT] = useState();
    const [value, setValue] = React.useState("");
    const handleChange = event => setValue(event.target.value);
    const [best_nft_bg_str, setbest_nft_bg_str] = useState(["#FFD700", "#C0C0C0","#CD7F32"]);
    const toast = useToast()
    const [amount, setAmount] = useState(20);
    
    var triedConnect = false;
    

    const powerUp = (nftState) => {
        if (nftState.attackinc + nftState.healthinc + nftState.criticalinc + nftState.hitrateinc + nftState.evasioninc < 1) {
            setFeedback("");
            setFeedback("You cant power up your avax fox 0 times");
            return;
        }        
        blockchain.gameContract.methods.balanceOf(blockchain.account).call()
        .then((amount) => {
            if(amount>=getCost(nftState)*1**18){
                blockchain.gameContract.methods.increaseStats(nftState.id, nftState.attackinc, nftState.healthinc, nftState.criticalinc, nftState.hitrateinc, nftState.evasioninc)
                .send({
                    to: blockchain.gameContract.address, // Smart Contract Adress
                    from: blockchain.account,                    
                })
                .once("error", (err) => {
                    console.log(err);
                    setFeedback("Sorry, something went wrong please try again later.");                    
                })
                .then((receipt) => {
                    setFeedback(
                    "You successfully powered up your AvaxFox."
                    );                    
                    dispatch(fetchData(blockchain.account));                    
                });
            }
            else{
                setFeedback("");
                setFeedback("You don't have enough coins");
            }
        })
    };

    const Hunt = (nftState) => {
        if(!nftState.canjoinhunt) {
            setFeedback("");
            setFeedback("You cant Hunt with this fox now");
            return;
        }        
        blockchain.gameContract.methods.Hunt(nftState.id)
                .send({
                    to: blockchain.gameContract.address, // Smart Contract Adress
                    from: blockchain.account,                    
                })
                .once("error", (err) => {
                    console.log(err);
                    setFeedback("Sorry, something went wrong please try again later.");                    
                })
                .then((receipt) => {
                    setFeedback(
                    "You successfully Hunted."
                    );                    
                    dispatch(fetchData(blockchain.account));                    
                });
    };

    const HuntwithAll = () => {            
        blockchain.gameContract.methods.HuntwithAll(blockchain.account)
                .send({
                    to: blockchain.gameContract.address, // Smart Contract Adress
                    from: blockchain.account,                    
                })
                .once("error", (err) => {
                    console.log(err);
                    setFeedback("Sorry, something went wrong please try again later.");                    
                })
                .then((receipt) => {
                    setFeedback(
                    "You successfully Hunted with all available foxes."
                    );                    
                    dispatch(fetchData(blockchain.account));                    
                });
    };

    const claimTokens = () => {
        console.log(NFTS) 
        console.log(LoadingNFTS)       
        blockchain.gameContract.methods.getReward(blockchain.account)
        .send({
            to: blockchain.gameContract.address, // Smart Contract Adress
            from: blockchain.account,                    
        })
        .once("error", (err) => {
            console.log(err);
            setFeedback("Sorry, something went wrong please try again later.");                    
        })
        .then((receipt) => {
            setFeedback(
            "You successfully claimed your tokens."
            );                    
            dispatch(fetchData(blockchain.account));
        });
    };
    const buySlyFox = (amount) => {        
        
        blockchain.saleContract.methods.buy(amount/20)
        .send({
            to: blockchain.saleContract.address, // Smart Contract Adress
            from: blockchain.account,
            value: blockchain.web3.utils.toWei((0.1 * amount/20).toString(), "ether"),
            //value: blockchain.web3.utils.toWei((0.1).toString(), "ether"),                    
        })
        .once("error", (err) => {
            console.log(err);
            setFeedback("Sorry, something went wrong please try again later.");                    
        })
        .then((receipt) => {
            setFeedback(
            "You successfully bought SlyFox."
            );                    
            dispatch(fetchData(blockchain.account));                        
        });
        
    };

    const joinPVP = (nftState) => {        
        if(nftState.canjoinpvp){
            blockchain.gameContract.methods.balanceOf(blockchain.account).call()
            .then((amount) => {
                if(amount>=data.joinPVPTokenPrice){
                    blockchain.gameContract.methods.joinPVP(nftState.id)
                    .send({
                        to: blockchain.gameContract.address, // Smart Contract Adress
                        from: blockchain.account,
                        value: data.joinPVPprice,
                        //value: blockchain.web3.utils.toWei((0.1).toString(), "ether"),                    
                    })
                    .once("error", (err) => {
                        console.log(err);
                        setFeedback("Sorry, something went wrong please try again later.");                    
                    })
                    .then((receipt) => {
                        setFeedback(
                        "You successfully powered up your AvaxFox."
                        );                    
                        dispatch(fetchData(blockchain.account));                        
                    });
                }
                else{
                    setFeedback("");
                    setFeedback("You don't have enough coins")
                }
            })
        }else{
            setFeedback("");
            setFeedback("You can't join pvp now")
        }
        
    };

    function getCost(nftState) {
        let requiredToken=0;
        for(let i=0;i<parseInt(nftState.attackinc);i++){
            requiredToken += parseInt(nftState.attack)+i+1;
        }
        for(let i=0;i<parseInt(nftState.healthinc);i++){
            requiredToken += parseInt(nftState.health)+i+1;
        }
        for(let i=0;i<parseInt(nftState.criticalinc);i++){
            requiredToken += parseInt(nftState.critical)+i+1;
        }
        for(let i=0;i<parseInt(nftState.hitrateinc);i++){
            requiredToken += parseInt(nftState.hitrate)+i+1;
        }
        for(let i=0;i<parseInt(nftState.evasioninc);i++){
            requiredToken += parseInt(nftState.evasion)+i+1;
        }
        
        return requiredToken;
    }

    const fetchMetatDataForNFTS = () => {    
        if (blockchain.account !== "" && blockchain.smartContract !== null && !LoadingNFTS) {
        if(data.tokensOfUser.length>0){
            setLoadingNFTS(true);
        }            
        setNFTS([]);
        
        //blockchain.smartContract.methods.mintsOfOwner(blockchain.account).call().then(console.log)
        //blockchain.smartContract.methods.getMostMinters().call().then(console.log)
        let uri = "https://ipfs.io/ipfs/QmQ36Manmu7rJpQnE1nMVPzS14dBz3iV8kebNFMcmhVtfe/"
        for(let i=0;i<data.tokensOfUser.length;i++){ 
            let nft = data.tokensOfUser[i];
            
            
            fetch(uri.concat(nft.toString().concat(".json")) )             
            .then((response) => response.json())        
            .then((metaData) => {
                blockchain.gameContract.methods.canJoinPVP(blockchain.account,nft).call()
                .then((canjoinpvp) => {
                    blockchain.gameContract.methods.canJoinHunt(nft).call()
                    .then((canjoinhunt) => {
                    blockchain.gameContract.methods.energy(nft).call()
                        .then((energy) => {
                        blockchain.gameContract.methods.Attack(nft).call()
                            .then((attack) => {
                                blockchain.gameContract.methods.Health(nft).call()
                                .then((health) => {
                                    blockchain.gameContract.methods.Critical(nft).call()
                                    .then((critical) => {
                                        blockchain.gameContract.methods.Hitrate(nft).call()
                                        .then((hitrate) => {
                                            blockchain.gameContract.methods.Evasion(nft).call()
                                            .then((evasion) => {
                                                setNFTS((prevState) => [
                                                ...prevState,            
                                                { id: nft, metaData: metaData , attack: attack, health: health, critical: critical, hitrate: hitrate, evasion: evasion,
                                                    attackinc:0, healthinc:0, criticalinc:0, hitrateinc:0, evasioninc:0, canjoinpvp:canjoinpvp, canjoinhunt:canjoinhunt,
                                                    energy:energy
                                                },
                                                ]);
                                            })                        
                                        })
                                    })
                                })
                            })
                        })
                    })
                })   
                
            }).then(function (){
                if (i == data.tokensOfUser.length - 1){
                //setLoadingNFTS(false)
                //setNFTS((prevState) =>
                //prevState.sort((a, b) => a.id < b.id ? 1 : -1)
                //)
                
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
        }
        
    };
    const fetchlastBattleNFTS = () => {    
        if (blockchain.account !== "" && blockchain.smartContract !== null && !Loadinglast1NFTS && !Loadinglast2NFTS) {
        setlastBattle1NFTS([]);
        setlastBattle2NFTS([]);
        console.log("asd")
        setLoadinglast1NFTS(true);
        setLoadinglast2NFTS(true);
        let uri = "https://ipfs.io/ipfs/QmQ36Manmu7rJpQnE1nMVPzS14dBz3iV8kebNFMcmhVtfe/"
        blockchain.gameContract.methods.lastteam1ids(0).call()
        .then((team1id1) => {
            blockchain.gameContract.methods.lastteam1ids(1).call()
            .then((team1id2) => {
                let team1ids = [team1id1,team1id2];
                for(let i=0;i<team1ids.length;i++){ 
                    let nft = team1ids[i];               
                    fetch(uri.concat(nft.toString().concat(".json")) )             
                    .then((response) => response.json())        
                    .then((metaData) => {
                        blockchain.gameContract.methods.canJoinPVP(blockchain.account,nft).call()
                        .then((canjoinpvp) => {
                            blockchain.gameContract.methods.canJoinHunt(nft).call()
                            .then((canjoinhunt) => {
                            blockchain.gameContract.methods.energy(nft).call()
                                .then((energy) => {
                                blockchain.gameContract.methods.Attack(nft).call()
                                    .then((attack) => {
                                        blockchain.gameContract.methods.Health(nft).call()
                                        .then((health) => {
                                            blockchain.gameContract.methods.Critical(nft).call()
                                            .then((critical) => {
                                                blockchain.gameContract.methods.Hitrate(nft).call()
                                                .then((hitrate) => {
                                                    blockchain.gameContract.methods.Evasion(nft).call()
                                                    .then((evasion) => {
                                                        setlastBattle1NFTS((prevState) => [
                                                        ...prevState,            
                                                        { id: nft, metaData: metaData , attack: attack, health: health, critical: critical, hitrate: hitrate, evasion: evasion,
                                                            attackinc:0, healthinc:0, criticalinc:0, hitrateinc:0, evasioninc:0, canjoinpvp:canjoinpvp, canjoinhunt:canjoinhunt,
                                                            energy:energy
                                                        },
                                                        ]);
                                                    })                        
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })   
                        
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
            })
        })

        blockchain.gameContract.methods.lastteam2ids(0).call()
        .then((team2id1) => {
            blockchain.gameContract.methods.lastteam2ids(1).call()
            .then((team2id2) => {
                let team2ids = [team2id1,team2id2];
                for(let i=0;i<team2ids.length;i++){ 
                    let nft = team2ids[i];               
                    fetch(uri.concat(nft.toString().concat(".json")) )             
                    .then((response) => response.json())        
                    .then((metaData) => {
                        blockchain.gameContract.methods.canJoinPVP(blockchain.account,nft).call()
                        .then((canjoinpvp) => {
                            blockchain.gameContract.methods.canJoinHunt(nft).call()
                            .then((canjoinhunt) => {
                            blockchain.gameContract.methods.energy(nft).call()
                                .then((energy) => {
                                blockchain.gameContract.methods.Attack(nft).call()
                                    .then((attack) => {
                                        blockchain.gameContract.methods.Health(nft).call()
                                        .then((health) => {
                                            blockchain.gameContract.methods.Critical(nft).call()
                                            .then((critical) => {
                                                blockchain.gameContract.methods.Hitrate(nft).call()
                                                .then((hitrate) => {
                                                    blockchain.gameContract.methods.Evasion(nft).call()
                                                    .then((evasion) => {
                                                        setlastBattle2NFTS((prevState) => [
                                                        ...prevState,            
                                                        { id: nft, metaData: metaData , attack: attack, health: health, critical: critical, hitrate: hitrate, evasion: evasion,
                                                            attackinc:0, healthinc:0, criticalinc:0, hitrateinc:0, evasioninc:0, canjoinpvp:canjoinpvp, canjoinhunt:canjoinhunt,
                                                            energy:energy
                                                        },
                                                        ]);
                                                    })                        
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })   
                        
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
            })
        })

        }
        
    };
    function unique(arr) {
        var u = {}, a = [];
        for(var i = 0, l = arr.length; i < l; ++i){
            if(!u.hasOwnProperty(arr[i])) {
                a.push(arr[i]);
                u[arr[i]] = 1;
            }
        }
        return a;
    }
    const fetchbestNFTS = () => {    
        if (blockchain.account !== "" && blockchain.smartContract !== null && !LoadingbestNFTS) {
        setbestNFTS([]);        
        setLoadingbestNFTS(true);        
        let uri = "https://ipfs.io/ipfs/QmQ36Manmu7rJpQnE1nMVPzS14dBz3iV8kebNFMcmhVtfe/"
        blockchain.gameContract.methods.bestFoxes(0).call()
        .then((best1) => {
            blockchain.gameContract.methods.bestFoxes(1).call()
            .then((best2) => {
                blockchain.gameContract.methods.bestFoxes(2).call()
                .then((best3) => {
                let bestids_temp = [best1,best2,best3];
                let bestids = unique(bestids_temp)

                for(let i=0;i<bestids.length;i++){ 
                    let nft = bestids[i];               
                    fetch(uri.concat(nft.toString().concat(".json")) )             
                    .then((response) => response.json())        
                    .then((metaData) => {
                        blockchain.gameContract.methods.canJoinPVP(blockchain.account,nft).call()
                        .then((canjoinpvp) => {
                            blockchain.gameContract.methods.canJoinHunt(nft).call()
                            .then((canjoinhunt) => {
                            blockchain.gameContract.methods.energy(nft).call()
                                .then((energy) => {
                                blockchain.gameContract.methods.Attack(nft).call()
                                    .then((attack) => {
                                        blockchain.gameContract.methods.Health(nft).call()
                                        .then((health) => {
                                            blockchain.gameContract.methods.Critical(nft).call()
                                            .then((critical) => {
                                                blockchain.gameContract.methods.Hitrate(nft).call()
                                                .then((hitrate) => {
                                                    blockchain.gameContract.methods.Evasion(nft).call()
                                                    .then((evasion) => {
                                                                                                      
                                                    
                                                            setbestNFTS((prevState) => [
                                                                ...prevState,            
                                                                { id: nft, metaData: metaData , attack: attack, health: health, critical: critical, hitrate: hitrate, evasion: evasion,
                                                                    attackinc:0, healthinc:0, criticalinc:0, hitrateinc:0, evasioninc:0, canjoinpvp:canjoinpvp, canjoinhunt:canjoinhunt,
                                                                    energy:energy
                                                                },
                                                                ]);
                                                        
                                                        
                                                    })                        
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })   
                        
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
            })
        })
        
        })
        }
        
    };
    const fetchselectedNFT = () => {    
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
        setselectedNFT();             
        let uri = "https://ipfs.io/ipfs/QmQ36Manmu7rJpQnE1nMVPzS14dBz3iV8kebNFMcmhVtfe/"
        
                    let nft = value;               
                    fetch(uri.concat(nft.toString().concat(".json")) )             
                    .then((response) => response.json())        
                    .then((metaData) => {
                        blockchain.gameContract.methods.canJoinPVP(blockchain.account,nft).call()
                        .then((canjoinpvp) => {
                            blockchain.gameContract.methods.canJoinHunt(nft).call()
                            .then((canjoinhunt) => {
                            blockchain.gameContract.methods.energy(nft).call()
                                .then((energy) => {
                                blockchain.gameContract.methods.Attack(nft).call()
                                    .then((attack) => {
                                        blockchain.gameContract.methods.Health(nft).call()
                                        .then((health) => {
                                            blockchain.gameContract.methods.Critical(nft).call()
                                            .then((critical) => {
                                                blockchain.gameContract.methods.Hitrate(nft).call()
                                                .then((hitrate) => {
                                                    blockchain.gameContract.methods.Evasion(nft).call()
                                                    .then((evasion) => {
                                                        setselectedNFT((prevState) => [                                                                   
                                                        { id: nft, metaData: metaData , attack: attack, health: health, critical: critical, hitrate: hitrate, evasion: evasion,
                                                            attackinc:0, healthinc:0, criticalinc:0, hitrateinc:0, evasioninc:0, canjoinpvp:canjoinpvp, canjoinhunt:canjoinhunt,
                                                            energy:energy
                                                        },
                                                        ]);
                                                    })                        
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })   
                        
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }    
        
        
        
    };


    

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
        dispatch(fetchData(blockchain.account)); 
                
        }
    };
    useEffect(() => {  
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
        getData();                          
        }else{
        if(!triedConnect){
            triedConnect = true;
            dispatch(connect())
        }
        }
    }, [blockchain.smartContract, blockchain.account]);

    useEffect(() => { 
        if (blockchain.account !== "" && blockchain.smartContract !== null) {   
            
            fetchMetatDataForNFTS();            
            if(!Loadinglast1NFTS){
                fetchlastBattleNFTS();
            }
            if(!LoadingbestNFTS){
                fetchbestNFTS();
            }          
            if(data.lastwinner){
                setlastwinner_bg_str('linear(to-r, red.400, green.400)');
                setlastwinner_bg_str_m('linear(to-b, red.400, green.400)');
            }else{
                setlastwinner_bg_str('linear(to-r, green.400, red.400)');
                setlastwinner_bg_str_m('linear(to-b, green.400, red.400)');
            }
            console.log(selectedNFT)
        }        
    }, [data, blockchain.smartContract, blockchain.account]);
    

    useEffect(() => {
        if(feedback!=""){
            toast({
                description: feedback,
                //status: "error",
                duration: 1000,
                isClosable: true,
            })
        } 
        
    }, [feedback]);

    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false)
    const [button, setButton] = useState(false);
    const showButton = () => {
        if (window.innerWidth <= 960) {
          setButton(true);
        } else {
          setButton(false);
        }
      };
    useEffect(() => {
        showButton();
        
    }, []);
    window.addEventListener('resize', showButton);

    return (
        <div>        
            {!button? 
            <div>
            {blockchain.account !== "" &&
            blockchain.smartContract !== null ?  (
      <VStack  bgGradient={'linear(to-b, transparent, blackAlpha.600)'} pt='%3' pb='5%' spacing='0px'>
        
        <Flex w='100vw' bg = '#1d67ff' >
        <HStack  ml='25vw'>
            <Text color='white' style={{ textAlign: "left", fontSize: 18, fontWeight: "bold" }} isTruncated w='25vw'>
                {"You currently have: "}{(data.balanceOf/(1000000000000000000)).toFixed(4)}{" SlyFox "}
            </Text>
            
            <Box bg='gray.200' borderRadius='150'>
                <HStack >
                    <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }} isTruncated w='18vw'>
                        {(data.totalClaimable/(1000000000000000000)).toFixed(4)}{" SlyFox"}
                    </Text>
                    <Button
                        px='1.5vw'
                        py='7'
                        //bg='orange'
                        bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
                        borderRadius='150'
                        boxShadow='5'
                        fontSize= '18'
                        mx-auto
                        //variant="outline"
                        _hover={{ bg: "blackAlpha.500" }}
                        onClick={(e) => {
                            e.preventDefault();
                            claimTokens();
                        }}
                    >Claim</Button>
                </HStack>
            </Box>
            
        </HStack>
        </Flex>
        <HStack  mt='5vh' spacing='0px'>
        <Flex w='70vw' h='70vh' bgGradient={'linear(to-b, #1d67ff, blue.200)'} >
        <VStack paddingTop='5vh'>
            <Text mt = '3vh' color='white' style={{ textAlign: "middle", fontSize: 35, fontWeight: "bold" }} >
                Best Foxes
            </Text>
        <HStack spacing = '10vw'>            
        <SimpleGrid columns={3} spacingX="2vw" spacingY="20px" ml = '4vw'>
            {data.loading ? (
              <>
                                    
              </>
            ) : (
                bestNFTS.sort((a, b) => parseInt(a.attack)+parseInt(a.health)+parseInt(a.critical)+parseInt(a.hitrate)+parseInt(a.evasion) < parseInt(b.attack)+parseInt(b.health)+parseInt(b.critical)+parseInt(b.hitrate)+parseInt(b.evasion) ? 1 : -1).map((nft, index) => {
                
                  return (
                    <VStack align = 'center' key={index} w='18vw' h = '50vh'  py='2vh' bg='whiteAlpha.600' px='1vw' borderRadius='xl' boxShadow='xl' spacing='3%'>
                        
                        <Text align='center' fontWeight='semiBold' fontSize='xl'> {nft.metaData.name} </Text>
                        
                        <Image
                          alt={nft.metaData.name}
                          src={nft.metaData.image.replace("ipfs://","https://ipfs.io/ipfs/")}
                          boxSize="200px"
                          objectFit="cover"
                          pos = {'center', 'center'}
                          //width={150}
                        />
                        
                        <VStack>

                        <HStack>
                        <Image                            
                        src={attack_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Attack`} </strong>: {nft.attack} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={health_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Health`} </strong>: {nft.health} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={critical_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Critical`} </strong>: {nft.critical} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={hitrate_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Hit Rate`} </strong>: {nft.hitrate} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={evasion_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Evasion`} </strong>: {nft.evasion} </Text>
                        </HStack>
                        
                        </VStack>                            
                                                             
                        
                      </VStack>

                  );
                }))
            }
        
        </SimpleGrid>
            
        </HStack>
        </VStack>
        </Flex>
        <Flex align = 'middle' bgGradient={'linear(to-b, #1d67ff, blue.200)'} w='35vw' h='70vh'>
            <VStack ml = '7vw' align = 'middle' paddingTop='3vh'>
                <Text color = 'white' posx = 'middle' style={{ textAlign: "middle", fontSize: 35, fontWeight: "bold" }} >
                    {"Check an Avax Fox"}
                </Text>
                <HStack>
                <Input
                    value={value}
                    onChange={handleChange}                    
                    placeholder="Avax Fox ID#"
                    size="sm"
                    borderRadius='20'
                    bg = 'blue.200'
                    x
                />
                <Button
                        px='1vw'
                        py='7'
                        //bg='orange'
                        bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
                        borderRadius='20'
                        boxShadow='5'
                        fontSize= '18'
                        mx-auto                           
                        _hover={{ bg: "blackAlpha.500" }}
                        onClick={(e) => {
                            e.preventDefault();
                            fetchselectedNFT(); 
                        }}
                    >Check</Button>
                </HStack>
                {selectedNFT==null ? (
              <>
                                    
              </>
            ) : (<VStack align = 'center'  w='18vw' h = '50vh' bg='whiteAlpha.600' py='2vh' px='1vw' borderRadius='xl' boxShadow='xl' spacing='3%'>
                        
            <Text align='center' fontWeight='semiBold' fontSize='xl'> {selectedNFT[0].metaData.name} </Text>
            
            <Image
              alt={selectedNFT[0].metaData.name}
              src={selectedNFT[0].metaData.image.replace("ipfs://","https://ipfs.io/ipfs/")}
              boxSize="200px"
              objectFit="cover"
              pos = {'center', 'center'}
              //width={150}
            />
            <HStack>
            <VStack>
            <HStack>
                        <Image                            
                        src={attack_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Attack`} </strong>: {selectedNFT[0].attack} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={health_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Health`} </strong>: {selectedNFT[0].health} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={critical_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Critical`} </strong>: {selectedNFT[0].critical} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={hitrate_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Hit Rate`} </strong>: {selectedNFT[0].hitrate} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={evasion_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Evasion`} </strong>: {selectedNFT[0].evasion} </Text>
                        </HStack>
            </VStack>                            
            </HStack>                                 
            
            </VStack>)}
                
            </VStack>
           
        </Flex>
        </HStack>
        <Flex bgGradient={lastwinner_bg_str} w='100vw' h='75h'>
        <VStack padding='2%'>
        <Text style={{ textAlign: "middle", fontSize: 35, fontWeight: "bold" }} >
        Number of Players Required for Next Battle : {4-data.currentplayerno}
        </Text>
        <Text style={{ textAlign: "middle", fontSize: 35, fontWeight: "bold" }} >
            {"Last Battle"}
        </Text>
        
        {data.lastwinner ? (
             <Text pl='50vw' style={{  fontSize: 35, fontWeight: "bold" }} >
             {"Winners"}
            </Text>
            ) : (
                <Text pr='50vw' style={{  fontSize: 35, fontWeight: "bold" }} >
            {"Winners"}
            </Text>
        )}
        <HStack spacing = '2vw'>            
        <SimpleGrid columns={2} spacingX="2vw" spacingY="20px" ml = '3vw'>
            {data.loading ? (
              <>
                                    
              </>
            ) : (
                lastBattle1NFTS.sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : -1).map((nft, index) => {
                
                  return (
                    <VStack align = 'center' key={index} w='18vw' h = '50vh' bg='whiteAlpha.600' py='2vh' px='1vw' borderRadius='xl' boxShadow='xl' spacing='3%'>
                        
                        <Text align='center' fontWeight='semiBold' fontSize='xl'> {nft.metaData.name} </Text>
                        
                        <Image
                          alt={nft.metaData.name}
                          src={nft.metaData.image.replace("ipfs://","https://ipfs.io/ipfs/")}
                          boxSize="200px"
                          objectFit="cover"
                          pos = {'center', 'center'}
                          //width={150}
                        />
                        <HStack>
                        <VStack>
                        <HStack>
                        <Image                            
                        src={attack_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Attack`} </strong>: {nft.attack} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={health_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Health`} </strong>: {nft.health} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={critical_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Critical`} </strong>: {nft.critical} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={hitrate_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Hit Rate`} </strong>: {nft.hitrate} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={evasion_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Evasion`} </strong>: {nft.evasion} </Text>
                        </HStack>
                        </VStack>                            
                        </HStack>                                      
                        
                      </VStack>

                  );
                }))
            }
        
        </SimpleGrid>
        {data.loading ? (
              <>
                                    
              </>
            ) : (<Image
                //alt={nft.metaData.name}
                src={pvp_sword}
                boxSize="200px"
                objectFit="cover"
                pos = {'center', 'center'}                
            />)}
        
        <SimpleGrid columns={2} spacingX="2vw" spacingY="20px" mr='2vw' >
            {data.loading ? (
              <>
                <Spacer />
                <Text style={{ textAlign: "center" }}>
                  loading...
                </Text>
                
              </>
            ) : (                    
                lastBattle2NFTS.sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : -1).map((nft, index) => {
                
                  return (
                    <VStack align = 'center' key={index} w='18vw ' h = '50vh' bg='whiteAlpha.600' py='2vh' px='1vw' borderRadius='xl' boxShadow='xl' spacing='3%'>
                        
                        <Text align='center' fontWeight='semiBold' fontSize='xl'> {nft.metaData.name} </Text>
                        
                        <Image
                          alt={nft.metaData.name}
                          src={nft.metaData.image.replace("ipfs://","https://ipfs.io/ipfs/")}
                          boxSize="200px"
                          objectFit="cover"
                          pos = {'center', 'center'}
                          //width={150}
                        />
                        <HStack>
                        <VStack>
                        <HStack>
                        <Image                            
                        src={attack_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Attack`} </strong>: {nft.attack} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={health_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Health`} </strong>: {nft.health} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={critical_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Critical`} </strong>: {nft.critical} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={hitrate_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Hit Rate`} </strong>: {nft.hitrate} </Text>
                        </HStack>
                        <HStack>
                        <Image                            
                        src={evasion_icon}
                        boxSize="20px"
                        objectFit="cover"
                        pos = {'center', 'center'}                
                        />
                        <Text style={{ textAlign: "center" }}>  <strong>{`Evasion`} </strong>: {nft.evasion} </Text>
                        </HStack>
                        </VStack>                            
                        </HStack>                                      
                        
                      </VStack>

                  );
                }))
            }
        
        </SimpleGrid>
        </HStack>
        </VStack>
        </Flex>
        
                        
        <Text paddingTop='1vh' paddingBottom='4vh' mt='2vh' style={{ textAlign: "center", fontSize: 35, fontWeight: "bold" }} >
            {"Your Avax Foxes"}
        </Text>
            
        <Button
             
            borderColor='green'
            borderRadius='5'
            boxShadow='lg'
            variant="outline"
            w = '25vw'
            h = '7vh'                
            fontSize = '25'
            onClick={() => {                                  
                HuntwithAll();                                        
            }}>
            Hunt with all Foxes
            <Image                            
                src={hunt_img}
                boxSize="40px"
                objectFit="cover"
                marginLeft='1vw'
                pos = {'center', 'center'}                
            />
            <Image                            
                src={hunt_img}
                boxSize="40px"
                objectFit="cover"
                marginLeft='1vw'
                pos = {'center', 'center'}                
            />    
        </Button> 
        
        {data.tokensOfUser.length==0 && !data.loading ? (
          <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }} >
            {"You don't have any Avax Foxes"}
          </Text>
        ):(null) }
        <SimpleGrid paddingTop='5vh' columns={3} spacingX="40px" spacingY="20px">
            {data.loading ? (
              <>
                <Spacer />
                <Text style={{ textAlign: "center" }}>
                  loading...
                </Text>
                
              </>
            ) : (
              NFTS.sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : -1).map((nft, index) => {
                
                  return (       

                      <VStack align = 'center' key={index} w='30vw ' bg='whiteAlpha.600' py='2vh' px='1vw' borderRadius='xl' boxShadow='xl' spacing='3%'>
                        
                        <Text align='center' fontWeight='semiBold' fontSize='xl'> {nft.metaData.name} </Text>
                        
                        <Image
                          alt={nft.metaData.name}
                          src={nft.metaData.image.replace("ipfs://","https://ipfs.io/ipfs/")}
                          boxSize="300px"
                          objectFit="cover"
                          pos = {'center', 'center'}
                          //width={150}
                        />
                        <HStack>
                        <VStack>                                   
                        <HStack>
                            <Image                            
                            src={attack_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            /> 
                            <Text pr = '2vw' style={{ textAlign: "center" }}>  <strong>{`Attack`} </strong>: {nft.attack} </Text>
                            <Button borderColor="red.500"                        
                                boxShadow='lg'
                                borderRadius='150'
                                variant="outline" 
                                onClick={() => { 
                                    if(nft.attackinc>0){
                                        let temp_state = [...NFTS];	                                        
                                        let temp_element = { ...temp_state[index] };                                        
                                        temp_element.attackinc = temp_element.attackinc-1;                                        
                                        temp_state[index] = temp_element;
                                        setNFTS( temp_state ); 
                                    }                                                                                    
                                }}>
                                - 
                            </Button>
                            <Text>
                            {nft.attackinc}
                            </Text>
                            <Button 
                                borderColor='green'
                                borderRadius='20'
                                boxShadow='lg'
                                variant="outline"
                                onClick={() => {                                    
                                    let temp_state = [...NFTS];	                                        
                                    let temp_element = { ...temp_state[index] };                                        
                                    temp_element.attackinc = temp_element.attackinc+1;                                        
                                    temp_state[index] = temp_element;
                                    setNFTS( temp_state );  
                                }}>
                                + 
                            </Button>
                        </HStack>
                        <HStack>
                            <Image                            
                            src={health_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            /> 
                            <Text  pr = '2vw' style={{ textAlign: "center" }}>  <strong>{`Health`} </strong>: {nft.health} </Text>
                            <Button borderColor="red.500"                        
                                boxShadow='lg'
                                borderRadius='150'
                                variant="outline" 
                                onClick={() => { 
                                    if(nft.healthinc>0){
                                        let temp_state = [...NFTS];	                                        
                                        let temp_element = { ...temp_state[index] };                                        
                                        temp_element.healthinc = temp_element.healthinc-1;                                        
                                        temp_state[index] = temp_element;
                                        setNFTS( temp_state ); 
                                    }                                                                                    
                                }}>
                                - 
                            </Button>
                            <Text>
                            {nft.healthinc}
                            </Text>
                            <Button 
                                borderColor='green'
                                borderRadius='20'
                                boxShadow='lg'
                                variant="outline"
                                onClick={() => {                                    
                                    let temp_state = [...NFTS];	                                        
                                    let temp_element = { ...temp_state[index] };                                        
                                    temp_element.healthinc = temp_element.healthinc+1;                                        
                                    temp_state[index] = temp_element;
                                    setNFTS( temp_state );  
                                }}>
                                + 
                            </Button>
                        </HStack>
                        <HStack>
                            <Image                            
                            src={critical_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            /> 
                            <Text  pr = '2vw' style={{ textAlign: "center" }}>  <strong>{`Critical`} </strong>: {nft.critical} </Text>
                            <Button borderColor="red.500"                        
                                boxShadow='lg'
                                borderRadius='150'
                                variant="outline" 
                                onClick={() => { 
                                    if(nft.criticalinc>0){
                                        let temp_state = [...NFTS];	                                        
                                        let temp_element = { ...temp_state[index] };                                        
                                        temp_element.criticalinc = temp_element.criticalinc-1;                                        
                                        temp_state[index] = temp_element;
                                        setNFTS( temp_state ); 
                                    }                                                                                    
                                }}>
                                - 
                            </Button>
                            <Text>
                            {nft.criticalinc}
                            </Text>
                            <Button 
                                borderColor='green'
                                borderRadius='20'
                                boxShadow='lg'
                                variant="outline"
                                onClick={() => {                                    
                                    let temp_state = [...NFTS];	                                        
                                    let temp_element = { ...temp_state[index] };                                        
                                    temp_element.criticalinc = temp_element.criticalinc+1;                                        
                                    temp_state[index] = temp_element;
                                    setNFTS( temp_state );  
                                }}>
                                + 
                            </Button>
                        </HStack>
                        <HStack>
                            <Image                            
                            src={hitrate_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            /> 
                            <Text pr = '2vw' style={{ textAlign: "center" }}>  <strong>{`Hit Rate`} </strong>: {nft.hitrate} </Text>
                            <Button borderColor="red.500"                        
                                boxShadow='lg'
                                borderRadius='150'
                                variant="outline" 
                                onClick={() => { 
                                    if(nft.hitrateinc>0){
                                        let temp_state = [...NFTS];	                                        
                                        let temp_element = { ...temp_state[index] };                                        
                                        temp_element.hitrateinc = temp_element.hitrateinc-1;                                        
                                        temp_state[index] = temp_element;
                                        setNFTS( temp_state ); 
                                    }                                                                                    
                                }}>
                                - 
                            </Button>
                            <Text>
                            {nft.hitrateinc}
                            </Text>
                            <Button 
                                borderColor='green'
                                borderRadius='20'
                                boxShadow='lg'
                                variant="outline"
                                onClick={() => {                                    
                                    let temp_state = [...NFTS];	                                        
                                    let temp_element = { ...temp_state[index] };                                        
                                    temp_element.hitrateinc = temp_element.hitrateinc+1;                                        
                                    temp_state[index] = temp_element;
                                    setNFTS( temp_state );  
                                }}>
                                + 
                            </Button>
                        </HStack>
                        <HStack>
                            <Image                            
                            src={evasion_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            /> 
                            <Text pr = '2vw' style={{ textAlign: "center" }}>  <strong>{`Evasion`} </strong>: {nft.evasion} </Text>
                            <Button borderColor="red.500"                        
                                boxShadow='lg'
                                borderRadius='150'                                                                         
                                variant="outline" 
                                onClick={() => { 
                                    if(nft.evasioninc>0){
                                        let temp_state = [...NFTS];	                                        
                                        let temp_element = { ...temp_state[index] };                                        
                                        temp_element.evasioninc = temp_element.evasioninc-1;                                        
                                        temp_state[index] = temp_element;
                                        setNFTS( temp_state ); 
                                    }                                                                                    
                                }}>
                                - 
                            </Button>
                            <Text>
                            {nft.evasioninc}
                            </Text>
                            <Button
                                
                                borderColor='green'
                                borderRadius='20'
                                boxShadow='lg'
                                variant="outline"
                                onClick={() => {                                    
                                    let temp_state = [...NFTS];	                                        
                                    let temp_element = { ...temp_state[index] };                                        
                                    temp_element.evasioninc = temp_element.evasioninc+1;                                        
                                    temp_state[index] = temp_element;
                                    setNFTS( temp_state );  
                                }}>
                                + 
                            </Button>
                        </HStack> 
                        </VStack>
                        <VStack>
                        <Button 
                                borderColor='green'
                                borderRadius='5'
                                boxShadow='lg'
                                variant="outline"
                                onClick={() => {                                    
                                    powerUp(nft)
                                }}>
                                Power Up 
                        </Button>
                        <Text > Upgrade Cost {getCost(nft)} </Text>
                        </VStack>
                        </HStack>
                        <HStack>
                        <Button 
                                borderColor='green'
                                borderRadius='5'
                                boxShadow='lg'
                                h='5vh'
                                w='15vw'
                                variant="outline"
                                fontSize='30'
                                onClick={() => {                                  
                                    if(nft.canjoinpvp){
                                        joinPVP(nft)
                                    }else{
                                        setFeedback("You cant fight now");
                                    }                                        
                                }}>
                                Fight
                                <Image                            
                                    src={fight_img}
                                    boxSize="40px"
                                    objectFit="cover"
                                    marginLeft='1vw'
                                    pos = {'center', 'center'}                
                                /> 
                        </Button>
                        
                        </HStack>
                        <HStack>
                        <Button 
                                borderColor='green'
                                borderRadius='5'
                                boxShadow='lg'
                                h='5vh'
                                w='15vw'
                                fontSize='30'
                                variant="outline"
                                onClick={() => {                                  
                                    if(nft.canjoinhunt){
                                        Hunt(nft)
                                    }else{
                                        setFeedback("You cant hunt with this fox now");
                                    }                                        
                                }}>
                                Hunt
                                <Image                            
                                    src={hunt_img}
                                    boxSize="40px"
                                    objectFit="cover"
                                    marginLeft='1vw'
                                    pos = {'center', 'center'}                
                                />  
                        </Button>
                        
                        </HStack>

                        <HStack>
                        <Text >Energy </Text>
                        <CircularProgress value={nft.energy/864} color='green.400' >
                            <CircularProgressLabel>{Math.min(nft.energy/864,100).toFixed(1)}%</CircularProgressLabel>
                        </CircularProgress>
                        </HStack>
                      </VStack>
                      
                    
                  );                

              })
            )}
          </SimpleGrid>
              
        </VStack> 
                          
    ):(null)}
            </div>
            :
            <div>
            
            {blockchain.account !== "" &&
                blockchain.smartContract !== null ?  (
          <VStack w='100vw' bgGradient={'linear(to-b, transparent, blackAlpha.600)'} pt='%3' pb='5%' spacing='0px'>
            
            <Flex w='100vw' bg = '#1d67ff' >
            <HStack mx='auto'>
                <Text   color='white' style={{ textAlign: "left", fontSize: 18, fontWeight: "bold" }} isTruncated w='35vw'>
                    {"Balance: "}{(data.balanceOf/(1000000000000000000)).toFixed(1)}{" SlyFox "}
                </Text>
                
                <Box  bg='gray.200' borderRadius='150'>
                    <HStack >
                        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }} isTruncated w='35vw'>
                            {(data.totalClaimable/(1000000000000000000)).toFixed(4)}{" SlyFox"}
                        </Text>
                        <Button
                            px='1.5vw'
                            py='7'
                            //bg='orange'
                            bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
                            borderRadius='150'
                            boxShadow='5'
                            fontSize= '18'
                            mx-auto
                            //variant="outline"
                            _hover={{ bg: "blackAlpha.500" }}
                            onClick={(e) => {
                                e.preventDefault();
                                claimTokens();
                            }}
                        >Claim</Button>
                    </HStack>
                </Box>
                
            </HStack>
            </Flex>
            <VStack spacing='0px'>
            <Flex w='100vw' bgGradient={'linear(to-b, #1d67ff, blue.200)'} >
            <VStack mx='auto' pb='5vh'>
            <Text mt = '3vh' color='white' style={{ textAlign: "middle", fontSize: 35, fontWeight: "bold" }} >
                {"Best Foxes"}
            </Text>
            <HStack spacing = '10vw' overflow='none'>            
            <SimpleGrid align='center' columns={1} spacingX="2vw" spacingY="20px" ml = '4vw'>
                {data.loading ? (
                  <>
                                        
                  </>
                ) : (
                    bestNFTS.sort((a, b) => parseInt(a.attack)+parseInt(a.health)+parseInt(a.critical)+parseInt(a.hitrate)+parseInt(a.evasion) < parseInt(b.attack)+parseInt(b.health)+parseInt(b.critical)+parseInt(b.hitrate)+parseInt(b.evasion) ? 1 : -1).map((nft, index) => {
                    
                      return (
                        <VStack paddingBottom='3vh' align = 'center' key={index}  py='2vh' bg='whiteAlpha.600' px='1vw' borderRadius='xl' boxShadow='xl' spacing='3%'>
                            
                            <Text align='center' fontWeight='semiBold' fontSize='xl'> {nft.metaData.name} </Text>
                            
                            <Image
                              alt={nft.metaData.name}
                              src={nft.metaData.image.replace("ipfs://","https://ipfs.io/ipfs/")}
                              boxSize="200px"
                              objectFit="cover"
                              pos = {'center', 'center'}
                              //width={150}
                            />
                            
                            <VStack>

                            <HStack>
                            <Image                            
                            src={attack_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Attack`} </strong>: {nft.attack} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={health_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Health`} </strong>: {nft.health} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={critical_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Critical`} </strong>: {nft.critical} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={hitrate_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Hit Rate`} </strong>: {nft.hitrate} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={evasion_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Evasion`} </strong>: {nft.evasion} </Text>
                            </HStack>
                            
                            </VStack>                            
                                                                 
                            
                          </VStack>

                      );
                    }))
                }
            
            </SimpleGrid>
                
            </HStack>
            </VStack>
            </Flex>
            <Flex  bgGradient={'linear(to-b, #1d67ff, blue.200)'} w='100vw' >
                <VStack mx='auto' pb='4vh'>
                    <Text color = 'white'  style={{ textAlign: "middle", fontSize: 35, fontWeight: "bold" }} >
                        {"Check an Avax Fox"}
                    </Text>
                    <HStack>
                    <Input
                        value={value}
                        onChange={handleChange}
                        placeholder="Avax Fox ID#"
                        size="sm"
                        bg = 'blue.200'
                        x
                    />
                    <Button
                            px='1vw'
                            py='7'
                            //bg='orange'
                            bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
                            borderRadius='20'
                            boxShadow='5'
                            fontSize= '18'
                            mx-auto                           
                            _hover={{ bg: "blackAlpha.500" }}
                            onClick={(e) => {
                                e.preventDefault();
                                fetchselectedNFT(); 
                            }}
                        >Check</Button>
                    </HStack>
                    {selectedNFT==null ? (
                  <>
                                        
                  </>
                ) : (<VStack align = 'center'   bg='whiteAlpha.600' py='2vh' px='1vw' borderRadius='xl' boxShadow='xl' spacing='3%'>
                            
                <Text align='center' fontWeight='semiBold' fontSize='xl'> {selectedNFT[0].metaData.name} </Text>
                
                <Image
                  alt={selectedNFT[0].metaData.name}
                  src={selectedNFT[0].metaData.image.replace("ipfs://","https://ipfs.io/ipfs/")}
                  boxSize="200px"
                  objectFit="cover"
                  pos = {'center', 'center'}
                  //width={150}
                />
                <HStack>
                <VStack>
                <HStack>
                            <Image                            
                            src={attack_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Attack`} </strong>: {selectedNFT[0].attack} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={health_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Health`} </strong>: {selectedNFT[0].health} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={critical_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Critical`} </strong>: {selectedNFT[0].critical} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={hitrate_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Hit Rate`} </strong>: {selectedNFT[0].hitrate} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={evasion_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Evasion`} </strong>: {selectedNFT[0].evasion} </Text>
                            </HStack>
                </VStack>                            
                </HStack>                                 
                
                </VStack>)}
                    
                </VStack>
               
            </Flex>
            </VStack>
            <Flex bgGradient={lastwinner_bg_str_m} w='100vw' >
            <VStack padding='2%'>
            <Text style={{ textAlign: "middle", fontSize: 35, fontWeight: "bold" }} >
            Number of Players Required for Next Battle : {4-data.currentplayerno}
            </Text>
            <Text style={{ textAlign: "middle", fontSize: 35, fontWeight: "bold" }} >
                {"Last Battle"}
            </Text>
            
            {!data.lastwinner ? (
                 <Text style={{  fontSize: 35, fontWeight: "bold" }} >
                 {"Winners"}
                </Text>
                ) : (
                    null
            )}
            <VStack spacing = '2vw'>            
            <SimpleGrid columns={2} spacingX="2vw" spacingY="20px" ml = '3vw'>
                {data.loading ? (
                  <>
                                        
                  </>
                ) : (
                    lastBattle1NFTS.sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : -1).map((nft, index) => {
                    
                      return (
                        <VStack align = 'center' key={index}  bg='whiteAlpha.600' py='2vh' px='1vw' borderRadius='xl' boxShadow='xl' spacing='3%'>
                            
                            <Text align='center' fontWeight='semiBold' fontSize='xl'> {nft.metaData.name} </Text>
                            
                            <Image
                              alt={nft.metaData.name}
                              src={nft.metaData.image.replace("ipfs://","https://ipfs.io/ipfs/")}
                              boxSize="200px"
                              objectFit="cover"
                              pos = {'center', 'center'}
                              //width={150}
                            />
                            <HStack>
                            <VStack>
                            <HStack>
                            <Image                            
                            src={attack_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Attack`} </strong>: {nft.attack} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={health_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Health`} </strong>: {nft.health} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={critical_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Critical`} </strong>: {nft.critical} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={hitrate_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Hit Rate`} </strong>: {nft.hitrate} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={evasion_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Evasion`} </strong>: {nft.evasion} </Text>
                            </HStack>
                            </VStack>                            
                            </HStack>                                      
                            
                          </VStack>

                      );
                    }))
                }
            
            </SimpleGrid>
            {data.loading ? (
                  <>
                                        
                  </>
                ) : (<Image
                    //alt={nft.metaData.name}
                    src={pvp_sword}
                    boxSize="200px"
                    objectFit="cover"
                    pos = {'center', 'center'}                
                />)}
            {data.lastwinner ? (
                 <Text  style={{  fontSize: 35, fontWeight: "bold" }} >
                 {"Winners"}
                </Text>
                ) : (
                    null
            )}
            <SimpleGrid columns={2} spacingX="2vw" spacingY="20px" mr='2vw' >
                {data.loading ? (
                  <>
                    <Spacer />
                    <Text style={{ textAlign: "center" }}>
                      loading...
                    </Text>
                    
                  </>
                ) : (                    
                    lastBattle2NFTS.sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : -1).map((nft, index) => {
                    
                      return (
                        <VStack align = 'center' key={index}  bg='whiteAlpha.600' py='2vh' px='1vw' borderRadius='xl' boxShadow='xl' spacing='3%'>
                            
                            <Text align='center' fontWeight='semiBold' fontSize='xl'> {nft.metaData.name} </Text>
                            
                            <Image
                              alt={nft.metaData.name}
                              src={nft.metaData.image.replace("ipfs://","https://ipfs.io/ipfs/")}
                              boxSize="200px"
                              objectFit="cover"
                              pos = {'center', 'center'}
                              //width={150}
                            />
                            <HStack>
                            <VStack>
                            <HStack>
                            <Image                            
                            src={attack_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Attack`} </strong>: {nft.attack} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={health_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Health`} </strong>: {nft.health} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={critical_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Critical`} </strong>: {nft.critical} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={hitrate_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Hit Rate`} </strong>: {nft.hitrate} </Text>
                            </HStack>
                            <HStack>
                            <Image                            
                            src={evasion_icon}
                            boxSize="20px"
                            objectFit="cover"
                            pos = {'center', 'center'}                
                            />
                            <Text style={{ textAlign: "center" }}>  <strong>{`Evasion`} </strong>: {nft.evasion} </Text>
                            </HStack>
                            </VStack>                            
                            </HStack>                                      
                            
                          </VStack>

                      );
                    }))
                }
            
            </SimpleGrid>
            </VStack>
            </VStack>
            </Flex>
            
                            
            <Text paddingTop='1vh' paddingBottom='4vh' mt='2vh' style={{ textAlign: "center", fontSize: 35, fontWeight: "bold" }} >
                {"Your Avax Foxes"}
            </Text>
                
            <Button
                 
                borderColor='green'
                borderRadius='5'
                boxShadow='lg'
                variant="outline"
                w = '85vw'
                h = '7vh'                
                fontSize = '25'
                onClick={() => {                                  
                    HuntwithAll();                                        
                }}>
                Hunt with all Foxes
                <Image                            
                    src={hunt_img}
                    boxSize="40px"
                    objectFit="cover"
                    marginLeft='1vw'
                    pos = {'center', 'center'}                
                />
                <Image                            
                    src={hunt_img}
                    boxSize="40px"
                    objectFit="cover"
                    marginLeft='1vw'
                    pos = {'center', 'center'}                
                />    
            </Button> 
            
            {data.tokensOfUser.length==0 && !data.loading ? (
              <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }} >
                {"You don't have any Avax Foxes"}
              </Text>
            ):(null) }
            <SimpleGrid paddingTop='5vh' columns={1} spacingX="40px" spacingY="20px">
                {data.loading ? (
                  <>
                    <Spacer />
                    <Text style={{ textAlign: "center" }}>
                      loading...
                    </Text>
                    
                  </>
                ) : (
                  NFTS.sort((a, b) => parseInt(a.id) > parseInt(b.id) ? 1 : -1).map((nft, index) => {
                    
                      return (       

                          <VStack align = 'center' key={index} w='75vw ' bg='whiteAlpha.600' py='2vh' px='1vw' borderRadius='xl' boxShadow='xl' spacing='3%'>
                            
                            <Text align='center' fontWeight='semiBold' fontSize='xl'> {nft.metaData.name} </Text>
                            
                            <Image
                              alt={nft.metaData.name}
                              src={nft.metaData.image.replace("ipfs://","https://ipfs.io/ipfs/")}
                              boxSize="300px"
                              objectFit="cover"
                              pos = {'center', 'center'}
                              //width={150}
                            />
                            <HStack>
                            <VStack>                                   
                            <HStack>
                                <Image                            
                                src={attack_icon}
                                boxSize="20px"
                                objectFit="cover"
                                pos = {'center', 'center'}                
                                /> 
                                <Text pr = '2vw' style={{ textAlign: "center" }}>  <strong>{`Attack`} </strong>: {nft.attack} </Text>
                                <Button borderColor="red.500"                        
                                    boxShadow='lg'
                                    borderRadius='150'
                                    variant="outline" 
                                    onClick={() => { 
                                        if(nft.attackinc>0){
                                            let temp_state = [...NFTS];	                                        
                                            let temp_element = { ...temp_state[index] };                                        
                                            temp_element.attackinc = temp_element.attackinc-1;                                        
                                            temp_state[index] = temp_element;
                                            setNFTS( temp_state ); 
                                        }                                                                                    
                                    }}>
                                    - 
                                </Button>
                                <Text>
                                {nft.attackinc}
                                </Text>
                                <Button 
                                    borderColor='green'
                                    borderRadius='20'
                                    boxShadow='lg'
                                    variant="outline"
                                    onClick={() => {                                    
                                        let temp_state = [...NFTS];	                                        
                                        let temp_element = { ...temp_state[index] };                                        
                                        temp_element.attackinc = temp_element.attackinc+1;                                        
                                        temp_state[index] = temp_element;
                                        setNFTS( temp_state );  
                                    }}>
                                    + 
                                </Button>
                            </HStack>
                            <HStack>
                                <Image                            
                                src={health_icon}
                                boxSize="20px"
                                objectFit="cover"
                                pos = {'center', 'center'}                
                                /> 
                                <Text  pr = '2vw' style={{ textAlign: "center" }}>  <strong>{`Health`} </strong>: {nft.health} </Text>
                                <Button borderColor="red.500"                        
                                    boxShadow='lg'
                                    borderRadius='150'
                                    variant="outline" 
                                    onClick={() => { 
                                        if(nft.healthinc>0){
                                            let temp_state = [...NFTS];	                                        
                                            let temp_element = { ...temp_state[index] };                                        
                                            temp_element.healthinc = temp_element.healthinc-1;                                        
                                            temp_state[index] = temp_element;
                                            setNFTS( temp_state ); 
                                        }                                                                                    
                                    }}>
                                    - 
                                </Button>
                                <Text>
                                {nft.healthinc}
                                </Text>
                                <Button 
                                    borderColor='green'
                                    borderRadius='20'
                                    boxShadow='lg'
                                    variant="outline"
                                    onClick={() => {                                    
                                        let temp_state = [...NFTS];	                                        
                                        let temp_element = { ...temp_state[index] };                                        
                                        temp_element.healthinc = temp_element.healthinc+1;                                        
                                        temp_state[index] = temp_element;
                                        setNFTS( temp_state );  
                                    }}>
                                    + 
                                </Button>
                            </HStack>
                            <HStack>
                                <Image                            
                                src={critical_icon}
                                boxSize="20px"
                                objectFit="cover"
                                pos = {'center', 'center'}                
                                /> 
                                <Text  pr = '2vw' style={{ textAlign: "center" }}>  <strong>{`Critical`} </strong>: {nft.critical} </Text>
                                <Button borderColor="red.500"                        
                                    boxShadow='lg'
                                    borderRadius='150'
                                    variant="outline" 
                                    onClick={() => { 
                                        if(nft.criticalinc>0){
                                            let temp_state = [...NFTS];	                                        
                                            let temp_element = { ...temp_state[index] };                                        
                                            temp_element.criticalinc = temp_element.criticalinc-1;                                        
                                            temp_state[index] = temp_element;
                                            setNFTS( temp_state ); 
                                        }                                                                                    
                                    }}>
                                    - 
                                </Button>
                                <Text>
                                {nft.criticalinc}
                                </Text>
                                <Button 
                                    borderColor='green'
                                    borderRadius='20'
                                    boxShadow='lg'
                                    variant="outline"
                                    onClick={() => {                                    
                                        let temp_state = [...NFTS];	                                        
                                        let temp_element = { ...temp_state[index] };                                        
                                        temp_element.criticalinc = temp_element.criticalinc+1;                                        
                                        temp_state[index] = temp_element;
                                        setNFTS( temp_state );  
                                    }}>
                                    + 
                                </Button>
                            </HStack>
                            <HStack>
                                <Image                            
                                src={hitrate_icon}
                                boxSize="20px"
                                objectFit="cover"
                                pos = {'center', 'center'}                
                                /> 
                                <Text pr = '2vw' style={{ textAlign: "center" }}>  <strong>{`Hit Rate`} </strong>: {nft.hitrate} </Text>
                                <Button borderColor="red.500"                        
                                    boxShadow='lg'
                                    borderRadius='150'
                                    variant="outline" 
                                    onClick={() => { 
                                        if(nft.hitrateinc>0){
                                            let temp_state = [...NFTS];	                                        
                                            let temp_element = { ...temp_state[index] };                                        
                                            temp_element.hitrateinc = temp_element.hitrateinc-1;                                        
                                            temp_state[index] = temp_element;
                                            setNFTS( temp_state ); 
                                        }                                                                                    
                                    }}>
                                    - 
                                </Button>
                                <Text>
                                {nft.hitrateinc}
                                </Text>
                                <Button 
                                    borderColor='green'
                                    borderRadius='20'
                                    boxShadow='lg'
                                    variant="outline"
                                    onClick={() => {                                    
                                        let temp_state = [...NFTS];	                                        
                                        let temp_element = { ...temp_state[index] };                                        
                                        temp_element.hitrateinc = temp_element.hitrateinc+1;                                        
                                        temp_state[index] = temp_element;
                                        setNFTS( temp_state );  
                                    }}>
                                    + 
                                </Button>
                            </HStack>
                            <HStack>
                                <Image                            
                                src={evasion_icon}
                                boxSize="20px"
                                objectFit="cover"
                                pos = {'center', 'center'}                
                                /> 
                                <Text pr = '2vw' style={{ textAlign: "center" }}>  <strong>{`Evasion`} </strong>: {nft.evasion} </Text>
                                <Button borderColor="red.500"                        
                                    boxShadow='lg'
                                    borderRadius='150'                                                                         
                                    variant="outline" 
                                    onClick={() => { 
                                        if(nft.evasioninc>0){
                                            let temp_state = [...NFTS];	                                        
                                            let temp_element = { ...temp_state[index] };                                        
                                            temp_element.evasioninc = temp_element.evasioninc-1;                                        
                                            temp_state[index] = temp_element;
                                            setNFTS( temp_state ); 
                                        }                                                                                    
                                    }}>
                                    - 
                                </Button>
                                <Text>
                                {nft.evasioninc}
                                </Text>
                                <Button
                                    
                                    borderColor='green'
                                    borderRadius='20'
                                    boxShadow='lg'
                                    variant="outline"
                                    onClick={() => {                                    
                                        let temp_state = [...NFTS];	                                        
                                        let temp_element = { ...temp_state[index] };                                        
                                        temp_element.evasioninc = temp_element.evasioninc+1;                                        
                                        temp_state[index] = temp_element;
                                        setNFTS( temp_state );  
                                    }}>
                                    + 
                                </Button>
                            </HStack> 
                            </VStack>
                            <VStack>
                            <Button 
                                    borderColor='green'
                                    borderRadius='5'
                                    boxShadow='lg'
                                    variant="outline"
                                    onClick={() => {                                    
                                        powerUp(nft)
                                    }}>
                                    Power Up 
                            </Button>
                            <Text > Upgrade Cost {getCost(nft)} </Text>
                            </VStack>
                            </HStack>
                            <HStack>
                            <Button 
                                    borderColor='green'
                                    borderRadius='5'
                                    boxShadow='lg'
                                    h='5vh'
                                    w='65vw'
                                    variant="outline"
                                    fontSize='30'
                                    onClick={() => {                                  
                                        if(nft.canjoinpvp){
                                            joinPVP(nft)
                                        }else{
                                            setFeedback("You cant fight now");
                                        }                                        
                                    }}>
                                    Fight
                                    <Image                            
                                        src={fight_img}
                                        boxSize="40px"
                                        objectFit="cover"
                                        marginLeft='1vw'
                                        pos = {'center', 'center'}                
                                    /> 
                            </Button>
                            
                            </HStack>
                            <HStack>
                            <Button 
                                    borderColor='green'
                                    borderRadius='5'
                                    boxShadow='lg'
                                    h='5vh'
                                    w='65vw'
                                    fontSize='30'
                                    variant="outline"
                                    onClick={() => {                                  
                                        if(nft.canjoinhunt){
                                            Hunt(nft)
                                        }else{
                                            setFeedback("You cant hunt with this fox now");
                                        }                                        
                                    }}>
                                    Hunt
                                    <Image                            
                                        src={hunt_img}
                                        boxSize="40px"
                                        objectFit="cover"
                                        marginLeft='1vw'
                                        pos = {'center', 'center'}                
                                    />  
                            </Button>
                            
                            </HStack>

                            <HStack>
                            <Text >Energy </Text>
                            <CircularProgress value={nft.energy/864} color='green.400' >
                                <CircularProgressLabel>{Math.min(nft.energy/864,100).toFixed(1)}%</CircularProgressLabel>
                            </CircularProgress>
                            </HStack>
                          </VStack>
                          
                        
                      );                

                  })
                )}
              </SimpleGrid>
                  
            </VStack>                   
        ):(null)}
            </div>
            }
        </div>
        
    )
}

export default Game
