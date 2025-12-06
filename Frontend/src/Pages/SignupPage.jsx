import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Checkbox,
  HStack,
  Divider,
  useColorModeValue,
  useToast,
  Link as ChakraLink,
  Icon,
  Stack,
  Progress,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiCheck, FiX } from "react-icons/fi";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import useAuthStore from "../Store/auth";

const MotionBox = motion(Box);

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [searchParams] = useSearchParams();

  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  // Check for OAuth errors in URL
  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    if (error) {
      let errorTitle = "Authentication Error";
      let errorMessage = message || "An error occurred during authentication";
      
      if (error.includes('not_configured')) {
        errorTitle = "Feature Not Available";
        errorMessage = decodeURIComponent(message || "This login method is not configured on the server");
      } else if (error.includes('auth_failed')) {
        errorTitle = "Signup Failed";
        errorMessage = "Authentication failed. Please try again.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      
      // Clean up URL
      navigate('/signup', { replace: true });
    }
  }, [searchParams, toast, navigate]);

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50, cyan.50)",
    "linear(to-br, gray.900, blue.900, purple.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    if (!password) return { score: 0, label: "", color: "gray" };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    if (checks.length) score += 20;
    if (checks.uppercase) score += 20;
    if (checks.lowercase) score += 20;
    if (checks.number) score += 20;
    if (checks.special) score += 20;

    let label = "";
    let color = "gray";

    if (score >= 80) {
      label = "Strong";
      color = "green";
    } else if (score >= 60) {
      label = "Good";
      color = "blue";
    } else if (score >= 40) {
      label = "Fair";
      color = "yellow";
    } else if (score > 0) {
      label = "Weak";
      color = "red";
    }

    return { score, label, color, checks };
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to Terms & Conditions",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      toast({
        title: "Success",
        description: "Account created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } else {
      toast({
        title: "Error",
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      display="flex"
      alignItems="center"
      py={12}
      px={4}
    >
      <Container maxW="480px">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <VStack spacing={8}>
            {/* Header */}
            <VStack spacing={1} textAlign="center" w="full">
              <Heading
                size="xl"
                fontWeight="bold"
                color={useColorModeValue("gray.800", "white")}
              >
                Create your account
              </Heading>
              <Text fontSize="md" color={useColorModeValue("gray.600", "gray.400")}>
                Start your journey with us today
              </Text>
            </VStack>

            {/* Signup Card */}
            <Box
              w="full"
              bg={cardBg}
              p={8}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="sm"
            >
              <form onSubmit={handleSubmit}>
                <VStack spacing={5}>
                  {/* Name Input */}
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Full Name
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiUser} color="gray.400" boxSize={4} />
                      </InputLeftElement>
                      <Input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        size="lg"
                        focusBorderColor="blue.500"
                        bg={useColorModeValue("white", "gray.700")}
                        borderRadius="lg"
                      />
                    </InputGroup>
                  </FormControl>

                  {/* Email Input */}
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Email
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiMail} color="gray.400" boxSize={4} />
                      </InputLeftElement>
                      <Input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        size="lg"
                        focusBorderColor="blue.500"
                        bg={useColorModeValue("white", "gray.700")}
                        borderRadius="lg"
                      />
                    </InputGroup>
                  </FormControl>

                  {/* Password Input */}
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Password
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiLock} color="gray.400" boxSize={4} />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        size="lg"
                        focusBorderColor="blue.500"
                        bg={useColorModeValue("white", "gray.700")}
                        borderRadius="lg"
                      />
                      <InputRightElement>
                        <IconButton
                          icon={<Icon as={showPassword ? FiEyeOff : FiEye} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Toggle password visibility"
                          color="gray.500"
                          _hover={{ bg: "transparent", color: "blue.500" }}
                        />
                      </InputRightElement>
                    </InputGroup>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <Box mt={3}>
                        <HStack justify="space-between" mb={1}>
                          <Text fontSize="xs" color="gray.500">
                            Password strength
                          </Text>
                          <Text fontSize="xs" fontWeight="semibold" color={`${passwordStrength.color}.500`}>
                            {passwordStrength.label}
                          </Text>
                        </HStack>
                        <Progress
                          value={passwordStrength.score}
                          size="sm"
                          colorScheme={passwordStrength.color}
                          borderRadius="full"
                          bg={useColorModeValue("gray.200", "gray.700")}
                        />

                        {/* Password Requirements */}
                        <List spacing={1} mt={3} fontSize="xs">
                          <ListItem color={passwordStrength.checks?.length ? "green.500" : "gray.500"}>
                            <ListIcon
                              as={passwordStrength.checks?.length ? FiCheck : FiX}
                              color={passwordStrength.checks?.length ? "green.500" : "gray.400"}
                            />
                            At least 8 characters
                          </ListItem>
                          <ListItem color={passwordStrength.checks?.uppercase ? "green.500" : "gray.500"}>
                            <ListIcon
                              as={passwordStrength.checks?.uppercase ? FiCheck : FiX}
                              color={passwordStrength.checks?.uppercase ? "green.500" : "gray.400"}
                            />
                            One uppercase letter
                          </ListItem>
                          <ListItem color={passwordStrength.checks?.lowercase ? "green.500" : "gray.500"}>
                            <ListIcon
                              as={passwordStrength.checks?.lowercase ? FiCheck : FiX}
                              color={passwordStrength.checks?.lowercase ? "green.500" : "gray.400"}
                            />
                            One lowercase letter
                          </ListItem>
                          <ListItem color={passwordStrength.checks?.number ? "green.500" : "gray.500"}>
                            <ListIcon
                              as={passwordStrength.checks?.number ? FiCheck : FiX}
                              color={passwordStrength.checks?.number ? "green.500" : "gray.400"}
                            />
                            One number
                          </ListItem>
                          <ListItem color={passwordStrength.checks?.special ? "green.500" : "gray.500"}>
                            <ListIcon
                              as={passwordStrength.checks?.special ? FiCheck : FiX}
                              color={passwordStrength.checks?.special ? "green.500" : "gray.400"}
                            />
                            One special character
                          </ListItem>
                        </List>
                      </Box>
                    )}
                  </FormControl>

                  {/* Confirm Password Input */}
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      Confirm Password
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiLock} color="gray.400" boxSize={4} />
                      </InputLeftElement>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        size="lg"
                        focusBorderColor="blue.500"
                        bg={useColorModeValue("white", "gray.700")}
                        borderRadius="lg"
                      />
                      <InputRightElement>
                        <IconButton
                          icon={<Icon as={showConfirmPassword ? FiEyeOff : FiEye} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label="Toggle password visibility"
                          color="gray.500"
                          _hover={{ bg: "transparent", color: "blue.500" }}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <Text fontSize="xs" color="red.500" mt={1}>
                        Passwords do not match
                      </Text>
                    )}
                  </FormControl>

                  {/* Terms & Conditions */}
                  <Checkbox
                    colorScheme="blue"
                    size="sm"
                    isChecked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    alignItems="flex-start"
                  >
                    <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")}>
                      I agree to the{" "}
                      <ChakraLink
                        as={Link}
                        to="/terms-of-service"
                        color="blue.500"
                        fontWeight="medium"
                        _hover={{ textDecor: "underline" }}
                      >
                        Terms of Service
                      </ChakraLink>{" "}
                      and{" "}
                      <ChakraLink
                        as={Link}
                        to="/privacy-policy"
                        color="blue.500"
                        fontWeight="medium"
                        _hover={{ textDecor: "underline" }}
                      >
                        Privacy Policy
                      </ChakraLink>
                    </Text>
                  </Checkbox>

                  {/* Signup Button */}
                  <Button
                    type="submit"
                    size="lg"
                    w="full"
                    colorScheme="blue"
                    isLoading={isLoading}
                    loadingText="Creating account..."
                    _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                    mt={2}
                  >
                    Create account
                  </Button>

                  {/* Divider */}
                  <HStack w="full" py={2}>
                    <Divider />
                    <Text fontSize="xs" color="gray.500" whiteSpace="nowrap" px={2}>
                      or continue with
                    </Text>
                    <Divider />
                  </HStack>

                  {/* Social Signup Buttons */}
                  <VStack w="full" spacing={3}>
                    {/* Google Sign In */}
                    <Button
                      w="full"
                      variant="outline"
                      leftIcon={<Icon as={FaGoogle} color="#EA4335" boxSize={5} />}
                      size="lg"
                      _hover={{ bg: useColorModeValue("gray.50", "gray.700"), transform: "translateY(-1px)", boxShadow: "md" }}
                      transition="all 0.2s"
                      onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                      borderColor={useColorModeValue("gray.300", "gray.600")}
                    >
                      Continue with Google
                    </Button>

                    {/* Facebook & GitHub Sign In */}
                    <HStack w="full" spacing={3}>
                      <Button
                        flex={1}
                        variant="outline"
                        leftIcon={<Icon as={FaFacebookF} color="#1877F2" boxSize={5} />}
                        size="lg"
                        _hover={{ bg: useColorModeValue("gray.50", "gray.700"), transform: "translateY(-1px)", boxShadow: "md" }}
                        transition="all 0.2s"
                        onClick={() => window.location.href = 'http://localhost:5000/api/auth/facebook'}
                        borderColor={useColorModeValue("gray.300", "gray.600")}
                      >
                        Facebook
                      </Button>
                      <Button
                        flex={1}
                        variant="outline"
                        leftIcon={<Icon as={FaGithub} boxSize={5} />}
                        size="lg"
                        _hover={{ bg: useColorModeValue("gray.50", "gray.700"), transform: "translateY(-1px)", boxShadow: "md" }}
                        transition="all 0.2s"
                        onClick={() => window.location.href = 'http://localhost:5000/api/auth/github'}
                        borderColor={useColorModeValue("gray.300", "gray.600")}
                      >
                        GitHub
                      </Button>
                    </HStack>
                  </VStack>
                </VStack>
              </form>
            </Box>

            {/* Login Link */}
            <HStack spacing={1} fontSize="sm">
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                Already have an account?
              </Text>
              <ChakraLink
                as={Link}
                to="/login"
                color="blue.500"
                fontWeight="semibold"
                _hover={{ color: "blue.600", textDecor: "none" }}
              >
                Sign in
              </ChakraLink>
            </HStack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
