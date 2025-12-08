import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  VStack,
  Image,
  Progress,
  Icon,
  Divider,
  Grid,
  GridItem,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { 
  FiDollarSign, 
  FiShoppingCart, 
  FiPackage, 
  FiTrendingUp,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";

export default function AdminAnalytics() {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    avgOrderValue: 0,
    topProducts: [],
    recentOrders: [],
    ordersByStatus: {},
    categoryBreakdown: {},
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const ordersRes = await fetch("http://localhost:5000/api/orders");
      const ordersData = await ordersRes.json();
      
      // Fetch products
      const productsRes = await fetch("http://localhost:5000/api/products");
      const productsData = await productsRes.json();

      if (ordersData.success) {
        setOrders(ordersData.data);
        calculateAnalytics(ordersData.data, productsData.products || []);
      }
      
      if (productsData.success) {
        setProducts(productsData.products);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (ordersData, productsData) => {
    // Calculate total revenue
    const totalRevenue = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Calculate average order value
    const avgOrderValue = ordersData.length > 0 ? totalRevenue / ordersData.length : 0;
    
    // Count orders by status
    const ordersByStatus = ordersData.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Calculate top selling products (by frequency in orders)
    const productCount = {};
    ordersData.forEach(order => {
      order.items?.forEach(item => {
        const key = item.name;
        if (!productCount[key]) {
          productCount[key] = {
            name: item.name,
            image: item.image,
            count: 0,
            revenue: 0,
          };
        }
        productCount[key].count += item.quantity;
        productCount[key].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Category breakdown
    const categoryBreakdown = productsData.reduce((acc, product) => {
      const cat = product.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    // Recent orders (last 5)
    const recentOrders = ordersData
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    setAnalytics({
      totalRevenue,
      totalOrders: ordersData.length,
      totalProducts: productsData.length,
      avgOrderValue,
      topProducts,
      recentOrders,
      ordersByStatus,
      categoryBreakdown,
    });
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

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={6}>
        <Heading size="lg" mb={2}>
          Analytics Dashboard
        </Heading>
        <Text color="gray.500">
          Real-time insights into your store performance
        </Text>
      </Box>

      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <HStack justify="space-between" mb={4}>
            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>Total Revenue</Text>
              <Heading size="lg">${analytics.totalRevenue.toFixed(2)}</Heading>
            </Box>
            <Icon as={FiDollarSign} boxSize={8} color="green.500" />
          </HStack>
          <Text fontSize="xs" color="gray.500">From {analytics.totalOrders} orders</Text>
        </Box>

        <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <HStack justify="space-between" mb={4}>
            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>Total Orders</Text>
              <Heading size="lg">{analytics.totalOrders}</Heading>
            </Box>
            <Icon as={FiShoppingCart} boxSize={8} color="blue.500" />
          </HStack>
          <Text fontSize="xs" color="gray.500">
            Avg: ${analytics.avgOrderValue.toFixed(2)} per order
          </Text>
        </Box>

        <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <HStack justify="space-between" mb={4}>
            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>Total Products</Text>
              <Heading size="lg">{analytics.totalProducts}</Heading>
            </Box>
            <Icon as={FiPackage} boxSize={8} color="purple.500" />
          </HStack>
          <Text fontSize="xs" color="gray.500">In catalog</Text>
        </Box>

        <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <HStack justify="space-between" mb={4}>
            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>Avg Order Value</Text>
              <Heading size="lg">${analytics.avgOrderValue.toFixed(2)}</Heading>
            </Box>
            <Icon as={FiTrendingUp} boxSize={8} color="orange.500" />
          </HStack>
          <Text fontSize="xs" color="gray.500">Per transaction</Text>
        </Box>
      </SimpleGrid>

      {/* Two Column Layout */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
        {/* Top Selling Products */}
        <GridItem>
          <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <Heading size="md" mb={4}>Top Selling Products</Heading>
            <VStack spacing={4} align="stretch">
              {analytics.topProducts.length > 0 ? (
                analytics.topProducts.map((product, index) => (
                  <HStack key={index} spacing={4}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <VStack align="start" flex="1" spacing={0}>
                      <Text fontWeight="600" fontSize="sm" noOfLines={1}>
                        {product.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Sold: {product.count} units
                      </Text>
                    </VStack>
                    <Text fontWeight="bold" color="green.500">
                      ${product.revenue.toFixed(2)}
                    </Text>
                  </HStack>
                ))
              ) : (
                <Text color="gray.500" textAlign="center" py={4}>
                  No sales data yet
                </Text>
              )}
            </VStack>
          </Box>
        </GridItem>

        {/* Orders by Status */}
        <GridItem>
          <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <Heading size="md" mb={4}>Orders by Status</Heading>
            <VStack spacing={4} align="stretch">
              {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
                <Box key={status}>
                  <HStack justify="space-between" mb={2}>
                    <HStack>
                      <Badge colorScheme={getStatusColor(status)} textTransform="capitalize">
                        {status}
                      </Badge>
                      <Text fontSize="sm">{count} orders</Text>
                    </HStack>
                    <Text fontWeight="bold">
                      {((count / analytics.totalOrders) * 100).toFixed(1)}%
                    </Text>
                  </HStack>
                  <Progress
                    value={(count / analytics.totalOrders) * 100}
                    colorScheme={getStatusColor(status)}
                    size="sm"
                    borderRadius="full"
                  />
                </Box>
              ))}
              {Object.keys(analytics.ordersByStatus).length === 0 && (
                <Text color="gray.500" textAlign="center" py={4}>
                  No orders yet
                </Text>
              )}
            </VStack>
          </Box>
        </GridItem>
      </Grid>

      {/* Recent Orders */}
      <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor} mb={8}>
        <Heading size="md" mb={4}>Recent Orders</Heading>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Date</Th>
                <Th>Items</Th>
                <Th>Status</Th>
                <Th isNumeric>Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              {analytics.recentOrders.length > 0 ? (
                analytics.recentOrders.map((order) => (
                  <Tr key={order._id}>
                    <Td fontWeight="500">#{order._id.slice(-6)}</Td>
                    <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                    <Td>{order.items?.length || 0} items</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </Td>
                    <Td isNumeric fontWeight="bold" color="green.500">
                      ${order.totalAmount.toFixed(2)}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={5} textAlign="center" py={8}>
                    <Text color="gray.500">No orders yet</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Category Breakdown */}
      <Box bg={bg} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <Heading size="md" mb={4}>Products by Category</Heading>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
          {Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
            <Box key={category} p={4} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md">
              <Text fontSize="xs" color="gray.500" mb={1}>
                {category}
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {count}
              </Text>
            </Box>
          ))}
          {Object.keys(analytics.categoryBreakdown).length === 0 && (
            <Text color="gray.500" gridColumn="1 / -1" textAlign="center" py={4}>
              No products yet
            </Text>
          )}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
