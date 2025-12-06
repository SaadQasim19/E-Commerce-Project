import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Input,
  Textarea,
  Button,
  Icon,
  useColorModeValue,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useState } from "react";

const MotionBox = motion.create(Box);

export default function ContactUs() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const bgGradient = useColorModeValue(
    "linear(to-br, cyan.50, blue.50)",
    "linear(to-br, gray.900, blue.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Message Sent! ✉️",
      description: "We'll get back to you within 24 hours.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Address",
      content: "123 Commerce Street, New York, NY 10001",
      color: "cyan.500",
    },
    {
      icon: FaPhone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      color: "green.500",
    },
    {
      icon: FaEnvelope,
      title: "Email",
      content: "support@shophub.com",
      color: "blue.500",
    },
    {
      icon: FaClock,
      title: "Business Hours",
      content: "Mon-Fri: 9AM-6PM EST",
      color: "purple.500",
    },
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
              bgGradient="linear(to-r, cyan.400, blue.500)"
              bgClip="text"
              mb={4}
            >
              Get In Touch
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Have a question or feedback? We'd love to hear from you! Send us a
              message and we'll respond as soon as possible.
            </Text>
          </MotionBox>

          {/* Contact Info Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
            {contactInfo.map((info, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Box
                  bg={cardBg}
                  p={6}
                  borderRadius="2xl"
                  boxShadow="xl"
                  border="1px"
                  borderColor={borderColor}
                  textAlign="center"
                  _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
                  transition="all 0.3s"
                >
                  <Box
                    bg={`${info.color.split(".")[0]}.50`}
                    w={16}
                    h={16}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx="auto"
                    mb={4}
                  >
                    <Icon as={info.icon} boxSize={8} color={info.color} />
                  </Box>
                  <Text fontWeight="bold" mb={2}>
                    {info.title}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {info.content}
                  </Text>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Contact Form */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
            {/* Form */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
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
                  Send Us a Message
                </Heading>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Name</FormLabel>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="john@example.com"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Subject</FormLabel>
                      <Input
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        placeholder="How can we help?"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Message</FormLabel>
                      <Textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Tell us more..."
                        rows={6}
                        size="lg"
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      bgGradient="linear(to-r, cyan.400, blue.500)"
                      color="white"
                      size="lg"
                      w="full"
                      leftIcon={<FiSend />}
                      _hover={{
                        bgGradient: "linear(to-r, cyan.500, blue.600)",
                        transform: "translateY(-2px)",
                        boxShadow: "xl",
                      }}
                    >
                      Send Message
                    </Button>
                  </VStack>
                </form>
              </Box>
            </MotionBox>

            {/* Map or Additional Info */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Box
                bg={cardBg}
                p={8}
                borderRadius="2xl"
                boxShadow="xl"
                border="1px"
                borderColor={borderColor}
                h="full"
              >
                <Heading size="lg" mb={6}>
                  Why Contact Us?
                </Heading>
                <VStack align="start" spacing={4}>
                  <HStack>
                    <Icon as={FaEnvelope} color="cyan.500" boxSize={5} />
                    <Text fontWeight="bold">Quick Response</Text>
                  </HStack>
                  <Text color="gray.600">
                    We aim to respond to all inquiries within 24 hours during
                    business days.
                  </Text>

                  <HStack>
                    <Icon as={FaPhone} color="green.500" boxSize={5} />
                    <Text fontWeight="bold">Expert Support</Text>
                  </HStack>
                  <Text color="gray.600">
                    Our customer service team is trained to help you with any
                    questions or concerns.
                  </Text>

                  <HStack>
                    <Icon as={FaClock} color="purple.500" boxSize={5} />
                    <Text fontWeight="bold">Extended Hours</Text>
                  </HStack>
                  <Text color="gray.600">
                    Available Monday through Friday, 9 AM to 6 PM EST for your
                    convenience.
                  </Text>
                </VStack>

                <Box
                  mt={8}
                  p={6}
                  bg={useColorModeValue("cyan.50", "cyan.900")}
                  borderRadius="xl"
                >
                  <Text fontWeight="bold" mb={2}>
                    Need Immediate Help?
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    For urgent matters, please call our hotline at{" "}
                    <Text as="span" fontWeight="bold" color="cyan.500">
                      +1 (555) 123-4567
                    </Text>
                  </Text>
                </Box>
              </Box>
            </MotionBox>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
