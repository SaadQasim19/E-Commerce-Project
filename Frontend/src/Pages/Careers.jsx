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
  Button,
  Badge,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Select,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiHeart,
  FiCoffee,
  FiAward,
} from "react-icons/fi";
import { useState } from "react";

const MotionBox = motion.create(Box);

export default function Careers() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    resume: "",
    coverLetter: "",
  });

  const toast = useToast();

  const bgGradient = useColorModeValue(
    "linear(to-br, pink.50, purple.50)",
    "linear(to-br, gray.900, pink.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const benefits = [
    {
      icon: FiDollarSign,
      title: "Competitive Salary",
      description: "Industry-leading compensation packages",
      color: "green",
    },
    {
      icon: FiHeart,
      title: "Health Benefits",
      description: "Comprehensive health, dental, and vision coverage",
      color: "red",
    },
    {
      icon: FiCoffee,
      title: "Flexible Hours",
      description: "Work-life balance with flexible schedules",
      color: "orange",
    },
    {
      icon: FiTrendingUp,
      title: "Career Growth",
      description: "Professional development and advancement opportunities",
      color: "blue",
    },
    {
      icon: FiAward,
      title: "Performance Bonuses",
      description: "Quarterly bonuses based on performance",
      color: "purple",
    },
    {
      icon: FiBriefcase,
      title: "Remote Options",
      description: "Hybrid and fully remote positions available",
      color: "cyan",
    },
  ];

  const openPositions = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $160k",
      description:
        "We're looking for an experienced full stack developer to join our engineering team and help build the next generation of our platform.",
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "New York, NY",
      type: "Full-time",
      salary: "$90k - $120k",
      description:
        "Join our design team to create beautiful, intuitive experiences that delight our customers.",
    },
    {
      title: "Customer Success Manager",
      department: "Customer Service",
      location: "Remote",
      type: "Full-time",
      salary: "$70k - $90k",
      description:
        "Help our customers succeed by providing exceptional support and building lasting relationships.",
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$65k - $85k",
      description:
        "Drive growth through creative marketing campaigns and data-driven strategies.",
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$110k - $140k",
      description:
        "Lead product development and strategy to deliver innovative features that customers love.",
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      salary: "$80k - $100k",
      description:
        "Turn data into insights that drive business decisions and improve customer experiences.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Application Submitted",
      description: "We'll review your application and get back to you soon!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    setFormData({
      name: "",
      email: "",
      position: "",
      resume: "",
      coverLetter: "",
    });
  };

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
            <Icon as={FiBriefcase} boxSize={16} color="pink.500" mb={4} />
            <Heading
              size="2xl"
              bgGradient="linear(to-r, pink.400, purple.500)"
              bgClip="text"
              mb={4}
            >
              Join Our Team
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Help us build the future of e-commerce. We're looking for talented,
              passionate individuals to join our growing team.
            </Text>
          </MotionBox>

          {/* Benefits */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            w="full"
          >
            <Heading size="lg" mb={6} textAlign="center">
              Why Work With Us?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {benefits.map((benefit, index) => (
                <Box
                  key={index}
                  bg={cardBg}
                  p={6}
                  borderRadius="xl"
                  boxShadow="md"
                  border="1px"
                  borderColor={borderColor}
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "xl",
                  }}
                >
                  <Icon
                    as={benefit.icon}
                    boxSize={10}
                    color={`${benefit.color}.500`}
                    mb={4}
                  />
                  <Heading size="md" mb={2}>
                    {benefit.title}
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    {benefit.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </MotionBox>

          {/* Open Positions */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            w="full"
          >
            <Heading size="lg" mb={6} textAlign="center">
              Open Positions
            </Heading>
            <VStack spacing={4}>
              {openPositions.map((position, index) => (
                <Box
                  key={index}
                  bg={cardBg}
                  p={6}
                  borderRadius="xl"
                  boxShadow="md"
                  border="1px"
                  borderColor={borderColor}
                  w="full"
                  transition="all 0.3s"
                  _hover={{
                    boxShadow: "xl",
                  }}
                >
                  <HStack justify="space-between" mb={4} flexWrap="wrap">
                    <VStack align="start" spacing={1}>
                      <Heading size="md">{position.title}</Heading>
                      <HStack spacing={4} flexWrap="wrap">
                        <HStack>
                          <Icon as={FiBriefcase} color="gray.500" />
                          <Text fontSize="sm" color="gray.600">
                            {position.department}
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiMapPin} color="gray.500" />
                          <Text fontSize="sm" color="gray.600">
                            {position.location}
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiClock} color="gray.500" />
                          <Text fontSize="sm" color="gray.600">
                            {position.type}
                          </Text>
                        </HStack>
                      </HStack>
                    </VStack>
                    <Badge colorScheme="green" fontSize="md" p={2}>
                      {position.salary}
                    </Badge>
                  </HStack>
                  <Text color="gray.600" mb={4}>
                    {position.description}
                  </Text>
                  <Button
                    colorScheme="pink"
                    size="sm"
                    onClick={() => {
                      setFormData({ ...formData, position: position.title });
                      document.getElementById("application-form").scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Apply Now
                  </Button>
                </Box>
              ))}
            </VStack>
          </MotionBox>

          {/* Application Form */}
          <MotionBox
            id="application-form"
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
              <Heading size="lg" mb={6}>
                Submit Your Application
              </Heading>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Position</FormLabel>
                    <Select
                      placeholder="Select position"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                    >
                      {openPositions.map((position, index) => (
                        <option key={index} value={position.title}>
                          {position.title}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Resume URL</FormLabel>
                    <Input
                      placeholder="https://linkedin.com/in/johndoe or link to PDF"
                      value={formData.resume}
                      onChange={(e) =>
                        setFormData({ ...formData, resume: e.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Cover Letter</FormLabel>
                    <Textarea
                      placeholder="Tell us why you'd be a great fit..."
                      value={formData.coverLetter}
                      onChange={(e) =>
                        setFormData({ ...formData, coverLetter: e.target.value })
                      }
                      rows={6}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    bgGradient="linear(to-r, pink.400, purple.500)"
                    color="white"
                    w="full"
                    size="lg"
                    _hover={{
                      bgGradient: "linear(to-r, pink.500, purple.600)",
                    }}
                  >
                    Submit Application
                  </Button>
                </VStack>
              </form>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
