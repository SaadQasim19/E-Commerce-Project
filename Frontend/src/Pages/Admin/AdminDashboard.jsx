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
import { motion } from "framer-motion";
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

const MotionBox = motion.create(Box);
const MotionGrid = motion.create(SimpleGrid);

function StatsCard({ title, stat, icon, change, changeType, gradient, index }) {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const isPositive = changeType === "increase";

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, boxShadow: "2xl" }}
    >
      <Box
        position="relative"
        bg={bg}
        p={6}
        borderRadius="2xl"
        boxShadow="lg"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
        transition="all 0.3s"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "2xl",
        }}
      >
        {/* Gradient Background */}
        <Box
          position="absolute"
          top={0}
          right={0}
          w="150px"
          h="150px"
          bgGradient={gradient}
          opacity={0.1}
          borderRadius="full"
          filter="blur(40px)"
        />

        <Flex justify="space-between" align="start" position="relative">
          <VStack align="start" spacing={3} flex={1}>
            <Box
              bgGradient={gradient}
              p={4}
              borderRadius="xl"
              boxShadow="lg"
            >
              <Icon as={icon} boxSize={7} color="white" />
            </Box>

            <VStack align="start" spacing={1}>
              <Text
                fontSize="sm"
                color="gray.500"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                {title}
              </Text>
              <Text fontSize="3xl" fontWeight="bold" bgGradient={gradient} bgClip="text">
                {stat}
              </Text>
            </VStack>
          </VStack>

          <VStack align="end" spacing={2}>
            {change && (
              <HStack
                bg={isPositive ? "green.50" : "red.50"}
                px={3}
                py={1}
                borderRadius="full"
                spacing={1}
              >
                <Icon
                  as={isPositive ? MdArrowUpward : MdArrowDownward}
                  color={isPositive ? "green.500" : "red.500"}
                  boxSize={4}
                />
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={isPositive ? "green.600" : "red.600"}
                >
                  {change}%
                </Text>
              </HStack>
            )}
            <Text fontSize="xs" color="gray.500">
              vs last month
            </Text>
          </VStack>
        </Flex>
      </Box>
    </MotionBox>
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
      {/* Page Header with Actions */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        mb={8}
      >
        <Flex justify="space-between" align="center" mb={2}>
          <Box>
            <Heading
              size="xl"
              bgGradient="linear(to-r, cyan.400, blue.500, purple.500)"
              bgClip="text"
              mb={2}
            >
              Dashboard Overview
            </Heading>
            <Text color="gray.500" fontSize="lg">
              Welcome back! Here's what's happening with your store today.
            </Text>
          </Box>
          <HStack spacing={3}>
            <IconButton
              icon={<MdRefresh />}
              colorScheme="cyan"
              variant="ghost"
              size="lg"
              onClick={() => fetchProducts()}
              _hover={{ transform: "rotate(180deg)", transition: "0.5s" }}
            />
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<MdMoreVert />}
                variant="ghost"
                colorScheme="cyan"
              />
              <MenuList>
                <MenuItem>Export Data</MenuItem>
                <MenuItem>View Reports</MenuItem>
                <MenuItem>Settings</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </MotionBox>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
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
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mb={8}>
        {/* Revenue Chart - Professional E-Commerce Style */}
        <GridItem>
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Box
              bg={bg}
              p={6}
              borderRadius="2xl"
              boxShadow="xl"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Box>
                  <Heading size="md" mb={1}>
                    Revenue Overview
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    Monthly revenue and orders trend
                  </Text>
                </Box>
                <HStack spacing={2}>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<MdMoreVert />}
                      variant="ghost"
                      size="sm"
                      aria-label="Options"
                    />
                    <MenuList>
                      <MenuItem>Last 30 Days</MenuItem>
                      <MenuItem>Last 3 Months</MenuItem>
                      <MenuItem>Last 6 Months</MenuItem>
                      <MenuItem>Last Year</MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </Flex>

              {/* Summary Stats Row */}
              <HStack spacing={6} mb={6} mt={4}>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">
                    Total Revenue
                  </Text>
                  <HStack spacing={2} align="baseline">
                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                      ${revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                    </Text>
                    <Badge colorScheme="green" fontSize="xs">
                      <HStack spacing={1}>
                        <Icon as={MdArrowUpward} boxSize={3} />
                        <Text>15.3%</Text>
                      </HStack>
                    </Badge>
                  </HStack>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">
                    Total Orders
                  </Text>
                  <HStack spacing={2} align="baseline">
                    <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                      {revenueData.reduce((sum, item) => sum + item.orders, 0)}
                    </Text>
                    <Badge colorScheme="green" fontSize="xs">
                      <HStack spacing={1}>
                        <Icon as={MdArrowUpward} boxSize={3} />
                        <Text>8.2%</Text>
                      </HStack>
                    </Badge>
                  </HStack>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">
                    Avg Order Value
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    ${(revenueData.reduce((sum, item) => sum + item.revenue, 0) / revenueData.reduce((sum, item) => sum + item.orders, 0)).toFixed(2)}
                  </Text>
                </Box>
              </HStack>

              {/* Professional Combo Chart */}
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart 
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={useColorModeValue("#E5E7EB", "#374151")} 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: useColorModeValue("#6B7280", "#9CA3AF"), fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    yAxisId="revenue"
                    orientation="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: useColorModeValue("#6B7280", "#9CA3AF"), fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                  />
                  <YAxis 
                    yAxisId="orders"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: useColorModeValue("#6B7280", "#9CA3AF"), fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: useColorModeValue("white", "#1F2937"),
                      border: `1px solid ${useColorModeValue("#E5E7EB", "#374151")}`,
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                      padding: "12px",
                    }}
                    labelStyle={{
                      color: useColorModeValue("#111827", "#F9FAFB"),
                      fontWeight: "600",
                      marginBottom: "8px",
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
                      fontSize: "13px",
                      fontWeight: "500"
                    }}
                    iconType="circle"
                    formatter={(value) => {
                      if (value === "revenue") return "Revenue ($)";
                      if (value === "orders") return "Orders (count)";
                      return value;
                    }}
                  />
                  <Bar 
                    yAxisId="revenue"
                    dataKey="revenue" 
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                  <Line 
                    yAxisId="orders"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ 
                      fill: "#8B5CF6", 
                      strokeWidth: 2, 
                      r: 5,
                      stroke: useColorModeValue("white", "#1F2937")
                    }}
                    activeDot={{ 
                      r: 7,
                      stroke: "#8B5CF6",
                      strokeWidth: 3,
                      fill: useColorModeValue("white", "#1F2937")
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </MotionBox>
        </GridItem>

        {/* Category Distribution */}
        <GridItem>
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Box
              bg={bg}
              p={6}
              borderRadius="2xl"
              boxShadow="xl"
              borderWidth="1px"
              borderColor={borderColor}
              h="full"
            >
              <Heading size="md" mb={4}>
                Sales by Category
              </Heading>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <VStack spacing={2} mt={4}>
                {categoryData.map((cat, index) => (
                  <HStack key={index} w="full" justify="space-between">
                    <HStack>
                      <Box w={3} h={3} borderRadius="full" bg={cat.color} />
                      <Text fontSize="sm">{cat.name}</Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="bold">
                      {cat.value}%
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </MotionBox>
        </GridItem>
      </Grid>

      {/* Recent Orders and Top Products */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        {/* Recent Orders */}
        <GridItem>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Box
              bg={bg}
              p={6}
              borderRadius="2xl"
              boxShadow="xl"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex justify="space-between" align="center" mb={6}>
                <Box>
                  <Heading size="md" mb={1}>
                    Recent Orders
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    Latest customer orders
                  </Text>
                </Box>
                <Text
                  fontSize="sm"
                  color="cyan.500"
                  cursor="pointer"
                  fontWeight="600"
                  _hover={{ textDecoration: "underline" }}
                >
                  View All →
                </Text>
              </Flex>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Order ID</Th>
                      <Th>Customer</Th>
                      <Th isNumeric>Amount</Th>
                      <Th>Status</Th>
                      <Th>Time</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {recentOrders.map((order) => (
                      <Tr
                        key={order.id}
                        _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
                        transition="all 0.2s"
                      >
                        <Td fontWeight="bold" color="cyan.500">
                          {order.id}
                        </Td>
                        <Td>
                          <HStack>
                            <Avatar size="sm" name={order.customer} />
                            <Text>{order.customer}</Text>
                          </HStack>
                        </Td>
                        <Td isNumeric fontWeight="bold">
                          ${order.amount.toFixed(2)}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={
                              order.status === "completed"
                                ? "green"
                                : order.status === "pending"
                                ? "orange"
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
          </MotionBox>
        </GridItem>

        {/* Top Products */}
        <GridItem>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Box
              bg={bg}
              p={6}
              borderRadius="2xl"
              boxShadow="xl"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Heading size="md" mb={6}>
                Top Performing Products
              </Heading>
              <VStack spacing={4} align="stretch">
                {oldProduct.slice(0, 5).map((product, index) => (
                  <MotionBox
                    key={product._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    p={3}
                    borderRadius="lg"
                    _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
                    cursor="pointer"
                  >
                    <HStack justify="space-between">
                      <HStack flex={1}>
                        <Box position="relative">
                          <Avatar
                            size="md"
                            src={product.image}
                            name={product.name}
                            borderRadius="lg"
                          />
                          <Box
                            position="absolute"
                            top={-2}
                            left={-2}
                            bg="cyan.500"
                            color="white"
                            fontSize="xs"
                            fontWeight="bold"
                            w={5}
                            h={5}
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            {index + 1}
                          </Box>
                        </Box>
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                            {product.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            ${product.price}
                          </Text>
                        </VStack>
                      </HStack>
                      <VStack align="end" spacing={0}>
                        <Icon as={FiTrendingUp} color="green.500" boxSize={5} />
                        <Text fontSize="xs" color="green.500" fontWeight="bold">
                          +{(Math.random() * 20 + 5).toFixed(1)}%
                        </Text>
                      </VStack>
                    </HStack>
                  </MotionBox>
                ))}
                {oldProduct.length === 0 && (
                  <VStack py={8}>
                    <Icon as={FiPackage} boxSize={12} color="gray.400" />
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      No products yet
                    </Text>
                  </VStack>
                )}
              </VStack>
            </Box>
          </MotionBox>
        </GridItem>
      </Grid>

      {/* Additional Stats */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
        <GridItem>
          <Box
            bg={bg}
            p={6}
            borderRadius="xl"
            boxShadow="md"
            borderWidth="1px"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Text fontSize="sm" color="gray.500" mb={2}>
              Sales This Month
            </Text>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              $12,450
            </Text>
            <Progress
              value={75}
              colorScheme="cyan"
              borderRadius="full"
              size="sm"
            />
            <Text fontSize="xs" color="gray.500" mt={2}>
              75% of monthly goal
            </Text>
          </Box>
        </GridItem>

        <GridItem>
          <Box
            bg={bg}
            p={6}
            borderRadius="xl"
            boxShadow="md"
            borderWidth="1px"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Text fontSize="sm" color="gray.500" mb={2}>
              Average Order Value
            </Text>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              ${avgPrice}
            </Text>
            <Progress
              value={60}
              colorScheme="blue"
              borderRadius="full"
              size="sm"
            />
            <Text fontSize="xs" color="gray.500" mt={2}>
              Above average
            </Text>
          </Box>
        </GridItem>

        <GridItem>
          <Box
            bg={bg}
            p={6}
            borderRadius="xl"
            boxShadow="md"
            borderWidth="1px"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <Text fontSize="sm" color="gray.500" mb={2}>
              Conversion Rate
            </Text>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              3.2%
            </Text>
            <Progress
              value={32}
              colorScheme="green"
              borderRadius="full"
              size="sm"
            />
            <Text fontSize="xs" color="gray.500" mt={2}>
              Industry average: 2.8%
            </Text>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
