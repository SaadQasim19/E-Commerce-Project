import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Button,
  useColorModeValue,
  Select,
  InputGroup,
  InputLeftElement,
  Input,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

export default function AdminOrders() {
  const bg = useColorModeValue("white", "gray.800");
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
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
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Status Updated",
          description: `Order status changed to ${newStatus}`,
          status: "success",
          duration: 3000,
        });
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        status: "error",
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="cyan.500" thickness="4px" />
      </Center>
    );
  }

  // Mock orders data (keeping for reference)
  const mockOrders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      date: "2025-11-28",
      total: 129.99,
      status: "completed",
      items: 3,
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      date: "2025-11-28",
      total: 89.50,
      status: "pending",
      items: 2,
    },
    {
      id: "ORD-003",
      customer: "Bob Wilson",
      date: "2025-11-27",
      total: 199.99,
      status: "processing",
      items: 5,
    },
    {
      id: "ORD-004",
      customer: "Alice Brown",
      date: "2025-11-27",
      total: 59.99,
      status: "completed",
      items: 1,
    },
    {
      id: "ORD-005",
      customer: "Charlie Davis",
      date: "2025-11-26",
      total: 149.99,
      status: "shipped",
      items: 4,
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: "green",
      pending: "orange",
      processing: "blue",
      shipped: "purple",
      cancelled: "red",
    };
    return colors[status] || "gray";
  };

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  return (
    <Box>
      {/* Header */}
      <Box mb={6}>
        <Heading size="lg" mb={2}>
          Orders Management
        </Heading>
        <Text color="gray.500">
          Track and manage customer orders
        </Text>
      </Box>

      {/* Filters */}
      <Box
        bg={bg}
        p={4}
        borderRadius="lg"
        boxShadow="md"
        mb={6}
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <HStack spacing={4}>
          <InputGroup maxW="300px">
            <InputLeftElement>
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input placeholder="Search orders..." />
          </InputGroup>
          <Select maxW="200px" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Badge colorScheme="blue" p={2} borderRadius="md">
            {filteredOrders.length} Orders
          </Badge>
        </HStack>
      </Box>

      {/* Orders Table */}
      <Box
        bg={bg}
        borderRadius="lg"
        boxShadow="md"
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        overflow="hidden"
      >
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg={useColorModeValue("gray.50", "gray.700")}>
              <Tr>
                <Th>Order ID</Th>
                <Th>Customer</Th>
                <Th>Date</Th>
                <Th isNumeric>Items</Th>
                <Th isNumeric>Total</Th>
                <Th>Status</Th>
                <Th textAlign="center">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredOrders.length === 0 ? (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8}>
                    <Text color="gray.500">No orders found</Text>
                  </Td>
                </Tr>
              ) : (
                filteredOrders.map((order) => (
                  <Tr key={order._id} _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}>
                    <Td fontWeight="medium">#{order._id.slice(-6).toUpperCase()}</Td>
                    <Td>{order.shippingInfo.fullName}</Td>
                    <Td>{new Date(order.orderDate).toLocaleDateString()}</Td>
                    <Td isNumeric>{order.items.length}</Td>
                    <Td isNumeric fontWeight="bold" color="green.500">
                      ${order.totalAmount.toFixed(2)}
                    </Td>
                    <Td>
                      <Select
                        size="sm"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        colorScheme={getStatusColor(order.status)}
                        variant="filled"
                        w="130px"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </Select>
                    </Td>
                    <Td textAlign="center">
                      <Button size="sm" colorScheme="blue" variant="ghost">
                        View Details
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
