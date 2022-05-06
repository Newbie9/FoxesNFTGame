import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import { Box, Container, Text, Spacer, VStack, HStack, Button, Center, Flex, Image, SimpleGrid , Accordion, AccordionItem,  AccordionButton,  AccordionPanel,  AccordionIcon, Divider  } from "@chakra-ui/react";
import Countdown from "react-countdown";
import { Input, InputGroup, InputRightElement  } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/react"
import { send } from 'emailjs-com';
import Navbar from "./Navbar";
import Footer from "./Footer"
import bgim from "../assets/images/background.png"
import bgMobile from "../assets/images/backgroundMobile.png"
import nftGif from "../assets/images/nftGif.gif"
import nftGif2 from "../assets/images/nftGif2.gif"
import rarity from "../assets/images/rarity.png"
import confet from "../assets/images/confet.png"
import leaderboardbackground from "../assets/images/leaderboardBackground.png" 
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


function Home() {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [feedback, setFeedback] = useState("");
    const [claimingNft, setClaimingNft] = useState(false);
    const [amount, setAmount] = useState(1);
    const [NFTS, setNFTS] = useState([]);
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(false);
    const [viewNFTs, setviewNFTs] = useState(false);
    const [LoadingMostMinters, setLoadingMostMinters] = useState(false);
    const [LoadingNFTS, setLoadingNFTS] = useState(true);
    const [mintingOpen, setmintingOpen] = useState(false);

    const toast = useToast()
    var triedConnect = false;


    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false)
    const [mostMinters, setmostMinters] = useState([]); 

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
    var baseURI = "";

    const claimNFTs = (_amount) => {
        if(!mintingOpen){
        return
        }
        if (_amount <= 0) {
        return;
        }
        setFeedback("Minting your Avax Fox...");
        setClaimingNft(true);
        blockchain.smartContract.methods
        .mint(_amount)
        .send({
            //gasLimit: "985000",
            to: blockchain.smartContract.adress, // Smart Contract Adress
            from: blockchain.account,
            value: blockchain.web3.utils.toWei((1 * _amount).toString(), "ether"),
        })
        .once("error", (err) => {
            console.log(err);
            setFeedback("Sorry, something went wrong please try again later.");
            setClaimingNft(false);
        })
        .then((receipt) => {
            setFeedback(
            "You now own a AvaxFox."
            );
            setClaimingNft(false);
            dispatch(fetchData(blockchain.account));
        });
    };

    
    const fetchMetatDataForNFTS = () => {    
        if (blockchain.account !== "" && blockchain.smartContract !== null && LoadingNFTS) {
        setNFTS([]);
        //blockchain.smartContract.methods.mintsOfOwner(blockchain.account).call().then(console.log)
        //blockchain.smartContract.methods.getMostMinters().call().then(console.log)

        for(let i=0;i<data.tokensOfUser.length;i++){ 
            let nft = data.tokensOfUser[i];  
            blockchain.smartContract.methods.tokenURI(nft).call()   
            .then((uri) => fetch(uri.replace("ipfs://","https://ipfs.io/ipfs/")))             
            .then((response) => response.json())        
            .then((metaData) => {
                setNFTS((prevState) => [
                ...prevState,            
                { id: nft, metaData: metaData },
                ]);         
            }).then(function (){
                if (i == data.tokensOfUser.length - 1){
                setLoadingNFTS(false)
                setNFTS((prevState) =>
                prevState.sort((a, b) => a.id < b.id ? 1 : -1)
                )
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
        }
        
    };
    


    const mostMintersData = () => {    
        
        if (blockchain.account !== "" && blockchain.smartContract !== null && !LoadingMostMinters ) {
        setLoadingMostMinters(true)
        setmostMinters([]);
        let loadedcounter=0;
        //blockchain.smartContract.methods.mintsOfOwner(blockchain.account).call().then(console.log)
        blockchain.smartContract.methods.getMostMinters().call()
        .then( function(adresses){    
            for(let i=0;i<10;i++){
            blockchain.smartContract.methods.mintingPointsOfOwner(adresses[i]).call()
            .then((count) => {
                loadedcounter+=1;            
                setmostMinters((prevState) => [
                ...prevState,            
                { adress: adresses[i], mintNumber: count },
                ]);}
                ).then(function(){       
                if(loadedcounter == 9){                
                    setLoadingMostMinters(false)
                }              
                }
                ).catch((err) => {
                console.log(err);
                });
            }
        })      
        }

    };

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
        // Render a complete state
        setmintingOpen(true)
        return "Minting is open!!";
        } else {
        // Render a countdown
        return (
            <span>
            {hours} Hours {minutes} Minutes {seconds} Seconds
            </span>
        );
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
        mostMintersData();
        //console.log(data.totalClaimable)
        //console.log(data.tokensOfUser)    
        }
    }, [data]);

    const onSubmit = (e) => {
        e.preventDefault();
        // Check the input length
        if(toSend.message.length == 42){
        send(
            'service_dqosgoe',
            'template_j4vt0tg',
            toSend,
            'user_ceMd9PTtIQhQoxDrmHokL'
        )
            .then((response) => {
            setToSend({ message: "" });
            toast({
                description: "You joined the giveaway successfully.",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
            })
            .catch((err) => {
            setToSend({ message: "" });
            toast({
                description: "You joined the giveaway successfully.",
                status: "success",
                duration: 9000,
                isClosable: true,
            })
            });
        }
        else{
        console.log('FAILED, This is not a valid wallet address');
        toast({
            description: "This is not a valid wallet address",
            status: "warning",
            duration: 9000,
            isClosable: true,
        })
        }
    };
    
    
    const [toSend, setToSend] = useState({
        message: '',
    });
    const handleChange = (e) => {
        setToSend({ ...toSend, [e.target.name]: e.target.value });
    };


  return (
    <div>
      {button ? 
      <div>
      <VStack w='102vw' minH='80vh' alignItems='left' theme="theme" >
      
        <VStack  w='102vw' h='80vh' backgroundImage={bgMobile} backgroundSize={'102vw 80vh'} backgroundPosition={'center center'}  spacing='auto'>
          <Box mt='20vh' borderRadius='100' align='center'  w='85vw' h='10vw'  > 
            <Text
              fontSize='4xl'
              fontWeight='bold'
              color='orange'                                         
            >
              Avax Foxes, an NFT Collection on Avalanche with Reflection!
            </Text>

            {!mintingOpen? (
                <Text
                fontSize='4xl'
                fontWeight='semiBold'
                color='orange'
              >
                <Countdown date={new Date(Date.UTC(2021, 10, 12, 17, 0, 0))} renderer={renderer} />
                </Text>
            ):(
              <Button px='35' py='21' borderRadius='200' boxShadow='5' borderRadius='200' bg='white'  mx-auto fontSize='3xl' fontWeight='semiBold' color='orange' > 
                        
                <ScrollTo>
                {({ scroll }) => (
                  <a onClick={() => scroll({ x: 20, y: 1450, smooth: true })}>Minting is live!</a>
                )}
                </ScrollTo>
                                           
              </Button>
            )}         
          </Box>
           <Box w='100%' h='15vh' bgGradient={'linear(to-b, transparent, gray.100)'} >
          </Box> 
        </VStack>    
        <VStack bg='gray.200'  pl='10vw' pr='10vw' pt='10vh'>
          <VStack borderRadius='150'>
            <Text mt='30' mx='auto' fontWeight="semibold" fontSize='2xl'>
              What is Avax Fox
            </Text>
            <Text mx='auto' fontSize='xl'>
              Avax Foxes is a collection of randomly generated 1000 NFTs on the Avalanche blockchain with over 200 unique traits.
              Minters of AvaxFoxes will receive 10% of minting fees.
              On our marketplace, holders will receive 5% of every sale and original minters of AvaxFoxes earn 2% royalties each time their AvaxFoxes is resold!
              Also there are some Treasure Hunter foxes around them to help you find the treasure you've been looking for. 
            </Text>  
          </VStack>
          <Image w='95vw' src={nftGif2} />
        </VStack>
        <VStack pt='30' overflow='false' align='left'>
          <Box
            w='80vw'                          
            pt='30'
            pb='30'
            mx='auto'
            borderRadius='150'
          >
            {Number(data.totalSupply) == 9600 ? (
              <>
                <Text style={{ textAlign: "center" }} fontSize='4xl'>
                  The sale has ended
                </Text>               
              </>
            ) : (
              <>
                <Text fontSize='xl' style={{ textAlign: "center" }}>
                  1 Avax Fox costs 1 Avax.
                </Text>
                
                <Text style={{ textAlign: "center" }}>
                  {feedback}
                </Text>
                
                  <VStack spacing='10'>
                    <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "bold" }} >
                      {data.totalSupply}/1000 {"Avax Foxes Minted"}
                    </Text>
                    <HStack mt='5vh' spacing='10'>
                      <Button borderColor="red.500"                        
                        boxShadow='lg'
                        borderRadius='150'
                        variant="outline" 
                        onClick={() => {
                          if (amount>1){
                            setAmount(amount - 1) 
                          }                            
                                              
                        }}>
                        - 
                      </Button>
                      <Text>
                        {amount}
                      </Text>
                      <Button 
                        borderColor='green'
                        borderRadius='20'
                        boxShadow='lg'
                        variant="outline"
                        onClick={() => {
                          if (amount<20){
                          setAmount(amount + 1)
                          }
                        }}>
                        + 
                      </Button>
                    </HStack>
                    <HStack>
                      <Button
                        disabled={claimingNft ? 1 : 0}
                        px='35'
                        py='7'
                        borderRadius='200'
                        bg='teal.400'
                        boxShadow='5'
                        mx-auto   
                        onClick={(e) => {
                          e.preventDefault();
                          if(blockchain.account!==null)
                          {
                            claimNFTs(amount);
                          }else{
                            dispatch(connect())
                          }
                          
                          //getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT"}
                      </Button>
                      {!viewNFTs  && blockchain.account!==null ? (
                        <Button                        
                          px='35'
                          py='7'
                          borderRadius='200'
                          boxShadow='5'
                          borderRadius='200'
                          bg='teal.400'
                          mx-auto   
                          onClick={(e) => {
                            e.preventDefault();
                            setviewNFTs(true)                            
                          }}
                          
                        > 
                        Load My Foxes                         
                        </Button>

                      ):(null)}
                      
                    </HStack>
                    <Box>
                      <Text fontSize='md' mt='2vh'>
                      Minters of AvaxFoxes will receive 10% of minting fees.
                      </Text>                      
                      <Text fontSize='md' mt='2vh'>      
                      So mint more earn more! 
                      
                      </Text>
                      
                    </Box>
                  </VStack>                  
                
              </>
            )}
          </Box>
          <Box w='102vw' h='65vh'>

          {blockchain.account == "" ||
                blockchain.smartContract == null ? 
            <Box w='80vw' mx='auto' mt='10vh' bg="transparent" align='center'>
              <Text fontSize='lg'>
                Connect your wallet to see leaderboard
              </Text>
              <SkeletonText bg='transparent' mt="4" noOfLines={10} spacing="4" startColor="black" endColor="orange.500"/>
            </Box>
            
            :
          <Table mt='10vh' variant="striped" colorScheme='orange' size='sm'>
            <TableCaption fontSize='md' fontWeight='bold' placement='top'>Top Minters</TableCaption>
            <Thead>
              <Tr>
                <Th>Ranking</Th>
                <Th> <Text isTruncated w='40vw'>Address</Text></Th>
                <Th>Points</Th>
              </Tr>
            </Thead>
            
              <Tbody>
                {mostMinters.sort((a, b) => parseInt(a.mintNumber) < parseInt(b.mintNumber) ? 1 : -1).map((user, index) => {
                  return ( 
                    <Tr>
                      <Td>{index + 1}</Td>
                      <Td><Text isTruncated w='40vw'>{user.adress}</Text> </Td>
                      <Td>{user.mintNumber}</Td>
                    </Tr>
                  );
                })
              }
              </Tbody>
            
          </Table>
          }
          </Box>
        </VStack>
        {blockchain.account !== "" &&
                blockchain.smartContract !== null && viewNFTs ?  (
          <VStack pt='30' bgGradient={'linear(to-b, transparent, blackAlpha.600)'} pb='10%' px='2vw' spacing='10%'>
            
            <Text style={{ textAlign: "center", fontSize: 35, fontWeight: "bold" }} >
                {"Your Avax Foxes"}
            </Text>
            {data.tokensOfUser.length==0 ?(
              <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }} >
                {"You don't have any Avax Foxes"}
              </Text>
            ):(null) }
            <SimpleGrid columns={1} spacingX="40px" spacingY="20px">
                {data.loading ? (
                  <>
                    <Spacer />
                    <Text style={{ textAlign: "center" }}>
                      loading...
                    </Text>
                  </>
                ) : (
                  NFTS.map((nft, index) => {
                    
                      return (       

                        <VStack align = 'center' key={index} w='80vw ' bg='whiteAlpha.600' py='2vh' borderRadius='xl' boxShadow='xl' spacing='3%'>
                          <Text align='center' fontWeight='semiBold' fontSize='xl'> {nft.metaData.name} </Text>
                          <Image
                            alt={nft.metaData.name}
                            src={nft.metaData.image.replace("ipfs://","https://ipfs.io/ipfs/")}
                            boxSize="300px"
                            objectFit="cover"
                            pos = {'center', 'center'}
                            //width={150}
                          />        
                          <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[0].trait_type} </strong>: {nft.metaData.attributes[0].value} </Text>              
                          <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[1].trait_type} </strong>: {nft.metaData.attributes[1].value} </Text>              
                          <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[2].trait_type} </strong>: {nft.metaData.attributes[2].value} </Text>              
                          <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[3].trait_type} </strong>: {nft.metaData.attributes[3].value} </Text>              
                          <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[4].trait_type} </strong>: {nft.metaData.attributes[4].value} </Text>              
                          <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[5].trait_type} </strong>: {nft.metaData.attributes[5].value} </Text>              
                          <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[6].trait_type} </strong>: {nft.metaData.attributes[6].value} </Text>                 

                        </VStack>
                          
                        
                      );                

                  })
                )}
              </SimpleGrid>    
            </VStack>                   
        ):(null)}
        

        <VStack py='5vh' bg='gray.200' w='102vw' spacing='50'>
              <VStack w='80vw' align= 'left' spacing='auto'>
                <Text fontSize='xl' mx='auto'>
                  Trait Rarity
                </Text>
                <Text fontSize='md'>
                  All of our foxes are unique and they are not equal. There is a rarity system between them. Some foxes have traits that are more rare than others.
                </Text>
                <Text  fontSize='md'>
                  You can understand how rare your Avax Foxes are by their background color. 
                </Text>
                <Text fontSize='md'>
                  There are 200+ total traits for Avax Foxes and these have been categorized into a tier based system. Traits are ranked from ‘common’ all the way through to ‘artifact’ and each rank has a corresponding % chance of being minted.
                </Text>
              </VStack>
              <Image w='80vw' src={rarity} />
        </VStack>

        

        <Flex bg='white'>
          <VStack  w = '100%'  py='5vw'>
            <Text pb='4vh' style={{ textAlign: "center", fontSize: 30, fontWeight: "bold" }} >
                  {"FAQ"}
            </Text>
            <Accordion  w='90vw' >
              <AccordionItem bg = "gray.200" borderRadius = 'xl'>
                <h2>
                  <AccordionButton>
                    <Box flex="1" fontSize='lg' textAlign="center">
                      What are Treasure Hunters?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel fontSize='md' pb={4} textAlign="center">
                  100 of the Avax Foxes will have the trait Treasure Hunter. People who mint them will receive 5 Avax.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem borderRadius = 'xl'>
                <h2>
                  <AccordionButton>
                    <Box flex="1" fontSize='lg' textAlign="center">
                      What is the top minter leaderboard?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel fontSize='md' pb={4} textAlign="center">
                  At the end of the minting phase, the account which has the highest minting points will receive the prize of 100 Avax.
                  Treasure Hunters are equal to 10 minting points each and rest of the collection is equal to 1 minting point.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem bg = "gray.200" borderRadius = 'xl'>
                <h2>
                  <AccordionButton>
                    <Box flex="1" fontSize='lg' textAlign="center">
                      What is reflection?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel fontSize='md' pb={4} textAlign="center">
                  For every minted Avax Fox %10 of minting price will be shared among minters.
                   Also %5 of every sale in FoxMarket will be distributed among AvaxFoxes holders and original minters of AvaxFoxes earn 2% royalties each time their AvaxFoxes is resold!
                </AccordionPanel>
              </AccordionItem>
              
              <AccordionItem bg = "white" borderRadius = 'xl'>
                <h2>
                  <AccordionButton>
                    <Box flex="1" fontSize='lg' textAlign="center">
                      Is there a limit on minting?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel fontSize='md' pb={4} textAlign="center">
                  We will limit people to mint 20 Avax Fox per transaction. However, you can visit the minting section as many times as you like.                  
                </AccordionPanel>
              </AccordionItem>    
              <AccordionItem bg = "gray.200" borderRadius = 'xl'>
                <h2>
                  <AccordionButton>
                    <Box flex="1" fontSize='lg' textAlign="center">
                      Can I sell my Avax Fox?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel fontSize='md' pb={4} textAlign="center">
                  Ofcourse all Avax Foxes are stored with ERC-721 contract. You can sell them in any marketplace that supports Avalanche and also our FoxMarket.                  
                </AccordionPanel>
              </AccordionItem>      
            </Accordion>
          </VStack>
        </Flex>
      </VStack>
      
      </div>
      
      
      : 
      
      
      <div>
      <VStack w='100vw' minH='80vh' alignItems='left' theme="theme" >
      
        <VStack  w='100vw' h='220vh' backgroundImage={bgim} backgroundSize={'100vw 220vh'} backgroundPosition={'center center'}  spacing='auto'>
          <Box mt='25vh' borderRadius='100' opacity='1' align='center'  w='55vw' h='10vw'  >  
            
            <Text
              fontSize='7xl'
              fontWeight='bold'
              color='orange'                                         
            >
              Avax Foxes, an NFT Collection on Avalanche with Reflection!
            </Text>

            
            {!mintingOpen? (
                <Text
                fontSize='4xl'
                fontWeight='semiBold'
                color='orange'
              >
                <Countdown date={new Date(Date.UTC(2021, 10, 12, 12, 0, 0))} renderer={renderer} />
                </Text>
            ):(
              <Button px='35' py='51' borderRadius='200' boxShadow='5' borderRadius='200' bg='white'  mx-auto fontSize='7xl' fontWeight='semiBold' color='orange' > 
                        
                <ScrollTo>
                {({ scroll }) => (
                  <a onClick={() => scroll({ x: 20, y: 2750, smooth: true })}>Minting is live!</a>
                )}
                </ScrollTo>
                                           
              </Button>
            )}               
            
              
            
          </Box>
           <Box w='100%' h='15vh' bgGradient={'linear(to-b, transparent, gray.100)'} >
          </Box> 
        </VStack>    
        <Flex bg='gray.200'  pl='15vw' pr='20vw' pt='10vh'>
          <VStack pb='10vh' w='40vw' p='10' borderRadius='150'>
            <Text mt='30' mx='auto' fontWeight="semibold" fontSize='2xl'>
              What is Avax Fox
            </Text>
            <Text mx='auto' fontSize='xl'>
              Avax Foxes is a collection of randomly generated 1000 NFTs on the Avalanche blockchain with over 200 unique traits.
              Minters of AvaxFoxes will receive 10% of minting fees.
              On our marketplace, holders will receive 5% of every sale and original minters of AvaxFoxes earn 2% royalties each time their AvaxFoxes is resold!
              Also there are some Treasure Hunter foxes around them to help you find the treasure you've been looking for. 
            </Text>  
          </VStack>
          <Spacer/>
          <Image h='50vh' src={nftGif2} />
        </Flex>
        <HStack pt='30' px='5vw' p='3vw' overflow='false' backgroundImage={leaderboardbackground} backgroundSize={'100vw 80vh'} backgroundPosition={'center center'}>
          <Box
            ml='10vw'
            w='40vw'            
            px='24'          
            pt='30'
            pb='30'
            borderRadius='150'
          >
            {Number(data.totalSupply) == 9600 ? (
              <>
                <Text style={{ textAlign: "center" }} fontSize='4xl'>
                  The sale has ended
                </Text>               
              </>
            ) : (
              <>
                <Text fontSize='xl' style={{ textAlign: "center" }}>
                  1 Avax Fox costs 1 Avax.
                </Text>
                <Spacer />
                <Text style={{ textAlign: "center" }}>
                  {feedback}
                </Text>
                
                  <VStack spacing='10'>
                    <Text style={{ textAlign: "center", fontSize: 45, fontWeight: "bold" }} >
                      {data.totalSupply}/1000 {"Avax Foxes Minted"}
                    </Text>
                    <HStack mt='5vh' spacing='10'>
                      <Button borderColor="red.500"                        
                        boxShadow='lg'
                        borderRadius='150'
                        variant="outline" 
                        onClick={() => {
                          if (amount>1){
                            setAmount(amount - 1) 
                          }                            
                                              
                        }}>
                        - 
                      </Button>
                      <Text>
                        {amount}
                      </Text>
                      <Button 
                        borderColor='green'
                        borderRadius='20'
                        boxShadow='lg'
                        variant="outline"
                        onClick={() => {
                          if (amount<20){
                          setAmount(amount + 1)
                          }
                        }}>
                        + 
                      </Button>
                    </HStack>
                    <HStack>
                      <Button
                        disabled={claimingNft ? 1 : 0}
                        px='35'
                        py='7'
                        borderRadius='200'
                        bg='teal.400'
                        boxShadow='5'
                        mx-auto   
                        onClick={(e) => {
                          e.preventDefault();
                          if(blockchain.account!==null)
                          {
                            claimNFTs(amount);
                          }else{
                            dispatch(connect())
                          }
                          
                          //getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT"}
                      </Button>
                      {!viewNFTs  && blockchain.account!==null ? (
                        <Button                        
                          px='35'
                          py='7'
                          borderRadius='200'
                          boxShadow='5'
                          borderRadius='200'
                          bg='teal.400'
                          mx-auto   
                          onClick={(e) => {
                            e.preventDefault();
                            setviewNFTs(true)                            
                          }}
                          
                        > 
                        Load My Foxes                         
                        </Button>

                      ):(null)}
                      
                    </HStack>
                    <Box>
                      <Text fontSize='lg' mt='2vh'>
                      Minters of AvaxFoxes will receive 10% of minting fees.
                      </Text>                      
                      <Text fontSize='lg' mt='2vh'>      
                      So mint more earn more! 
                      
                      </Text>
                      
                    </Box>
                  </VStack>                  
                
              </>
            )}
          </Box>
          <Box w='40vw' h='65vh'>

          {blockchain.account == "" ||
                blockchain.smartContract == null ?
            <Box padding="6" mt='10vh' h='50vh' bg="transparent" align='center'>
              <Text fontSize='lg'>
                Connect your wallet to see leaderboard
              </Text>
              <SkeletonText bg='transparent' mt="4" noOfLines={15} spacing="4" startColor="black" endColor="orange.500"/>
            </Box>
            
            :
          <Table mt='8vh' variant="striped" colorScheme='orange' size='sm'>
            <TableCaption fontSize='xl' fontWeight='bold' placement='top'>Top Minters</TableCaption>
            <Thead>
              <Tr>
                <Th>Ranking</Th>
                <Th>Address</Th>
                <Th>Minting Points</Th>
              </Tr>
            </Thead>
            
              <Tbody>
                {mostMinters.sort((a, b) => parseInt(a.mintNumber) < parseInt(b.mintNumber) ? 1 : -1).map((user, index) => {
                  return ( 
                    <Tr>
                      <Td>{index + 1}</Td>
                      <Td>{user.adress}</Td>
                      <Td>{user.mintNumber}</Td>
                    </Tr>
                  );
                })
              }
              </Tbody>
            
          </Table>
          }
          </Box>
        </HStack>
        {blockchain.account !== "" &&
                blockchain.smartContract !== null && viewNFTs ?  (
          <VStack pt='30' bgGradient={'linear(to-b, transparent, blackAlpha.600)'} pb='5%' px='3vw' spacing='3%'>
            
            <Text style={{ textAlign: "center", fontSize: 35, fontWeight: "bold" }} >
                {"Your Avax Foxes"}
            </Text>
            {data.tokensOfUser.length==0 ?(
              <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }} >
                {"You don't have any Avax Foxes"}
              </Text>
            ):(null) }
            <SimpleGrid columns={4} spacingX="40px" spacingY="20px">
                {data.loading ? (
                  <>
                    <Spacer />
                    <Text style={{ textAlign: "center" }}>
                      loading...
                    </Text>
                  </>
                ) : (
                  NFTS.map((nft, index) => {
                    
                      return (       

                          <VStack align = 'center' key={index} w='20vw ' bg='whiteAlpha.600' py='2vh' px='1vw' borderRadius='xl' boxShadow='xl' spacing='3%'>
                            <Text align='center' fontWeight='semiBold' fontSize='xl'> {nft.metaData.name} </Text>
                            <Image
                              alt={nft.metaData.name}
                              src={nft.metaData.image.replace("ipfs://","https://ipfs.io/ipfs/")}
                              boxSize="300px"
                              objectFit="cover"
                              pos = {'center', 'center'}
                              //width={150}
                            />        
                            <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[0].trait_type} </strong>: {nft.metaData.attributes[0].value} </Text>              
                            <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[1].trait_type} </strong>: {nft.metaData.attributes[1].value} </Text>              
                            <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[2].trait_type} </strong>: {nft.metaData.attributes[2].value} </Text>              
                            <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[3].trait_type} </strong>: {nft.metaData.attributes[3].value} </Text>              
                            <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[4].trait_type} </strong>: {nft.metaData.attributes[4].value} </Text>              
                            <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[5].trait_type} </strong>: {nft.metaData.attributes[5].value} </Text>              
                            <Text style={{ textAlign: "center" }}>  <strong>{nft.metaData.attributes[6].trait_type} </strong>: {nft.metaData.attributes[6].value} </Text>              

                          </VStack>
                        
                      );                

                  })
                )}
              </SimpleGrid>    
            </VStack>                   
        ):(null)}
        

        <HStack pl='13vw' pr='10vw' py='5vh' bg='gray.200' w='100vw' h='60vh' spacing='auto'>
              <VStack h='40vh' w='35vw' align= 'left' spacing='auto'>
                <Text fontSize='4xl' mx='auto'>
                  Trait Rarity
                </Text>
                <Text fontSize='lg'>
                  All of our foxes are unique and they are not equal. There is a rarity system between them. Some foxes have traits that are more rare than others.
                </Text>
                <Text  fontSize='lg'>
                  You can understand how rare your Avax Foxes are by their background color. 
                </Text>
                <Text fontSize='lg'>
                  There are 200+ total traits for Avax Foxes and these have been categorized into a tier based system. Traits are ranked from ‘common’ all the way through to ‘artifact’ and each rank has a corresponding % chance of being minted.
                </Text>
              </VStack>
              <Image h='50vh' src={rarity} />
        </HStack>

        

        <Flex bg='white'>
          <VStack  w = '100%' px='3vw' py='5vw'>
            <Text pb='4vh' style={{ textAlign: "center", fontSize: 45, fontWeight: "bold" }} >
                  {"FAQ"}
            </Text>
            <Accordion  w='60vw' >
              <AccordionItem bg = "gray.200" borderRadius = 'xl'>
                <h2>
                  <AccordionButton>
                    <Box flex="1" fontSize='xl' textAlign="center">
                      What are Treasure Hunters?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel fontSize='md' pb={4} textAlign="center">
                  100 of the Avax Foxes will have the trait Treasure Hunter. People who mint them will receive 5 Avax.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem borderRadius = 'xl'>
                <h2>
                  <AccordionButton>
                    <Box flex="1" fontSize='xl' textAlign="center">
                      What is the top minter leaderboard?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel fontSize='md' pb={4} textAlign="center">
                  At the end of the minting phase, the account which has the highest minting points will receive the prize of 100 Avax.
                  Treasure Hunters are equal to 10 minting points each and rest of the collection is equal to just 1 minting point.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem bg = "gray.200" borderRadius = 'xl'>
                <h2>
                  <AccordionButton>
                    <Box flex="1" fontSize='xl' textAlign="center">
                      What is reflection?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel fontSize='md' pb={4} textAlign="center">
                  For every minted Avax Fox %10 of minting price will be shared among minters.
                   Also %5 of every sale in FoxMarket will be distributed among AvaxFoxes holders and original minters of AvaxFoxes earn 2% royalties each time their AvaxFoxes is resold!
                </AccordionPanel>
              </AccordionItem>
              
              <AccordionItem bg = "white" borderRadius = 'xl'>
                <h2>
                  <AccordionButton>
                    <Box flex="1" fontSize='xl' textAlign="center">
                      Is there a limit on minting?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel fontSize='md' pb={4} textAlign="center">
                  We will limit people to mint 20 Avax Fox per transaction. However, you can visit the minting section as many times as you like.                  
                </AccordionPanel>
              </AccordionItem>    
              <AccordionItem bg = "gray.200" borderRadius = 'xl'>
                <h2>
                  <AccordionButton>
                    <Box flex="1" fontSize='xl' textAlign="center">
                      Can I sell my Avax Fox?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel fontSize='md' pb={4} textAlign="center">
                  Ofcourse all Avax Foxes are stored with ERC-721 contract. You can sell them in any marketplace that supports Avalanche and also our FoxMarket.                  
                </AccordionPanel>
              </AccordionItem>      
            </Accordion>
          </VStack>
        </Flex>
      </VStack>
      
      </div>
      }
    </div>
    );
}

export default Home;
