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
} from "@chakra-ui/react";

export default function AdminAnalytics() {
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box>
      {/* Header */}
      <Box mb={6}>
        <Heading size="lg" mb={2}>
          Analytics & Reports
        </Heading>
        <Text color="gray.500">
          Detailed insights and performance metrics
        </Text>
      </Box>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Box bg={bg} p={6} borderRadius="lg" boxShadow="md">
          <Stat>
            <StatLabel>Page Views</StatLabel>
            <StatNumber>45,860</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>
        </Box>
        <Box bg={bg} p={6} borderRadius="lg" boxShadow="md">
          <Stat>
            <StatLabel>Conversion Rate</StatLabel>
            <StatNumber>3.24%</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              12.5%
            </StatHelpText>
          </Stat>
        </Box>
        <Box bg={bg} p={6} borderRadius="lg" boxShadow="md">
          <Stat>
            <StatLabel>Avg Order Value</StatLabel>
            <StatNumber>$127.50</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              8.2%
            </StatHelpText>
          </Stat>
        </Box>
        <Box bg={bg} p={6} borderRadius="lg" boxShadow="md">
          <Stat>
            <StatLabel>Customer Retention</StatLabel>
            <StatNumber>68.3%</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              2.1%
            </StatHelpText>
          </Stat>
        </Box>
      </SimpleGrid>

      {/* Placeholder for charts */}
      <Box
        bg={bg}
        p={8}
        borderRadius="lg"
        boxShadow="md"
        textAlign="center"
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Heading size="md" mb={4}>
          Charts Coming Soon
        </Heading>
        <Text color="gray.500">
          Advanced analytics charts and graphs will be displayed here
        </Text>
      </Box>
    </Box>
  );
}
