import { 
  Container, Flex, Text, Button, HStack, useColorMode, useDisclosure, 
  IconButton, Box, Badge, useColorModeValue, Tooltip, Menu,
  MenuButton, MenuList, MenuItem, Avatar, Divider, useToast
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { PlusSquareIcon, BellIcon, SettingsIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { MdDashboard, MdStorefront, MdFavorite } from "react-icons/md";
import { FiUser, FiSettings, FiLogOut, FiPackage, FiLogIn } from "react-icons/fi";
import { motion } from "framer-motion";
import CartIcon from "./CartIcon";
import CartDrawer from "./CartDrawer";
import useAuthStore from "../Store/auth";
import { useState, useEffect } from "react";
import { getAvatarUrl } from "../utils/helpers";

const MotionBox = motion(Box);

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const [scrolled, setScrolled] = useState(false);

  // Auth store
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

  const bg = useColorModeValue("whiteAlpha.900", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast({
        title: "Success",
        description: "Logged out successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    }
  };

  return (
    <>
      <Box
        position="sticky"
        top={0}
        zIndex={1000}
        bg={scrolled ? bg : "transparent"}
        backdropFilter={scrolled ? "blur(10px)" : "none"}
        borderBottom={scrolled ? "1px" : "0"}
        borderColor={borderColor}
        transition="all 0.3s"
        boxShadow={scrolled ? "md" : "none"}
      >
        <Container maxW={"1140px"} px={4}>
          <Flex
            h={16}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDirection={{
              base: "column",
              sm: "row",
            }}
            py={{ base: 4, sm: 0 }}
          >
            {/* Logo with Animation */}
            <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={"/"}>
                <HStack spacing={2}>
                  <MdStorefront size={32} color="#4299E1" />
                  <Text
                    fontSize={{ base: "22", sm: "28" }}
                    fontWeight={"extrabold"}
                    textTransform={"uppercase"}
                    bgGradient={"linear(to-r, cyan.400, blue.500, purple.500)"}
                    bgClip={"text"}
                    letterSpacing="tight"
                  >
                    ShopHub
                  </Text>
                </HStack>
              </Link>
            </MotionBox>

            {/* Navigation Items */}
            <HStack spacing={3} alignItems={"center"}>
              {/* Admin Dashboard */}
              <Tooltip label="Admin Dashboard" placement="bottom">
                <Link to={"/admin"}>
                  <IconButton
                    icon={<MdDashboard size={20} />}
                    aria-label="Admin Dashboard"
                    variant="ghost"
                    colorScheme="blue"
                    _hover={{ bg: hoverBg, transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                  />
                </Link>
              </Tooltip>
              
              {/* Add Product */}
              <Tooltip label="Add New Product" placement="bottom">
                <Link to={"/create"}>
                  <IconButton
                    icon={<PlusSquareIcon fontSize={20} />}
                    aria-label="Add Product"
                    colorScheme="cyan"
                    variant="ghost"
                    _hover={{ bg: hoverBg, transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                  />
                </Link>
              </Tooltip>

              {/* Wishlist */}
              <Tooltip label="Wishlist" placement="bottom">
                <IconButton
                  icon={<MdFavorite size={20} />}
                  aria-label="Wishlist"
                  variant="ghost"
                  colorScheme="pink"
                  _hover={{ bg: hoverBg, transform: "translateY(-2px)" }}
                  transition="all 0.2s"
                />
              </Tooltip>

              {/* Notifications */}
              <Tooltip label="Notifications" placement="bottom">
                <Box position="relative">
                  <IconButton
                    icon={<BellIcon fontSize={20} />}
                    aria-label="Notifications"
                    variant="ghost"
                    colorScheme="orange"
                    _hover={{ bg: hoverBg, transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                  />
                  <Badge
                    position="absolute"
                    top={-1}
                    right={-1}
                    colorScheme="red"
                    borderRadius="full"
                    boxSize="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                  >
                    3
                  </Badge>
                </Box>
              </Tooltip>
              
              {/* Cart */}
              <CartIcon onOpen={onOpen} />
              
              {/* Color Mode Toggle */}
              <Tooltip label={colorMode === "light" ? "Dark Mode" : "Light Mode"} placement="bottom">
                <IconButton
                  onClick={toggleColorMode}
                  icon={colorMode === "light" ? <IoMoon size={20} /> : <LuSun size={20} />}
                  aria-label="Toggle Color Mode"
                  variant="ghost"
                  colorScheme="purple"
                  _hover={{ bg: hoverBg, transform: "rotate(180deg)" }}
                  transition="all 0.3s"
                />
              </Tooltip>

              {/* User Menu or Login/Signup Buttons */}
              {isAuthenticated && user ? (
                <Menu>
                  <Tooltip label="Account" placement="bottom">
                    <MenuButton
                      as={Button}
                      variant="ghost"
                      p={0}
                      borderRadius="full"
                      _hover={{ transform: "scale(1.1)" }}
                      transition="all 0.2s"
                    >
                      <Avatar 
                        size="sm" 
                        name={user.name} 
                        src={getAvatarUrl(user.avatar)}
                        bg="gradient(to-r, cyan.400, blue.500)"
                      />
                    </MenuButton>
                  </Tooltip>
                  <MenuList>
                    <Box px={4} py={2}>
                      <Text fontWeight="bold" fontSize="sm">{user.name}</Text>
                      <Text fontSize="xs" color="gray.500">{user.email}</Text>
                    </Box>
                    <Divider />
                    <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
                      My Profile
                    </MenuItem>
                    <MenuItem icon={<FiPackage />} onClick={() => navigate('/orders')}>
                      My Orders
                    </MenuItem>
                    <MenuItem icon={<FiSettings />} onClick={() => navigate('/settings')}>
                      Settings
                    </MenuItem>
                    <Divider />
                    <MenuItem icon={<FiLogOut />} color="red.500" onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <HStack spacing={2}>
                  <Button
                    as={Link}
                    to="/login"
                    size="sm"
                    variant="ghost"
                    colorScheme="cyan"
                    leftIcon={<FiLogIn />}
                    _hover={{ bg: hoverBg }}
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/signup"
                    size="sm"
                    bgGradient="linear(to-r, cyan.400, blue.500)"
                    color="white"
                    _hover={{
                      bgGradient: "linear(to-r, cyan.500, blue.600)",
                      transform: "translateY(-2px)",
                    }}
                  >
                    Sign Up
                  </Button>
                </HStack>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
}
