import {
  Container,
  Box,
  VStack,
  Heading,
  Text,
  HStack,
  Badge,
  Image,
  Button,
  useColorModeValue,
  Spinner,
  Center,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle } from "react-icons/fi";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "yellow",
      processing: "blue",
      shipped: "purple",
      delivered: "green",
      cancelled: "red",
    };
    return colors[status] || "gray";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: FiPackage,
      processing: FiPackage,
      shipped: FiTruck,
      delivered: FiCheckCircle,
      cancelled: FiXCircle,
    };
    return icons[status] || FiPackage;
  };

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2}>My Orders</Heading>
          <Text color="gray.500">View and track your order history</Text>
        </Box>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Center py={20}>
            <VStack spacing={4}>
              <FiPackage size={60} color="gray" />
              <Heading size="md" color="gray.500">No Orders Yet</Heading>
              <Text color="gray.400">Start shopping to see your orders here</Text>
              <Button colorScheme="blue" onClick={() => navigate("/")}>
                Start Shopping
              </Button>
            </VStack>
          </Center>
        ) : (
          <VStack spacing={4} align="stretch">
            {orders.map((order) => (
              <Box
                key={order._id}
                p={6}
                bg={bg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                _hover={{ shadow: "lg" }}
                transition="all 0.2s"
              >
                <VStack spacing={4} align="stretch">
                  {/* Order Header */}
                  <HStack justify="space-between" flexWrap="wrap">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color="gray.500">Order ID</Text>
                      <Text fontWeight="bold">#{order._id.slice(-8)}</Text>
                    </VStack>
                    
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color="gray.500">Order Date</Text>
                      <Text fontWeight="medium">
                        {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                      </Text>
                    </VStack>
                    
                    <Badge
                      colorScheme={getStatusColor(order.status)}
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Box as={getStatusIcon(order.status)} />
                      {order.status.toUpperCase()}
                    </Badge>
                  </HStack>

                  <Divider />

                  {/* Order Items */}
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                    {order.items.slice(0, 3).map((item, index) => (
                      <HStack key={index} spacing={3}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          boxSize="50px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <VStack align="start" spacing={0} flex="1">
                          <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                            {item.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Qty: {item.quantity} × ${item.price}
                          </Text>
                        </VStack>
                      </HStack>
                    ))}
                    {order.items.length > 3 && (
                      <Text fontSize="sm" color="gray.500">
                        +{order.items.length - 3} more items
                      </Text>
                    )}
                  </SimpleGrid>

                  <Divider />

                  {/* Order Footer */}
                  <HStack justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">Total Amount</Text>
                      <Text fontSize="xl" fontWeight="bold" color="blue.500">
                        ${order.totalAmount.toFixed(2)}
                      </Text>
                    </VStack>
                    
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/order-confirmation/${order._id}`, {
                        state: { order }
                      })}
                    >
                      View Details
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default OrdersPage;
