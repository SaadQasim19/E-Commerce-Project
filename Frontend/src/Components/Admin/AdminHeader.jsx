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
import useAuthStore from "../../Store/auth";

const MotionBox = motion.create(Box);

export default function AdminHeader() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const searchBg = useColorModeValue("gray.50", "gray.700");

  // Get user data from auth store
  const { user, logout } = useAuthStore();

  // Get current page name from path
  const pathParts = location.pathname.split("/").filter(Boolean);
  const currentPage = pathParts[pathParts.length - 1] || "dashboard";
  const pageName = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
                <MotionBox
                  position="absolute"
                  top={1}
                  right={1}
                  w={2.5}
                  h={2.5}
                  bg="red.500"
                  borderRadius="full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </Box>
            </MenuButton>
            <MenuList>
              <Box p={3} borderBottom="1px" borderColor={borderColor}>
                <Text fontWeight="bold">Notifications</Text>
                <Text fontSize="xs" color="gray.500">
                  You have 3 unread notifications
                </Text>
              </Box>
              <MenuItem>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="medium">
                    New order received
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    2 minutes ago
                  </Text>
                </VStack>
              </MenuItem>
              <MenuItem>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="medium">
                    Product stock low
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    1 hour ago
                  </Text>
                </VStack>
              </MenuItem>
              <MenuItem>
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="medium">
                    New customer registered
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    3 hours ago
                  </Text>
                </VStack>
              </MenuItem>
              <MenuDivider />
              <MenuItem justifyContent="center" color="cyan.500">
                View all notifications
              </MenuItem>
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
