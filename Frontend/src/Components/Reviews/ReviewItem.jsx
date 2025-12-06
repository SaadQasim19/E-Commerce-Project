import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  IconButton,
  useColorModeValue,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useState } from 'react';
import StarRating from '../StarRating';

const ReviewItem = ({ review, onHelpfulClick }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();

  const handleHelpfulClick = async (helpful) => {
    if (hasVoted) {
      toast({
        title: 'Already Voted',
        description: 'You have already voted on this review',
        status: 'info',
        duration: 2000,
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/reviews/${review._id}/helpful`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ helpful }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setHasVoted(true);
        toast({
          title: 'Thank you!',
          description: 'Your feedback has been recorded',
          status: 'success',
          duration: 2000,
        });

        // Callback to refresh reviews
        if (onHelpfulClick) {
          onHelpfulClick();
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={3}>
        {/* Header: Rating and Date */}
        <HStack justify="space-between" flexWrap="wrap">
          <HStack>
            <StarRating rating={review.rating} size={18} />
            {review.verifiedPurchase && (
              <Badge colorScheme="green" fontSize="xs">
                ✓ Verified Purchase
              </Badge>
            )}
          </HStack>
          <Text fontSize="sm" color="gray.500">
            {formatDate(review.createdAt)}
          </Text>
        </HStack>

        {/* Review Title */}
        <Text fontWeight="bold" fontSize="lg">
          {review.title}
        </Text>

        {/* Reviewer Name */}
        <Text fontSize="sm" color="gray.600">
          by <strong>{review.userName}</strong>
        </Text>

        {/* Review Comment */}
        <Text color="gray.700" _dark={{ color: 'gray.300' }}>
          {review.comment}
        </Text>

        <Divider />

        {/* Helpful Section */}
        <HStack justify="space-between" flexWrap="wrap">
          <HStack spacing={4}>
            <Text fontSize="sm" color="gray.600">
              Was this helpful?
            </Text>
            <HStack spacing={2}>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<FaThumbsUp />}
                colorScheme="green"
                onClick={() => handleHelpfulClick(true)}
                isDisabled={hasVoted}
              >
                Yes ({review.helpfulVotes})
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<FaThumbsDown />}
                colorScheme="red"
                onClick={() => handleHelpfulClick(false)}
                isDisabled={hasVoted}
              >
                No ({review.notHelpfulVotes})
              </Button>
            </HStack>
          </HStack>

          {/* Review Age */}
          <Text fontSize="xs" color="gray.500">
            {review.reviewAge || 'Recently posted'}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ReviewItem;
