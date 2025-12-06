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
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiBookOpen, FiSearch, FiCalendar, FiUser, FiTag } from "react-icons/fi";
import { useState } from "react";

const MotionBox = motion.create(Box);

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const bgGradient = useColorModeValue(
    "linear(to-br, yellow.50, orange.50)",
    "linear(to-br, gray.900, orange.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const categories = ["All", "Shopping Tips", "Product Reviews", "Industry News", "Guides"];

  const blogPosts = [
    {
      title: "10 Tips for Finding the Best Deals Online",
      excerpt:
        "Discover proven strategies to save money on your online purchases and never miss a great deal again.",
      author: "Sarah Johnson",
      date: "Dec 15, 2025",
      category: "Shopping Tips",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
      readTime: "5 min read",
    },
    {
      title: "Product Review: Top 5 Tech Gadgets of 2025",
      excerpt:
        "We tested the latest tech gadgets to help you make informed purchase decisions. Here are our top picks.",
      author: "Michael Chen",
      date: "Dec 12, 2025",
      category: "Product Reviews",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop",
      readTime: "8 min read",
    },
    {
      title: "The Future of E-Commerce: Trends to Watch",
      excerpt:
        "Explore the emerging trends shaping the future of online shopping and how they'll impact your experience.",
      author: "Emily Rodriguez",
      date: "Dec 10, 2025",
      category: "Industry News",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
      readTime: "6 min read",
    },
    {
      title: "Complete Guide to Returns and Exchanges",
      excerpt:
        "Everything you need to know about returning or exchanging your online purchases, made simple.",
      author: "David Kim",
      date: "Dec 8, 2025",
      category: "Guides",
      image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=400&fit=crop",
      readTime: "4 min read",
    },
    {
      title: "How to Shop Sustainably: A Beginner's Guide",
      excerpt:
        "Make eco-friendly choices while shopping online with these practical tips for sustainable consumption.",
      author: "Lisa Anderson",
      date: "Dec 5, 2025",
      category: "Guides",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop",
      readTime: "7 min read",
    },
    {
      title: "Black Friday Success: How We Handled 50K Orders",
      excerpt:
        "Behind the scenes look at our biggest shopping event and how we ensured smooth operations.",
      author: "James Wilson",
      date: "Dec 1, 2025",
      category: "Industry News",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop",
      readTime: "6 min read",
    },
  ];

  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter(
          (post) => post.category.toLowerCase() === selectedCategory.toLowerCase()
        );

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
            <Icon as={FiBookOpen} boxSize={16} color="orange.500" mb={4} />
            <Heading
              size="2xl"
              bgGradient="linear(to-r, orange.400, yellow.500)"
              bgClip="text"
              mb={4}
            >
              ShopHub Blog
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Stay updated with the latest shopping tips, product reviews, and industry
              insights
            </Text>
          </MotionBox>

          {/* Search and Filter */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            w="full"
          >
            <HStack spacing={4} flexWrap="wrap">
              <InputGroup maxW="400px" flex={1}>
                <InputLeftElement>
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg={cardBg}
                  borderRadius="xl"
                  border="2px"
                  borderColor={borderColor}
                />
              </InputGroup>
              <Select
                maxW="200px"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                bg={cardBg}
                borderRadius="xl"
                border="2px"
                borderColor={borderColor}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </Select>
            </HStack>
          </MotionBox>

          {/* Blog Posts Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            {filteredPosts.map((post, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="md"
                  border="1px"
                  borderColor={borderColor}
                  overflow="hidden"
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-8px)",
                    boxShadow: "xl",
                  }}
                  cursor="pointer"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    w="full"
                    h="200px"
                    objectFit="cover"
                  />
                  <Box p={6}>
                    <HStack mb={3} spacing={2}>
                      <Badge colorScheme="orange">{post.category}</Badge>
                      <Text fontSize="sm" color="gray.500">
                        {post.readTime}
                      </Text>
                    </HStack>
                    <Heading size="md" mb={3} noOfLines={2}>
                      {post.title}
                    </Heading>
                    <Text color="gray.600" mb={4} noOfLines={3}>
                      {post.excerpt}
                    </Text>
                    <HStack justify="space-between" pt={4} borderTop="1px" borderColor={borderColor}>
                      <HStack>
                        <Icon as={FiUser} color="gray.500" />
                        <Text fontSize="sm" color="gray.600">
                          {post.author}
                        </Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCalendar} color="gray.500" />
                        <Text fontSize="sm" color="gray.600">
                          {post.date}
                        </Text>
                      </HStack>
                    </HStack>
                  </Box>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Newsletter Signup */}
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
              textAlign="center"
            >
              <Icon as={FiTag} boxSize={12} color="orange.500" mb={4} />
              <Heading size="lg" mb={4}>
                Subscribe to Our Newsletter
              </Heading>
              <Text color="gray.600" mb={6}>
                Get the latest articles, shopping tips, and exclusive deals delivered to
                your inbox every week.
              </Text>
              <HStack maxW="500px" mx="auto">
                <Input
                  placeholder="Enter your email"
                  size="lg"
                  borderRadius="xl"
                />
                <Box
                  as="button"
                  px={8}
                  py={3}
                  bgGradient="linear(to-r, orange.400, yellow.500)"
                  color="white"
                  borderRadius="xl"
                  fontWeight="bold"
                  whiteSpace="nowrap"
                  _hover={{
                    bgGradient: "linear(to-r, orange.500, yellow.600)",
                  }}
                >
                  Subscribe
                </Box>
              </HStack>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
