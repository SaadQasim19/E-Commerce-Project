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
  useColorModeValue,
  useToast,
  Icon,
  Progress,
  List,
  ListItem,
  ListIcon,
  HStack,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { FiLock, FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import useAuthStore from "../Store/auth";

const MotionBox = motion(Box);

export default function ResetPasswordPage() {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { resetPassword, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50, cyan.50)",
    "linear(to-br, gray.900, blue.900, purple.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    const password = newPassword;
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
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const result = await resetPassword(resetToken, newPassword);

    if (result.success) {
      toast({
        title: "Success",
        description: "Password reset successful! You are now logged in.",
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
                Reset password
              </Heading>
              <Text fontSize="md" color={useColorModeValue("gray.600", "gray.400")}>
                Enter your new password below
              </Text>
            </VStack>

            {/* Reset Password Card */}
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
                  {/* New Password Input */}
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="medium" mb={2}>
                      New Password
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiLock} color="gray.400" boxSize={4} />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
                    {newPassword && (
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
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {confirmPassword && newPassword !== confirmPassword && (
                      <Text fontSize="xs" color="red.500" mt={1}>
                        Passwords do not match
                      </Text>
                    )}
                  </FormControl>

                  {/* Reset Button */}
                  <Button
                    type="submit"
                    size="lg"
                    w="full"
                    colorScheme="blue"
                    isLoading={isLoading}
                    loadingText="Resetting..."
                    _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                    mt={2}
                  >
                    Reset password
                  </Button>
                </VStack>
              </form>
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
