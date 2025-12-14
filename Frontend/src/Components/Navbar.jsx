import { 
  Container, Flex, Text, Button, HStack, useColorMode, useDisclosure, 
  IconButton, Box, Badge, useColorModeValue, Tooltip, Menu,
  MenuButton, MenuList, MenuItem, Avatar, Divider, useToast
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PlusSquareIcon, BellIcon, SettingsIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { MdDashboard, MdStorefront } from "react-icons/md";
import { FiUser, FiSettings, FiLogOut, FiPackage, FiLogIn } from "react-icons/fi";
import { motion } from "framer-motion";
import CartIcon from "./CartIcon";
import CartDrawer from "./CartDrawer";
import WishlistIcon from "./WishlistIcon";
import WishlistDrawer from "./WishlistDrawer";
import useAuthStore from "../Store/auth";
import useNotificationStore from "../Store/notification";
import { useState, useEffect } from "react";
import { getAvatarUrl } from "../utils/helpers";

const MotionBox = motion(Box);

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isWishlistOpen, onOpen: onWishlistOpen, onClose: onWishlistClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [scrolled, setScrolled] = useState(false);

  // Check if user is authenticated as admin
  const isAdminAuthenticated = sessionStorage.getItem("adminAuthenticated") === "true";

  // Auth store
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  
  // Notification store
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification 
  } = useNotificationStore();

  const bg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

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
        bg={bg}
        backdropFilter="blur(10px)"
        borderBottom="1px"
        borderColor={borderColor}
        transition="all 0.3s"
        boxShadow={useColorModeValue("sm", "md")}
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

              {/* Notifications */}
              {isAuthenticated && (
                <Menu>
                  <Tooltip label="Notifications" placement="bottom">
                    <MenuButton
                      as={Box}
                      position="relative"
                      cursor="pointer"
                    >
                      <IconButton
                        icon={<BellIcon fontSize={20} />}
                        aria-label="Notifications"
                        variant="ghost"
                        colorScheme="orange"
                        _hover={{ bg: hoverBg, transform: "translateY(-2px)" }}
                        transition="all 0.2s"
                      />
                      {unreadCount > 0 && (
                        <Badge
                          position="absolute"
                          top={-1}
                          right={-1}
                          colorScheme="red"
                          borderRadius="full"
                          minW="18px"
                          h="18px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="xs"
                          px={1}
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </MenuButton>
                  </Tooltip>
                  <MenuList maxH="400px" overflowY="auto" minW="320px">
                    <Box p={3} borderBottomWidth="1px" borderColor={borderColor}>
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="bold" fontSize="md">Notifications</Text>
                        {unreadCount > 0 && (
                          <Button
                            size="xs"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAllAsRead();
                            }}
                          >
                            Mark all read
                          </Button>
                        )}
                      </Flex>
                      {unreadCount > 0 && (
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </Text>
                      )}
                    </Box>
                    {notifications.length === 0 ? (
                      <Box p={6} textAlign="center">
                        <BellIcon fontSize="3xl" color="gray.400" mb={2} />
                        <Text color="gray.500" fontSize="sm">No notifications yet</Text>
                      </Box>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <MenuItem
                          key={notification._id}
                          py={3}
                          bg={!notification.isRead ? "blue.50" : "transparent"}
                          _dark={{ bg: !notification.isRead ? "blue.900" : "transparent" }}
                          _hover={{ bg: hoverBg }}
                          onClick={() => {
                            markAsRead(notification._id);
                            if (notification.link) {
                              navigate(notification.link);
                            }
                          }}
                        >
                          <Box w="full">
                            <Flex justify="space-between" align="start">
                              <Text fontSize="sm" fontWeight={!notification.isRead ? "bold" : "medium"}>
                                {notification.title}
                              </Text>
                              {!notification.isRead && (
                                <Badge colorScheme="blue" ml={2} flexShrink={0}>New</Badge>
                              )}
                            </Flex>
                            <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }} mt={1}>
                              {notification.message}
                            </Text>
                            <Text fontSize="xs" color="gray.500" mt={1}>
                              {new Date(notification.createdAt).toLocaleString()}
                            </Text>
                          </Box>
                        </MenuItem>
                      ))
                    )}
                    {notifications.length > 5 && (
                      <>
                        <Divider />
                        <MenuItem 
                          justifyContent="center" 
                          color="blue.500"
                          fontWeight="medium"
                          onClick={() => navigate('/notifications')}
                        >
                          View all notifications
                        </MenuItem>
                      </>
                    )}
                  </MenuList>
                </Menu>
              )}
              
              {/* Wishlist - Hidden for Admin */}
              {!isAdminAuthenticated && <WishlistIcon onOpen={onWishlistOpen} />}
              
              {/* Cart - Hidden for Admin */}
              {!isAdminAuthenticated && <CartIcon onOpen={onOpen} />}
              
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
      
      {/* Wishlist Drawer */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={onWishlistClose} />
    </>
  );
}
