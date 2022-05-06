import React, {useState, useEffect} from 'react'
import AvalancheImage from '../assets/images/avalanche.png'
import {Box, HStack, VStack, Image, Button, Spacer, Text} from '@chakra-ui/react'
import {FaTwitter, FaTelegramPlane, FaDiscord } from "react-icons/fa"
import {GiHamburgerMenu} from "react-icons/gi"
import {MdAccountBalanceWallet} from "react-icons/md"
import { Icon } from '@chakra-ui/icons';
import team1 from "../assets/images/3.png"
import team2 from "../assets/images/11.png"
import team3 from "../assets/images/20.png"
import team4 from "../assets/images/24.png"

function Footer() {
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
            <VStack w={button ? '100vw' : '100vw'} pt='8vh' spacing='0' bg='gray.200'>
                <Text fontSize='4xl'>
                    Team
                </Text>
                {button ? 
                
                <VStack w='100vw' px='2vw'  spacing='20'>
                    <HStack>
                        <VStack w='30vw'>
                            <Image src={team1} />
                            <Text align='center' fontWeight='semibold' fontSize='2xl'>
                                Celebrimbor
                            </Text>
                            <Text align='center' fontSize='lg'>
                                Blockchain Specialist
                            </Text>
                        </VStack>
                        <VStack w='30vw'>
                            <Image src={team2} />
                            <Text align='center' fontWeight='semibold' fontSize='2xl'>
                                Ascent
                            </Text>
                            <Text align='center' fontSize='lg'>
                                Artwork
                            </Text>
                        </VStack>
                    </HStack>
                    <HStack>
                        <VStack w='30vw'>
                            <Image src={team3} />
                            <Text align='center' fontWeight='semibold' fontSize='2xl'>
                                Eliot Ness
                            </Text>
                            <Text align='center' fontSize='lg'>
                                Developer
                            </Text>
                        </VStack>
                        <VStack w='30vw'>
                            <Image src={team4} />
                            <Text  align='center'fontWeight='semibold' fontSize='2xl'>
                                Wizardyy
                            </Text>
                            <Text align='center' fontSize='lg'>
                                Community Manager
                            </Text>
                        </VStack>
                    </HStack>
                </VStack>
                                
                : 
                              
                <HStack h='50vh' w='100vw' px='10vw' spacing='20'>
                    <VStack w='18vw'>
                        <Image w='18vw' src={team1} />
                        <Text fontWeight='semibold' fontSize='2xl'>
                            Celebrimbor
                        </Text>
                        <Text fontSize='lg'>
                            Blockchain Specialist
                        </Text>
                    </VStack>
                    <VStack w='18vw'>
                        <Image w='18vw' src={team2} />
                        <Text fontWeight='semibold' fontSize='2xl'>
                            Ascent
                        </Text>
                        <Text fontSize='lg'>
                            Artwork
                        </Text>
                    </VStack>
                    <VStack w='18vw'>
                        <Image w='18vw' src={team3} />
                        <Text fontWeight='semibold' fontSize='2xl'>
                            Eliot Ness
                        </Text>
                        <Text fontSize='lg'>
                            Developer
                        </Text>
                    </VStack>
                    <VStack w='18vw'>
                        <Image w='18vw' src={team4} />
                        <Text fontWeight='semibold' fontSize='2xl'>
                            Wizardyy
                        </Text>
                        <Text fontSize='lg'>
                            Community Manager
                        </Text>
                    </VStack>
                </HStack>}

                
                <HStack w='100%' bgGradient={'linear(to-b, gray.200, orange)'} h='20vh' pl='20vw' spacing='auto' pr='15vw'>
                    {button ? <Image h='5vh' src={AvalancheImage} /> : <Image h='7vh' src={AvalancheImage} />}
                    
                    <HStack >
                        <Box
                            align='center'
                            w='4vw'
                            fontSize='3xl'
                            fontWeight='semibold'                            
                            p='3'
                            borderRadius='xl'
                            _hover={{borderRadius:'xl', fontSize: '4xl'}}         
                        >
                            <a href='https://twitter.com/avax_foxes'>
                                <Icon h={button ? 5  : 8} as={FaTwitter} color='black' />
                            </a>
                        </Box>
                        <Box
                            align='center'
                            w='4vw'
                            fontSize='3xl'
                            fontWeight='semibold'
                            p='3'
                            borderRadius='xl'
                            _hover={{borderRadius:'xl', fontSize: '4xl'}}         
                        >
                            <a href='https://t.me/avax_foxes'>
                                <Icon h={button ? 5  : 8} as={FaTelegramPlane} color='black'/>
                            </a>
                        </Box>
                        <Box
                            align='center'
                            w='4vw'
                            fontSize='3xl'
                            fontWeight='semibold'
                            p='3'                            
                            borderRadius='xl'
                            _hover={{borderRadius:'xl', fontSize: '4xl'}}         
                        >
                            <a href='https://discord.gg/x2DqFMfV8Z'>
                                <Icon h={button ? 5  : 8} as={FaDiscord} color='black'/>
                            </a>
                        </Box>
                    </HStack>
                </HStack>
            </VStack>
        </div>
    )
}

export default Footer
