import {
  Box,
  Avatar,
  Button,
  VStack,
  HStack,
  Text,
  useToast,
  IconButton,
  Input,
  useColorModeValue,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { FiCamera, FiTrash2, FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";
import useAuthStore from "../Store/auth";
import { getAvatarUrl } from "../utils/helpers";

const MotionBox = motion(Box);

export default function AvatarUpload({ currentAvatar, onUploadSuccess, userName = "User" }) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(getAvatarUrl(currentAvatar) || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const { token } = useAuthStore();

  const borderColor = useColorModeValue("gray.300", "gray.600");
  const bgHover = useColorModeValue("gray.50", "gray.700");

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, GIF, WebP)",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 5MB",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an image to upload",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      // Prepare headers with token if available
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('http://localhost:5000/api/users/avatar', {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: formData,
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await res.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error("Server returned an invalid response. Please check if you're logged in.");
      }

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: "Profile picture uploaded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Call callback with new avatar URL
        if (onUploadSuccess) {
          onUploadSuccess(data.avatar);
        }

        setSelectedFile(null);
        setPreviewUrl(getAvatarUrl(data.avatar));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      // Reset preview on error
      setPreviewUrl(getAvatarUrl(currentAvatar) || "");
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setIsUploading(true);

    try {
      // Prepare headers with token if available
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('http://localhost:5000/api/users/avatar', {
        method: 'DELETE',
        headers: headers,
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: "Profile picture removed successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setPreviewUrl("");
        setSelectedFile(null);

        // Call callback
        if (onUploadSuccess) {
          onUploadSuccess("");
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(currentAvatar || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <VStack spacing={4} align="center">
      {/* Avatar Preview */}
      <MotionBox
        position="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Avatar
          size="2xl"
          name={userName}
          src={previewUrl}
          bg="blue.500"
          color="white"
        />
        
        {/* Camera Icon Button */}
        <IconButton
          icon={<FiCamera />}
          size="sm"
          colorScheme="blue"
          rounded="full"
          position="absolute"
          bottom="0"
          right="0"
          onClick={() => fileInputRef.current?.click()}
          isDisabled={isUploading}
        />

        {/* Loading Spinner */}
        {isUploading && (
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="blackAlpha.600"
            rounded="full"
          >
            <Spinner size="xl" color="white" />
          </Box>
        )}
      </MotionBox>

      {/* File Input (Hidden) */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        display="none"
        onChange={handleFileSelect}
      />

      {/* Info Text */}
      <Text fontSize="sm" color="gray.500" textAlign="center">
        {selectedFile ? (
          <Badge colorScheme="green">{selectedFile.name}</Badge>
        ) : (
          "Click camera icon to select image"
        )}
      </Text>

      {/* Action Buttons */}
      {selectedFile ? (
        <HStack spacing={2}>
          <Button
            leftIcon={<FiUpload />}
            colorScheme="blue"
            size="sm"
            onClick={handleUpload}
            isLoading={isUploading}
            loadingText="Uploading..."
          >
            Upload
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            isDisabled={isUploading}
          >
            Cancel
          </Button>
        </HStack>
      ) : previewUrl ? (
        <Button
          leftIcon={<FiTrash2 />}
          colorScheme="red"
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          isLoading={isUploading}
        >
          Remove Picture
        </Button>
      ) : (
        <Button
          leftIcon={<FiCamera />}
          colorScheme="blue"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose Picture
        </Button>
      )}

      {/* File Size Info */}
      <Text fontSize="xs" color="gray.400" textAlign="center">
        Max file size: 5MB • Supported: JPG, PNG, GIF, WebP
      </Text>
    </VStack>
  );
}
