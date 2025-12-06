import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiTarget,
  FiHeart,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";

const MotionBox = motion.create(Box);

export default function AboutUs() {
  const bgGradient = useColorModeValue(
    "linear(to-br, indigo.50, purple.50)",
    "linear(to-br, gray.900, indigo.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const values = [
    {
      icon: FiTarget,
      title: "Our Mission",
      description:
        "To provide high-quality products and exceptional customer service that exceeds expectations.",
      color: "blue",
    },
    {
      icon: FiHeart,
      title: "Customer First",
      description:
        "Every decision we make is centered around creating the best possible experience for our customers.",
      color: "red",
    },
    {
      icon: FiUsers,
      title: "Community",
      description:
        "Building a vibrant community of shoppers who trust and recommend our brand to others.",
      color: "purple",
    },
    {
      icon: FiAward,
      title: "Quality",
      description:
        "We carefully curate every product to ensure it meets our high standards of quality and value.",
      color: "orange",
    },
  ];

  const stats = [
    {
      icon: FiUsers,
      label: "Happy Customers",
      value: "50K+",
      helpText: "And growing every day",
      color: "purple",
    },
    {
      icon: FiShoppingBag,
      label: "Products Sold",
      value: "200K+",
      helpText: "Since our launch",
      color: "blue",
    },
    {
      icon: FiStar,
      label: "Average Rating",
      value: "4.8/5",
      helpText: "From verified reviews",
      color: "orange",
    },
    {
      icon: FiTrendingUp,
      label: "Growth Rate",
      value: "150%",
      helpText: "Year over year",
      color: "green",
    },
  ];

  const team = [
    { name: "Sarah Johnson", role: "CEO & Founder", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Michael Chen", role: "CTO", avatar: "https://i.pravatar.cc/150?img=13" },
    { name: "Emily Rodriguez", role: "Head of Design", avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "David Kim", role: "Operations Manager", avatar: "https://i.pravatar.cc/150?img=12" },
    { name: "Lisa Anderson", role: "Customer Success", avatar: "https://i.pravatar.cc/150?img=9" },
    { name: "James Wilson", role: "Marketing Director", avatar: "https://i.pravatar.cc/150?img=14" },
  ];

  const timeline = [
    { year: "2020", title: "Founded", description: "ShopHub was born with a vision to revolutionize online shopping" },
    { year: "2021", title: "Expansion", description: "Reached 10,000 customers and expanded product catalog" },
    { year: "2022", title: "Recognition", description: "Won 'Best E-commerce Startup' award" },
    { year: "2023", title: "Growth", description: "Opened international shipping to 50+ countries" },
    { year: "2024", title: "Innovation", description: "Launched AI-powered personalization features" },
  ];

  return (
    <Box bgGradient={bgGradient} minH="100vh" py={16}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            textAlign="center"
          >
            <Heading
              size="2xl"
              bgGradient="linear(to-r, indigo.400, purple.500)"
              bgClip="text"
              mb={4}
            >
              About ShopHub
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="3xl">
              We're not just an e-commerce platform—we're a team of passionate individuals
              dedicated to bringing you the best shopping experience possible. Since 2020,
              we've been on a mission to make online shopping easier, faster, and more
              enjoyable.
            </Text>
          </MotionBox>

          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box
                  bg={cardBg}
                  p={6}
                  borderRadius="xl"
                  boxShadow="md"
                  border="1px"
                  borderColor={borderColor}
                  textAlign="center"
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "xl",
                  }}
                >
                  <Icon
                    as={stat.icon}
                    boxSize={10}
                    color={`${stat.color}.500`}
                    mb={4}
                  />
                  <Stat>
                    <StatNumber fontSize="3xl" fontWeight="bold">
                      {stat.value}
                    </StatNumber>
                    <StatLabel fontSize="md">{stat.label}</StatLabel>
                    <StatHelpText>{stat.helpText}</StatHelpText>
                  </Stat>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Values */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            w="full"
          >
            <Box
              bg={cardBg}
              p={8}
              borderRadius="2xl"
              boxShadow="xl"
              border="1px"
              borderColor={borderColor}
            >
              <Heading size="lg" mb={8} textAlign="center">
                Our Values
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {values.map((value, index) => (
                  <HStack key={index} align="start" spacing={4}>
                    <Box
                      bg={`${value.color}.100`}
                      p={3}
                      borderRadius="lg"
                      color={`${value.color}.500`}
                    >
                      <Icon as={value.icon} boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={1}>
                      <Heading size="md">{value.title}</Heading>
                      <Text color="gray.600">{value.description}</Text>
                    </VStack>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>
          </MotionBox>

          {/* Timeline */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            w="full"
          >
            <Box
              bg={cardBg}
              p={8}
              borderRadius="2xl"
              boxShadow="xl"
              border="1px"
              borderColor={borderColor}
            >
              <Heading size="lg" mb={8} textAlign="center">
                Our Journey
              </Heading>
              <VStack spacing={6} align="stretch">
                {timeline.map((milestone, index) => (
                  <HStack key={index} spacing={6} align="start">
                    <Box
                      bgGradient="linear(to-r, indigo.400, purple.500)"
                      color="white"
                      px={4}
                      py={2}
                      borderRadius="lg"
                      fontWeight="bold"
                      fontSize="lg"
                      minW="80px"
                      textAlign="center"
                    >
                      {milestone.year}
                    </Box>
                    <VStack align="start" spacing={1} flex={1}>
                      <Heading size="md">{milestone.title}</Heading>
                      <Text color="gray.600">{milestone.description}</Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </MotionBox>

          {/* Team */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            w="full"
          >
            <Box
              bg={cardBg}
              p={8}
              borderRadius="2xl"
              boxShadow="xl"
              border="1px"
              borderColor={borderColor}
            >
              <Heading size="lg" mb={8} textAlign="center">
                Meet Our Team
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {team.map((member, index) => (
                  <VStack key={index}>
                    <Avatar
                      size="2xl"
                      name={member.name}
                      src={member.avatar}
                      border="4px"
                      borderColor="indigo.400"
                    />
                    <Heading size="md">{member.name}</Heading>
                    <Text color="gray.600">{member.role}</Text>
                  </VStack>
                ))}
              </SimpleGrid>
            </Box>
          </MotionBox>

          {/* Join Us */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            w="full"
          >
            <Box
              bg={cardBg}
              p={8}
              borderRadius="2xl"
              boxShadow="xl"
              border="1px"
              borderColor={borderColor}
              textAlign="center"
            >
              <Heading size="lg" mb={4}>
                Want to Join Our Team?
              </Heading>
              <Text color="gray.600" mb={6}>
                We're always looking for talented individuals who share our passion for
                creating amazing shopping experiences.
              </Text>
              <Box
                as="a"
                href="/careers"
                display="inline-block"
                px={8}
                py={4}
                bgGradient="linear(to-r, indigo.400, purple.500)"
                color="white"
                borderRadius="xl"
                fontWeight="bold"
                fontSize="lg"
                _hover={{
                  bgGradient: "linear(to-r, indigo.500, purple.600)",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.3s"
              >
                View Open Positions
              </Box>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
