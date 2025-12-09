import {
  Flex,
  HStack,
  Text,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorMode,
  useColorModeValue,
  Badge,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  VStack,
  Button,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { MdLogout, MdPerson, MdStore, MdNotifications, MdSearch, MdSettings } from "react-icons/md";
import { FiMoon, FiSun, FiBell, FiSearch, FiHome } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import useAuthStore from "../../Store/auth";
import useNotificationStore from "../../Store/notification";

const MotionBox = motion.create(Box);

export default function AdminHeader() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const searchBg = useColorModeValue("gray.50", "gray.700");

  // Get user data from auth store
  const { user, logout, isAuthenticated } = useAuthStore();
  
  // Notification store
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    fetchUnreadCount,
    markAsRead,
    markAllAsRead 
  } = useNotificationStore();
  
  // Fetch notifications when authenticated
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

  // Get current page name from path
  const pathParts = location.pathname.split("/").filter(Boolean);
  const currentPage = pathParts[pathParts.length - 1] || "dashboard";
  const pageName = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  // Handle logout
  const handleLogout = async () => {
    // Clear admin authentication
    localStorage.removeItem("adminAuthenticated");
    await logout();
    navigate('/');
  };

  return (
    <Box
      as="header"
      w="full"
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
      backdropFilter="blur(10px)"
      bgOpacity={0.8}
    >
      <Flex
        align="center"
        justify="space-between"
        w="full"
        px={{ base: 4, md: 8 }}
        py={4}
      >
        {/* Left Side - Breadcrumb & Page Title */}
        <VStack align="start" spacing={1} display={{ base: "none", md: "flex" }}>
          <Breadcrumb fontSize="sm" color="gray.500">
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">
                <HStack spacing={1}>
                  <FiHome size={14} />
                  <Text>Home</Text>
                </HStack>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathParts.length > 1 && (
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>{pageName}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </Breadcrumb>
          <Text fontSize="2xl" fontWeight="bold">
            {pageName}
          </Text>
        </VStack>

        {/* Center - Search Bar */}
        <Box flex={1} maxW="500px" mx={8} display={{ base: "none", lg: "block" }}>
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray" />
            </InputLeftElement>
            <Input
              placeholder="Search products, orders, customers..."
              bg={searchBg}
              border="none"
              borderRadius="xl"
              _focus={{
                boxShadow: "lg",
                bg: useColorModeValue("white", "gray.800"),
              }}
            />
          </InputGroup>
        </Box>

        {/* Right Side Actions */}
        <HStack spacing={3}>
          {/* Search Icon for mobile */}
          <IconButton
            icon={<FiSearch />}
            variant="ghost"
            colorScheme="gray"
            display={{ base: "flex", lg: "none" }}
            aria-label="Search"
          />

          {/* Theme Toggle */}
          <IconButton
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            colorScheme="gray"
            aria-label="Toggle theme"
            fontSize="20px"
          />

          {/* Notifications */}
          <Menu>
            <MenuButton>
              <Box position="relative">
                <IconButton
                  icon={<FiBell />}
                  variant="ghost"
                  colorScheme="gray"
                  aria-label="Notifications"
                  fontSize="20px"
                />
                {unreadCount > 0 && (
                  <MotionBox
                    position="absolute"
                    top={1}
                    right={1}
                    minW="18px"
                    h="18px"
                    px={1}
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="10px"
                    fontWeight="bold"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </MotionBox>
                )}
              </Box>
            </MenuButton>
            <MenuList maxH="400px" overflowY="auto" minW="320px">
              <Box p={3} borderBottom="1px" borderColor={borderColor}>
                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold">Notifications</Text>
                  {unreadCount > 0 && (
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme="cyan"
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
                  <FiBell size={32} color="gray.400" style={{ margin: '0 auto 8px' }} />
                  <Text color="gray.500" fontSize="sm">No notifications yet</Text>
                </Box>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <MenuItem
                    key={notification._id}
                    py={3}
                    bg={!notification.isRead ? "cyan.50" : "transparent"}
                    _dark={{ bg: !notification.isRead ? "cyan.900" : "transparent" }}
                    onClick={() => {
                      markAsRead(notification._id);
                      if (notification.link) {
                        navigate(notification.link);
                      }
                    }}
                  >
                    <VStack align="start" spacing={1} w="full">
                      <Flex justify="space-between" align="start" w="full">
                        <Text fontSize="sm" fontWeight={!notification.isRead ? "bold" : "medium"}>
                          {notification.title}
                        </Text>
                        {!notification.isRead && (
                          <Badge colorScheme="cyan" ml={2} flexShrink={0}>New</Badge>
                        )}
                      </Flex>
                      <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>
                        {notification.message}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Text>
                    </VStack>
                  </MenuItem>
                ))
              )}
              {notifications.length > 5 && (
                <>
                  <MenuDivider />
                  <MenuItem 
                    justifyContent="center" 
                    color="cyan.500"
                    fontWeight="medium"
                    onClick={() => navigate('/admin/notifications')}
                  >
                    View all notifications
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>

        {/* User Menu */}
          <Menu>
            <MenuButton>
              <HStack spacing={2} cursor="pointer">
                <Avatar
                  size="sm"
                  name={user?.name || "Admin User"}
                  src={user?.avatar}
                  bg="cyan.500"
                  color="white"
                />
                <Box display={{ base: "none", md: "block" }}>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="bold">
                      {user?.name || "Admin User"}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {user?.role === 'admin' ? 'Administrator' : 'User'}
                    </Text>
                  </VStack>
                </Box>
                <ChevronDownIcon display={{ base: "none", md: "block" }} />
              </HStack>
            </MenuButton>
            <MenuList>
              <Box p={3} borderBottom="1px" borderColor={borderColor}>
                <HStack>
                  <Avatar 
                    size="md" 
                    name={user?.name || "Admin User"} 
                    src={user?.avatar}
                    bg="cyan.500" 
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{user?.name || "Admin User"}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {user?.email || "admin@store.com"}
                    </Text>
                    <Badge colorScheme="cyan" fontSize="xs" mt={1}>
                      {user?.role === 'admin' ? 'Administrator' : 'User'}
                    </Badge>
                  </VStack>
                </HStack>
              </Box>
              <MenuItem icon={<MdPerson />} onClick={() => navigate("/admin/profile")}>
                My Profile
              </MenuItem>
              <MenuItem icon={<MdSettings />} onClick={() => navigate("/admin/settings")}>
                Account Settings
              </MenuItem>
              <MenuItem icon={<MdStore />} onClick={() => navigate("/")}>
                View Store Front
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<MdLogout />} color="red.500" onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}
