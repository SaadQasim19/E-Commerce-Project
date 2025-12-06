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
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { MdEmail, MdPhone } from "react-icons/md";

export default function AdminCustomers() {
  const bg = useColorModeValue("white", "gray.800");
  
  // Mock customers data
  const customers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8900",
      orders: 12,
      totalSpent: 1299.50,
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 234-567-8901",
      orders: 8,
      totalSpent: 850.00,
      status: "active",
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob@example.com",
      phone: "+1 234-567-8902",
      orders: 15,
      totalSpent: 2150.75,
      status: "active",
    },
    {
      id: "4",
      name: "Alice Brown",
      email: "alice@example.com",
      phone: "+1 234-567-8903",
      orders: 5,
      totalSpent: 425.00,
      status: "inactive",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box mb={6}>
        <Heading size="lg" mb={2}>
          Customers Management
        </Heading>
        <Text color="gray.500">
          View and manage your customer base
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
            <Input placeholder="Search customers..." />
          </InputGroup>
          <Badge colorScheme="blue" p={2} borderRadius="md">
            {customers.length} Customers
          </Badge>
        </HStack>
      </Box>

      {/* Customers Table */}
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
                <Th>Status</Th>
                <Th textAlign="center">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((customer) => (
                <Tr key={customer.id} _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}>
                  <Td>
                    <HStack>
                      <Avatar size="sm" name={customer.name} />
                      <Text fontWeight="medium">{customer.name}</Text>
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
                  <Td isNumeric>{customer.orders}</Td>
                  <Td isNumeric fontWeight="bold" color="green.500">
                    ${customer.totalSpent.toFixed(2)}
                  </Td>
                  <Td>
                    <Badge colorScheme={customer.status === "active" ? "green" : "gray"}>
                      {customer.status}
                    </Badge>
                  </Td>
                  <Td textAlign="center">
                    <Button size="sm" colorScheme="blue" variant="ghost">
                      View Profile
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
