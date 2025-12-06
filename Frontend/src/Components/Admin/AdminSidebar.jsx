import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  Divider,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Badge,
  Avatar,
  Tooltip,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdShoppingCart,
  MdPeople,
  MdSettings,
  MdInventory,
  MdBarChart,
  MdMenu,
  MdStore,
} from "react-icons/md";
import { FiPackage, FiShoppingBag, FiHome, FiUsers, FiSettings, FiBarChart2, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);
const MotionHStack = motion.create(HStack);

const SidebarContent = ({ onClose }) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("cyan.50", "gray.700");
  const activeBg = useColorModeValue(
    "linear(to-r, cyan.50, blue.50)",
    "linear(to-r, cyan.900, blue.900)"
  );
  const activeColor = useColorModeValue("cyan.600", "cyan.300");
  const gradientBg = useColorModeValue(
    "linear(to-br, cyan.400, blue.500, purple.500)",
    "linear(to-br, cyan.600, blue.700, purple.700)"
  );

  const menuItems = [
    { name: "Dashboard", icon: FiHome, path: "/admin", badge: null },
    { name: "Products", icon: FiPackage, path: "/admin/products", badge: "12" },
    { name: "Orders", icon: FiShoppingBag, path: "/admin/orders", badge: "5" },
    { name: "Customers", icon: FiUsers, path: "/admin/customers", badge: null },
    { name: "Analytics", icon: FiBarChart2, path: "/admin/analytics", badge: "New" },
    { name: "Profile", icon: FiUser, path: "/admin/profile", badge: null },
    { name: "Settings", icon: FiSettings, path: "/admin/settings", badge: null },
  ];

  return (
    <Box
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      w={{ base: "full", md: 64 }}
      h="full"
      overflowY="auto"
      position="relative"
    >
      {/* Logo/Brand with Gradient Background */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box
          position="relative"
          h={20}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderBottom="1px"
          borderColor={borderColor}
          bgGradient={gradientBg}
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="-50%"
            right="-20%"
            w="200px"
            h="200px"
            bg="whiteAlpha.200"
            borderRadius="full"
            filter="blur(50px)"
          />
          <HStack spacing={3}>
            <Icon as={MdStore} color="white" boxSize={8} />
            <Text fontSize="2xl" fontWeight="bold" color="white">
              Admin Panel
            </Text>
          </HStack>
        </Box>
      </MotionBox>

      {/* User Profile Section */}
      <MotionBox
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        p={4}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <HStack spacing={3}>
          <Avatar
            size="md"
            name="Admin User"
            bg="cyan.500"
            color="white"
          />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontWeight="bold" fontSize="sm">
              Admin User
            </Text>
            <Text fontSize="xs" color="gray.500">
              admin@store.com
            </Text>
          </VStack>
        </HStack>
      </MotionBox>

      {/* Navigation Menu */}
      <VStack spacing={2} align="stretch" p={4}>
        {menuItems.map((item, index) => (
          <MotionBox
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (index + 2) }}
          >
            <NavLink
              to={item.path}
              onClick={onClose}
              end={item.path === "/admin"}
            >
              {({ isActive }) => (
                <Tooltip label={item.name} placement="right" hasArrow>
                  <HStack
                    p={3}
                    borderRadius="xl"
                    cursor="pointer"
                    bgGradient={isActive ? activeBg : "transparent"}
                    color={isActive ? activeColor : "inherit"}
                    _hover={{
                      bg: hoverBg,
                      transform: "translateX(4px)",
                    }}
                    transition="all 0.3s"
                    position="relative"
                    justify="space-between"
                  >
                    <HStack spacing={3}>
                      <Box
                        p={2}
                        borderRadius="lg"
                        bg={isActive ? "cyan.500" : "transparent"}
                      >
                        <Icon
                          as={item.icon}
                          boxSize={5}
                          color={isActive ? "white" : "inherit"}
                        />
                      </Box>
                      <Text fontWeight={isActive ? "bold" : "medium"}>
                        {item.name}
                      </Text>
                    </HStack>
                    {item.badge && (
                      <Badge
                        colorScheme={isActive ? "cyan" : "gray"}
                        borderRadius="full"
                        px={2}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {isActive && (
                      <Box
                        position="absolute"
                        left={0}
                        top="50%"
                        transform="translateY(-50%)"
                        w={1}
                        h="60%"
                        bg="cyan.500"
                        borderRadius="full"
                      />
                    )}
                  </HStack>
                </Tooltip>
              )}
            </NavLink>
          </MotionBox>
        ))}
      </VStack>

      <Divider my={4} />

      {/* Quick Stats */}
      <Box px={4} py={2}>
        <Text fontSize="xs" color="gray.500" fontWeight="semibold" mb={2}>
          QUICK STATS
        </Text>
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between" fontSize="sm">
            <Text color="gray.600">Total Products</Text>
            <Text fontWeight="bold">--</Text>
          </HStack>
          <HStack justify="space-between" fontSize="sm">
            <Text color="gray.600">Pending Orders</Text>
            <Text fontWeight="bold" color="orange.500">
              --
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default function AdminSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Mobile Menu Button */}
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        icon={<MdMenu />}
        position="fixed"
        top={4}
        left={4}
        zIndex={20}
        aria-label="Open menu"
      />

      {/* Desktop Sidebar */}
      <Box display={{ base: "none", md: "block" }}>
        <SidebarContent onClose={onClose} />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody p={0}>
            <SidebarContent onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
