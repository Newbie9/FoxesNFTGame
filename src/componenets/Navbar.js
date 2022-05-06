import React, {useState, useEffect}  from 'react'
import {Box, HStack, Image, Button, Spacer, Text} from '@chakra-ui/react'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuIcon,
    MenuCommand,
    MenuDivider,
    IconButton
  } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/react"
import Logo from "../assets/images/website_logo.png"
import {FaTwitter, FaTelegramPlane, FaDiscord } from "react-icons/fa"
import {GiHamburgerMenu} from "react-icons/gi"
import {MdAccountBalanceWallet, MdConstruction} from "react-icons/md"
import {IoIosConstruct} from "react-icons/io"
import {GrGamepad} from "react-icons/gr"
import { Icon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton
  } from "@chakra-ui/react"




function Navbar() {
    const data = useSelector((state) => state.data);
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(false);
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const toast = useToast()
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false)

    const claimRewards = () => {    
        if (data.reward <= 0) {
          console.log("no rewards to claim")
          return;
        }
        console.log("claiming rewards")
        blockchain.smartContract.methods.claimRewards()
            .send({from:blockchain.account })      
          .then((receipt) => {
            console.log(receipt);        
            dispatch(fetchData(blockchain.account));
          });
      };

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

    useEffect(() => {
        if (blockchain.errorMsg == ""){}
        else{
            toast({
                description: blockchain.errorMsg,
                status: "error",
                duration: 9000,
                isClosable: true,
            })}
        
    }, [blockchain.errorMsg]);

    useEffect(() => {
        if (blockchain.account == null){}
        else{
            toast({
                description: "Connected Successfully",
                status: "success",
                duration: 9000,
                isClosable: true,
            })}
        
    }, [blockchain.account]);

    window.addEventListener('resize', showButton);

    return (
        <div>
            {button ? 
                <HStack
                w='100vw'
                h='16vh'
                spacing='auto'
                bgGradient={'linear(to-b, blue.500, #1d67ff)'}
                overflow="false"
            >  
                <a href="https://avaxfoxes.com/" >          
                <Image
                    src={Logo}
                    ml='3vw'               
                    h='4vh'  
                />
                </a>
                
                <HStack w='45vw'>
                    <Menu>
                        <MenuButton as={IconButton}  icon={<GiHamburgerMenu />} variant="outline"/>
                        <MenuList align='center' w='20vw'>
                            <MenuItem>
                                <Box
                                    align='center'
                                    fontSize='3xl'
                                    fontWeight='semibold'
                                    mx='auto'        
                                >
                                    <a href='https://twitter.com/avax_foxes'>
                                        <Icon as={FaTwitter} />
                                    </a>
                                </Box>
                            </MenuItem>
                            <MenuItem>
                                <Box
                                     align='center'
                                     fontSize='3xl'
                                     fontWeight='semibold'
                                     mx='auto'         
                                >
                                    <a href='https://t.me/avax_foxes'>
                                        <Icon as={FaTelegramPlane} />
                                    </a>
                                </Box>
                            </MenuItem>
                            <MenuItem>
                                <Box
                                     align='center'
                                     fontSize='3xl'
                                     fontWeight='semibold' 
                                     mx='auto'        
                                >
                                    <a href='https://discord.gg/x2DqFMfV8Z'>
                                        <Icon as={FaDiscord} />
                                    </a>
                                </Box>
                            </MenuItem>
                            <MenuItem>
                                <Box
                                     align='center'
                                     fontSize='3xl'
                                     fontWeight='semibold' 
                                     mx='auto'         
                                >
                                    <Icon h={8} as={IoIosConstruct} color='black' />
                                    <Text fontWeight='semibold'  fontSize='xl'>
                                        FoxMarket
                                    </Text>
                                </Box>
                            </MenuItem>
                            <MenuItem>
                                <Box
                                    align='center'
                                    fontSize='3xl'
                                    fontWeight='semibold' 
                                    mx='auto'         
                                >
                                    <Link to='/Game'>
                                        <Icon h={8} as={GrGamepad} color='black' />
                                    </Link>
                                </Box>
                            </MenuItem>

                            
                        </MenuList>
                    </Menu>
                    {blockchain.account === "" ||
              blockchain.smartContract === null ? (
                    <Box ml='25vw'>
                        <Button
                            px='22'
                            py='7'
                            bg='transparent'
                            borderRadius='150'
                            boxShadow='5'
                            color='white'
                            //mx-auto
                            //bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
                            //variant="outline"
                            _hover={{ bg: "blackAlpha.400" }}
                            onClick={(e) => {
                            e.preventDefault();
                            dispatch(connect());
                            //getData();
                            }}
                            leftIcon=  {<Icon as={MdAccountBalanceWallet} color='white' w={7} h={7}/>}
                        >
                            
                            CONNECT
                        </Button>   
                    </Box>):(

                        <Box bg='gray.200' borderRadius='150'>
                            <HStack >
                        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }} isTruncated w='18vw'>
                            {(data.reward/(1000000000000000000)).toFixed(2)}{" Avax"}
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
                                  claimRewards();
                                }}
                              >Claim</Button>
                        </HStack>
                      </Box>
                    

                    )}          
                </HStack>
                     
            </HStack>
            : 
                <HStack
                    w='100vw'
                    h='16vh'
                    spacing='auto'
                    pr='5vw'
                    bgGradient={'linear(to-b, blue.500, #1d67ff)'}
                >  
                    <a href="https://avaxfoxes.com/" >          
                    <Image
                        src={Logo}
                        ml='3vw'               
                        h='9vh'  
                    />
                    </a>
                    
                    <HStack >
                        <Box
                            align='center'
                            w='4vw'
                            fontSize='3xl'
                            fontWeight='semibold'                            
                            px='4'
                            py='1'
                            borderRadius='150'
                            _hover={{bg: "blackAlpha.400"}}         
                        >
                            <Link to='/Game'>
                                <Icon as={GrGamepad} color='white' />
                            </Link>
                        </Box>
                        <HStack
                            w='9vw'                                             
                            px='4'
                            py='1'
                            borderRadius='150'
                            bg='transparent' 
                            spacing='auto'   
                            fontSize='3xl'     
                        >
                            <Icon h={8} as={IoIosConstruct} color='black' />
                            <Text fontWeight='semibold'  fontSize='xl'>
                            FoxMarket
                            </Text>
                            
                            
                        </HStack>
                        <Box
                            align='center'
                            w='4vw'
                            fontSize='3xl'
                            fontWeight='semibold'                            
                            px='4'
                            py='1'
                            borderRadius='150'
                            _hover={{bg: "blackAlpha.400"}}         
                        >
                            <a href='https://twitter.com/avax_foxes'>
                                <Icon as={FaTwitter} color='white' />
                            </a>
                        </Box>
                        <Box
                            align='center'
                            w='4vw'
                            fontSize='3xl'
                            fontWeight='semibold'
                            px='4'
                            py='1'
                            borderRadius='150'
                            _hover={{bg: "blackAlpha.400"}}         
                        >
                            <a href='https://t.me/avax_foxes'>
                                <Icon as={FaTelegramPlane} color='white'/>
                            </a>
                        </Box>
                        <Box
                            align='center'
                            w='4vw'
                            fontSize='3xl'
                            fontWeight='semibold'
                            px='4'
                            py='1'                            
                            borderRadius='150'
                            _hover={{bg: "blackAlpha.400"}}         
                        >
                            <a href='https://discord.gg/x2DqFMfV8Z'>
                                <Icon as={FaDiscord} color='white'/>
                            </a>
                        </Box>
                        {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                        <Box ml='25vw'>
                            <Button
                                px='22'
                                py='7'
                                bg='transparent'
                                borderRadius='150'
                                boxShadow='5'
                                color='white'
                                //mx-auto
                                //bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
                                //variant="outline"
                                _hover={{ bg: "blackAlpha.400" }}
                                onClick={(e) => {
                                e.preventDefault();
                                dispatch(connect());
                                //getData();
                                }}
                                leftIcon=  {<Icon as={MdAccountBalanceWallet} color='white' w={7} h={7}/>}
                            >
                                
                                CONNECT
                            </Button>   
                        </Box>):(

                            <Box bg='gray.200' borderRadius='150'>
                                <HStack >
                            <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }} isTruncated w='12vw'>
                                {"Your Reward: "}{(data.reward/(1000000000000000000)).toFixed(2)}{" Avax"}
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
                                      claimRewards();
                                    }}
                                  >Claim</Button>
                            </HStack>
                          </Box>
                        

                        )}          
                    </HStack>
                         
                </HStack>
                
            }
                       
        </div>
    )
}

export default Navbar
