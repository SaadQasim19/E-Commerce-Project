import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Button,
  Divider,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Icon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiShield, FiSave } from "react-icons/fi";
import AvatarUpload from "../../Components/AvatarUpload";
import useAuthStore from "../../Store/auth";

export default function AdminProfile() {
  const bg = useColorModeValue("white", "gray.800");
  const toast = useToast();

  const { user, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      // If no user, try to check auth
      if (!user) {
        await checkAuth();
      }
      setInitialLoading(false);
    };

    loadUserData();
  }, []);

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Handle avatar upload success
  const handleAvatarUpload = async (newAvatarUrl) => {
    // Refresh user data to get updated avatar
    await checkAuth();
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: "Profile updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Refresh user data
        await checkAuth();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Container maxW="container.lg" py={8}>
        <Card bg={bg}>
          <CardBody>
            <VStack spacing={4}>
              <Text>Unable to load user data. Please try logging in again.</Text>
              <Button colorScheme="blue" onClick={() => window.location.href = '/login'}>
                Go to Login
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={6}>
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="lg" mb={2}>
              Admin Profile
            </Heading>
            <Text color="gray.500">
              Manage your admin account settings and profile picture
            </Text>
          </Box>
          <Badge colorScheme="purple" fontSize="md" px={3} py={1} rounded="full">
            <HStack spacing={1}>
              <Icon as={FiShield} />
              <Text>Admin</Text>
            </HStack>
          </Badge>
        </HStack>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
        {/* Profile Picture Section */}
        <Card bg={bg} shadow="md">
          <CardHeader>
            <Heading size="md">Profile Picture</Heading>
          </CardHeader>
          <CardBody>
            <AvatarUpload
              currentAvatar={user.avatar}
              onUploadSuccess={handleAvatarUpload}
              userName={user.name}
            />
          </CardBody>
        </Card>

        {/* Profile Information Section */}
        <Box gridColumn={{ base: "1", lg: "2 / 4" }}>
          <Card bg={bg} shadow="md">
            <CardHeader>
              <Heading size="md">Profile Information</Heading>
              <Text fontSize="sm" color="gray.500" mt={1}>
                Update your personal information
              </Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>
                    <HStack>
                      <Icon as={FiUser} />
                      <Text>Full Name</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    placeholder="John Doe"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>
                    <HStack>
                      <Icon as={FiMail} />
                      <Text>Email Address</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Icon as={FiPhone} />
                      <Text>Phone Number</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="tel"
                    placeholder="+1 234-567-8900"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </FormControl>

                <Divider my={2} />

                <HStack justify="flex-end">
                  <Button
                    leftIcon={<FiSave />}
                    colorScheme="blue"
                    onClick={handleUpdateProfile}
                    isLoading={loading}
                    loadingText="Saving..."
                  >
                    Save Changes
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Account Info */}
          <Card bg={bg} shadow="md" mt={6}>
            <CardHeader>
              <Heading size="md">Account Information</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontSize="sm" color="gray.500">Account Type</Text>
                  <Badge colorScheme="purple" mt={1}>Administrator</Badge>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">Member Since</Text>
                  <Text fontWeight="medium" mt={1}>
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">Last Login</Text>
                  <Text fontWeight="medium" mt={1}>
                    {new Date(user.lastLogin).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">Account Status</Text>
                  <Badge colorScheme="green" mt={1}>Active</Badge>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
