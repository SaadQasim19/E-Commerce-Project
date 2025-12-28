import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  useColorModeValue,
  Heading,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Avatar,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  MdInventory,
  MdShoppingCart,
  MdAttachMoney,
  MdPeople,
  MdTrendingUp,
  MdTrendingDown,
  MdMoreVert,
  MdRefresh,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import { FiShoppingBag, FiPackage, FiDollarSign, FiUsers, FiTrendingUp } from "react-icons/fi";
import { useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import ProductStore from "../../Store/product";

function StatsCard({ title, stat, icon, change, changeType, gradient, index }) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const isPositive = changeType === "increase";

  return (
    <Box
      bg={bg}
      p={5}
      borderRadius="md"
      border="1px solid"
      borderColor={borderColor}
      transition="border-color 0.2s"
      _hover={{
        borderColor: useColorModeValue("gray.300", "gray.600"),
      }}
    >
      <Flex justify="space-between" align="start" mb={3}>
        <Icon 
          as={icon} 
          boxSize={5} 
          color="gray.500"
        />
        {change && (
          <HStack spacing={1}>
            <Icon
              as={isPositive ? MdArrowUpward : MdArrowDownward}
              color={isPositive ? "green.600" : "red.600"}
              boxSize={3}
            />
            <Text
              fontSize="xs"
              fontWeight="600"
              color={isPositive ? "green.600" : "red.600"}
            >
              {change}%
            </Text>
          </HStack>
        )}
      </Flex>

      <VStack align="start" spacing={0.5}>
        <Text
          fontSize="xs"
          color="gray.500"
          fontWeight="500"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {title}
        </Text>
        <Text fontSize="2xl" fontWeight="700" color={useColorModeValue("gray.900", "white")}>
          {stat}
        </Text>
      </VStack>
    </Box>
  );
}

