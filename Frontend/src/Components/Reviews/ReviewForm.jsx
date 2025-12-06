import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Icon,
  Text,
  useToast,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    rating: 0,
    title: '',
    comment: '',
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleStarClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (!formData.userName || !formData.userEmail || !formData.title || !formData.comment) {
      toast({
        title: 'All Fields Required',
        description: 'Please fill in all fields',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Review Submitted! ⭐',
          description: 'Thank you for your feedback!',
          status: 'success',
          duration: 3000,
        });

        // Reset form
        setFormData({
          userName: '',
          userEmail: '',
          rating: 0,
          title: '',
          comment: '',
        });

        // Callback to refresh reviews
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Please try again',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="md"
    >
      <Heading size="md" mb={6}>
        Write a Review
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          {/* Star Rating */}
          <FormControl isRequired>
            <FormLabel>Your Rating</FormLabel>
            <HStack spacing={2}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  as={FaStar}
                  boxSize={8}
                  color={
                    star <= (hoveredStar || formData.rating) ? 'yellow.400' : 'gray.300'
                  }
                  cursor="pointer"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  transition="all 0.2s"
                  _hover={{ transform: 'scale(1.1)' }}
                />
              ))}
              {formData.rating > 0 && (
                <Text ml={2} color="gray.600">
                  {formData.rating} Star{formData.rating !== 1 ? 's' : ''}
                </Text>
              )}
            </HStack>
          </FormControl>

          {/* Name */}
          <FormControl isRequired>
            <FormLabel>Your Name</FormLabel>
            <Input
              name="userName"
              placeholder="John Doe"
              value={formData.userName}
              onChange={handleChange}
            />
          </FormControl>

          {/* Email */}
          <FormControl isRequired>
            <FormLabel>Your Email</FormLabel>
            <Input
              name="userEmail"
              type="email"
              placeholder="john@example.com"
              value={formData.userEmail}
              onChange={handleChange}
            />
          </FormControl>

          {/* Review Title */}
          <FormControl isRequired>
            <FormLabel>Review Title</FormLabel>
            <Input
              name="title"
              placeholder="Summarize your experience"
              maxLength={100}
              value={formData.title}
              onChange={handleChange}
            />
          </FormControl>

          {/* Review Comment */}
          <FormControl isRequired>
            <FormLabel>Your Review</FormLabel>
            <Textarea
              name="comment"
              placeholder="Share your thoughts about this product..."
              rows={5}
              maxLength={1000}
              value={formData.comment}
              onChange={handleChange}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              {formData.comment.length}/1000 characters
            </Text>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="cyan"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            Submit Review
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ReviewForm;
