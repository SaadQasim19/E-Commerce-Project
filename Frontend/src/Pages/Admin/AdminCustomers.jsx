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
  Avatar,
  HStack,
  VStack,
  Badge,
  Button,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Input,
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { MdEmail, MdPhone } from "react-icons/md";
import { useState, useEffect } from "react";

export default function AdminCustomers() {
  const bg = useColorModeValue("white", "gray.800");
  const toast = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch customers from backend
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders/customers");
      const data = await response.json();
      
      if (data.success) {
        setCustomers(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch customers",
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer =>
    customer.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery)
  );

  return (
    <Box>
      {/* Header */}
      <Box mb={6}>
        <Heading size="lg" mb={2}>
          Customers Management
        </Heading>
        <Text color="gray.500">
          View and manage customers who have placed orders
        </Text>
      </Box>

      {/* Search */}
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
          <InputGroup maxW="400px">
            <InputLeftElement>
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Badge colorScheme="blue" p={2} borderRadius="md">
            {filteredCustomers.length} Customers
          </Badge>
        </HStack>
      </Box>

      {/* Loading State */}
      {loading && (
        <Center py={10}>
          <Spinner size="xl" color="cyan.500" />
        </Center>
      )}

      {/* Empty State */}
      {!loading && customers.length === 0 && (
        <Center py={10}>
          <VStack spacing={3}>
            <Text fontSize="xl" color="gray.500">No customers found</Text>
            <Text color="gray.400">Customers will appear here after they place orders</Text>
          </VStack>
        </Center>
      )}

      {/* Customers Table */}
      {!loading && customers.length > 0 && (
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
                  <Th>Customer</Th>
                  <Th>Contact</Th>
                  <Th isNumeric>Orders</Th>
                  <Th isNumeric>Total Spent</Th>
                  <Th>Last Order</Th>
                  <Th textAlign="center">Actions</Th>
                </Tr>
              </Thead>
            <Tbody>
              {filteredCustomers.map((customer, index) => (
                <Tr key={customer.email || index} _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}>
                  <Td>
                    <HStack>
                      <Avatar size="sm" name={customer.fullName} />
                      <Text fontWeight="medium">{customer.fullName}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <HStack fontSize="sm">
                        <MdEmail />
                        <Text>{customer.email}</Text>
                      </HStack>
                      <HStack fontSize="sm" color="gray.500">
                        <MdPhone />
                        <Text>{customer.phone}</Text>
                      </HStack>
                    </VStack>
                  </Td>
                  <Td isNumeric>{customer.orderCount}</Td>
                  <Td isNumeric fontWeight="bold" color="green.500">
                    ${customer.totalSpent.toFixed(2)}
                  </Td>
                  <Td>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </Text>
                  </Td>
                  <Td textAlign="center">
                    <Button size="sm" colorScheme="blue" variant="ghost">
                      View Orders
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      )}
    </Box>
  );
}