export default function AdminDashboard() {
  const { oldProduct, fetchProducts } = ProductStore();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Calculate stats
  const totalProducts = oldProduct.length;
  const totalRevenue = oldProduct.reduce((sum, product) => sum + parseFloat(product.price), 0);
  const avgPrice = totalProducts > 0 ? (totalRevenue / totalProducts).toFixed(2) : 0;

  // Mock data for charts
  const revenueData = [
    { month: "Jan", revenue: 4500, orders: 45 },
    { month: "Feb", revenue: 5200, orders: 52 },
    { month: "Mar", revenue: 4800, orders: 48 },
    { month: "Apr", revenue: 6100, orders: 61 },
    { month: "May", revenue: 7200, orders: 72 },
    { month: "Jun", revenue: 8500, orders: 85 },
  ];

  const categoryData = [
    { name: "Electronics", value: 35, color: "#3B82F6" },
    { name: "Clothing", value: 25, color: "#8B5CF6" },
    { name: "Books", value: 20, color: "#EC4899" },
    { name: "Home", value: 15, color: "#10B981" },
    { name: "Others", value: 5, color: "#F59E0B" },
  ];

  // Recent activity mock data
  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", amount: 129.99, status: "completed", time: "2 min ago" },
    { id: "ORD-002", customer: "Jane Smith", amount: 89.50, status: "pending", time: "15 min ago" },
    { id: "ORD-003", customer: "Bob Wilson", amount: 199.99, status: "processing", time: "1 hour ago" },
    { id: "ORD-004", customer: "Alice Brown", amount: 59.99, status: "completed", time: "2 hours ago" },
    { id: "ORD-005", customer: "Charlie Davis", amount: 149.99, status: "shipped", time: "3 hours ago" },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading
            size="lg"
            fontWeight="600"
            color={useColorModeValue("gray.900", "white")}
            mb={1}
          >
            Dashboard
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Overview of your store performance
          </Text>
        </Box>
        <HStack spacing={2}>
          <IconButton
            icon={<MdRefresh />}
            variant="ghost"
            size="sm"
            color="gray.600"
            onClick={() => fetchProducts()}
            aria-label="Refresh"
          />
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<MdMoreVert />}
              variant="ghost"
              size="sm"
              color="gray.600"
              aria-label="More options"
            />
            <MenuList>
              <MenuItem>Export Data</MenuItem>
              <MenuItem>View Reports</MenuItem>
              <MenuItem>Settings</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
        <StatsCard
          title="Total Products"
          stat={totalProducts}
          icon={FiPackage}
          change={12.5}
          changeType="increase"
          gradient="linear(to-br, cyan.400, blue.500)"
          index={0}
        />
        <StatsCard
          title="Total Orders"
          stat="124"
          icon={FiShoppingBag}
          change={8.2}
          changeType="increase"
          gradient="linear(to-br, purple.400, pink.500)"
          index={1}
        />
        <StatsCard
          title="Total Revenue"
          stat={`$${totalRevenue.toFixed(2)}`}
          icon={FiDollarSign}
          change={15.3}
          changeType="increase"
          gradient="linear(to-br, green.400, teal.500)"
          index={2}
        />
        <StatsCard
          title="Active Customers"
          stat="89"
          icon={FiUsers}
          change={3.1}
          changeType="increase"
          gradient="linear(to-br, orange.400, red.500)"
          index={3}
        />
      </SimpleGrid>

      {/* Charts Section */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={4} mb={6}>
        {/* Revenue Chart */}
        <GridItem>
          <Box
            bg={bg}
            p={5}
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading size="sm" fontWeight="600" mb={1}>
                  Revenue Overview
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  Monthly revenue and orders
                </Text>
              </Box>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MdMoreVert />}
                  variant="ghost"
                  size="xs"
                  color="gray.500"
                  aria-label="Options"
                />
                <MenuList fontSize="sm">
                  <MenuItem>Last 30 Days</MenuItem>
                  <MenuItem>Last 3 Months</MenuItem>
                  <MenuItem>Last 6 Months</MenuItem>
                  <MenuItem>Last Year</MenuItem>
                </MenuList>
              </Menu>
            </Flex>

            {/* Summary Stats - Enhanced */}
            <Grid 
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} 
              gap={4} 
              mb={5}
              p={4}
              bg={useColorModeValue("gray.50", "gray.750")}
              borderRadius="lg"
            >
              <Box>
                <HStack spacing={2} mb={1}>
                  <Box w={2} h={2} borderRadius="full" bg="blue.500" />
                  <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                    Total Revenue
                  </Text>
                </HStack>
                <HStack spacing={2} align="baseline">
                  <Text fontSize="2xl" fontWeight="700" color={useColorModeValue("gray.900", "white")}>
                    ${revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                  </Text>
                  <Badge 
                    colorScheme="green" 
                    fontSize="xs" 
                    px={2} 
                    py={0.5}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                  >
                    <Icon as={MdArrowUpward} boxSize={3} />
                    15.3%
                  </Badge>
                </HStack>
              </Box>
              <Box>
                <HStack spacing={2} mb={1}>
                  <Box w={2} h={2} borderRadius="full" bg="green.500" />
                  <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                    Total Orders
                  </Text>
                </HStack>
                <HStack spacing={2} align="baseline">
                  <Text fontSize="2xl" fontWeight="700" color={useColorModeValue("gray.900", "white")}>
                    {revenueData.reduce((sum, item) => sum + item.orders, 0)}
                  </Text>
                  <Badge 
                    colorScheme="green" 
                    fontSize="xs" 
                    px={2} 
                    py={0.5}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                  >
                    <Icon as={MdArrowUpward} boxSize={3} />
                    8.2%
                  </Badge>
                </HStack>
              </Box>
              <Box>
                <HStack spacing={2} mb={1}>
                  <Box w={2} h={2} borderRadius="full" bg="purple.500" />
                  <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                    Avg Order Value
                  </Text>
                </HStack>
                <HStack spacing={2} align="baseline">
                  <Text fontSize="2xl" fontWeight="700" color={useColorModeValue("gray.900", "white")}>
                    ${(revenueData.reduce((sum, item) => sum + item.revenue, 0) / 
                       revenueData.reduce((sum, item) => sum + item.orders, 0)).toFixed(2)}
                  </Text>
                  <Badge 
                    colorScheme="blue" 
                    fontSize="xs" 
                    px={2} 
                    py={0.5}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                  >
                    <Icon as={MdArrowUpward} boxSize={3} />
                    6.7%
                  </Badge>
                </HStack>
              </Box>
            </Grid>

            {/* Enhanced Chart */}
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart 
                data={revenueData}
                margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={useColorModeValue("#E5E7EB", "#374151")} 
                  vertical={false}
                  strokeOpacity={0.5}
                />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: useColorModeValue("#6B7280", "#9CA3AF"), fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  yAxisId="revenue"
                  orientation="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: useColorModeValue("#6B7280", "#9CA3AF"), fontSize: 11 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  dx={-5}
                />
                <YAxis 
                  yAxisId="orders"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: useColorModeValue("#6B7280", "#9CA3AF"), fontSize: 11 }}
                  dx={5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: useColorModeValue("white", "#1F2937"),
                    border: `1px solid ${useColorModeValue("#E5E7EB", "#374151")}`,
                    borderRadius: "8px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    padding: "12px 14px",
                  }}
                  labelStyle={{
                    color: useColorModeValue("#111827", "#F9FAFB"),
                    fontWeight: "700",
                    fontSize: "13px",
                    marginBottom: "6px",
                  }}
                  itemStyle={{
                    padding: "3px 0",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                  formatter={(value, name) => {
                    if (name === "revenue") return [`$${value.toLocaleString()}`, "Revenue"];
                    if (name === "orders") return [value, "Orders"];
                    return [value, name];
                  }}
                  cursor={{ fill: useColorModeValue("#F3F4F6", "#374151"), opacity: 0.3 }}
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  iconType="circle"
                  iconSize={10}
                  formatter={(value) => {
                    if (value === "revenue") return "Revenue";
                    if (value === "orders") return "Orders";
                    return value;
                  }}
                />
                <Bar 
                  yAxisId="revenue"
                  dataKey="revenue" 
                  fill="url(#colorRevenue)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
                <Line 
                  yAxisId="orders"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ 
                    fill: "#10B981", 
                    strokeWidth: 2, 
                    stroke: useColorModeValue("white", "#1F2937"),
                    r: 5,
                  }}
                  activeDot={{ 
                    r: 7,
                    fill: "#10B981",
                    strokeWidth: 3,
                    stroke: useColorModeValue("white", "#1F2937"),
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>

        {/* Category Distribution */}
        <GridItem>
          <Box
            bg={bg}
            p={5}
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
            h="full"
          >
            <Heading size="sm" fontWeight="600" mb={4}>
              Sales by Category
            </Heading>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <VStack spacing={2} mt={3}>
              {categoryData.map((cat, index) => (
                <HStack key={index} w="full" justify="space-between">
                  <HStack spacing={2}>
                    <Box w={2.5} h={2.5} borderRadius="full" bg={cat.color} />
                    <Text fontSize="xs" fontWeight="500">{cat.name}</Text>
                  </HStack>
                  <Text fontSize="xs" fontWeight="600" color="gray.600">
                    {cat.value}%
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </GridItem>
      </Grid>

      {/* Recent Orders and Top Products */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={4}>
        {/* Recent Orders */}
        <GridItem>
          <Box
            bg={bg}
            p={5}
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading size="sm" fontWeight="600" mb={1}>
                  Recent Orders
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  Latest transactions
                </Text>
              </Box>
              <Text
                fontSize="xs"
                color="blue.600"
                cursor="pointer"
                fontWeight="500"
                _hover={{ textDecoration: "underline" }}
              >
                View all
              </Text>
            </Flex>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th fontSize="xs">Order ID</Th>
                    <Th fontSize="xs">Customer</Th>
                    <Th fontSize="xs" isNumeric>Amount</Th>
                    <Th fontSize="xs">Status</Th>
                    <Th fontSize="xs">Time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {recentOrders.map((order) => (
                    <Tr
                      key={order.id}
                      _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
                    >
                      <Td fontSize="xs" fontWeight="600" color="blue.600">
                        {order.id}
                      </Td>
                      <Td fontSize="xs">
                        <HStack spacing={2}>
                          <Avatar size="xs" name={order.customer} />
                          <Text>{order.customer}</Text>
                        </HStack>
                      </Td>
                      <Td fontSize="xs" isNumeric fontWeight="600">
                        ${order.amount.toFixed(2)}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={
                            order.status === "completed"
                              ? "green"
                              : order.status === "pending"
                              ? "yellow"
                              : order.status === "shipped"
                                ? "purple"
                                : "blue"
                            }
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                          >
                            {order.status.toUpperCase()}
                          </Badge>
                        </Td>
                        <Td>
                          <Text fontSize="sm" color="gray.500">
                            {order.time}
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
        </GridItem>

        {/* Top Products - Enhanced */}
        <GridItem>
          <Box
            bg={bg}
            p={5}
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading size="sm" fontWeight="600" mb={0.5}>
                  Top Products
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  Best selling this month
                </Text>
              </Box>
              <Text
                fontSize="xs"
                color="blue.600"
                cursor="pointer"
                fontWeight="500"
                _hover={{ textDecoration: "underline" }}
              >
                View all
              </Text>
            </Flex>
            <VStack spacing={0} align="stretch">
              {oldProduct.slice(0, 5).map((product, index) => {
                const salesGrowth = (Math.random() * 30 + 10).toFixed(1);
                const totalSales = Math.floor(Math.random() * 500 + 100);
                const isPositive = Math.random() > 0.2; // 80% positive growth
                
                return (
                  <Box
                    key={product._id}
                    p={3.5}
                    borderBottom={index < 4 ? "1px solid" : "none"}
                    borderColor={borderColor}
                    _hover={{ 
                      bg: useColorModeValue("gray.50", "gray.750"),
                      transform: "translateX(2px)"
                    }}
                    cursor="pointer"
                    transition="all 0.2s"
                  >
                    <HStack spacing={3} align="start">
                      {/* Rank Badge */}
                      <Box
                        minW={6}
                        h={6}
                        borderRadius="md"
                        bg={
                          index === 0
                            ? "blue.500"
                            : index === 1
                            ? "blue.400"
                            : index === 2
                            ? "blue.300"
                            : useColorModeValue("gray.200", "gray.600")
                        }
                        color={index < 3 ? "white" : useColorModeValue("gray.700", "gray.300")}
                        fontSize="xs"
                        fontWeight="700"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {index + 1}
                      </Box>

                      {/* Product Image */}
                      <Box position="relative" flexShrink={0}>
                        <Avatar
                          size="md"
                          src={product.image}
                          name={product.name}
                          borderRadius="lg"
                          border="2px solid"
                          borderColor={useColorModeValue("gray.100", "gray.700")}
                        />
                      </Box>

                      {/* Product Details */}
                      <VStack align="start" spacing={1} flex={1} minW={0}>
                        <Text fontSize="sm" fontWeight="600" noOfLines={1}>
                          {product.name}
                        </Text>
                        <HStack spacing={2} flexWrap="wrap">
                          <Text fontSize="xs" fontWeight="700" color="blue.600">
                            ${product.price}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            •
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {totalSales} sold
                          </Text>
                        </HStack>
                        
                        {/* Sales Trend Bar */}
                        <Box w="full" mt={1}>
                          <HStack spacing={2} mb={1}>
                            <Text fontSize="10px" color="gray.500" fontWeight="600" textTransform="uppercase">
                              Sales trend
                            </Text>
                            <Badge
                              colorScheme={isPositive ? "green" : "red"}
                              fontSize="9px"
                              px={1.5}
                              py={0.5}
                              borderRadius="sm"
                              fontWeight="700"
                            >
                              {isPositive ? "+" : "-"}{salesGrowth}%
                            </Badge>
                          </HStack>
                          <Progress
                            value={parseFloat(salesGrowth)}
                            size="xs"
                            borderRadius="full"
                            colorScheme={isPositive ? "green" : "red"}
                            bg={useColorModeValue("gray.100", "gray.700")}
                          />
                        </Box>
                      </VStack>

                      {/* Trend Icon */}
                      <Icon
                        as={isPositive ? FiTrendingUp : MdTrendingDown}
                        color={isPositive ? "green.500" : "red.500"}
                        boxSize={4}
                        flexShrink={0}
                      />
                    </HStack>
                  </Box>
                );
              })}
              {oldProduct.length === 0 && (
                <VStack py={8}>
                  <Icon as={FiPackage} boxSize={12} color="gray.300" />
                  <Text fontSize="sm" color="gray.500" textAlign="center" fontWeight="500">
                    No products yet
                  </Text>
                  <Text fontSize="xs" color="gray.400" textAlign="center">
                    Add products to see analytics
                  </Text>
                </VStack>
              )}
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
