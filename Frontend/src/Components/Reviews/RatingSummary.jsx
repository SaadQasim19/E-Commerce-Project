import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';
import StarRating from '../StarRating';

const RatingSummary = ({ averageRating, totalReviews, ratingDistribution }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
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
      <VStack spacing={6} align="stretch">
        {/* Overall Rating */}
        <VStack spacing={2}>
          <Heading size="xl">{averageRating}</Heading>
          <StarRating rating={parseFloat(averageRating)} size={24} />
          <Text color="gray.600" fontSize="sm">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </Text>
        </VStack>

        {/* Rating Distribution */}
        <VStack spacing={3} align="stretch">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star] || 0;
            const percentage = getPercentage(count);

            return (
              <HStack key={star} spacing={3}>
                <HStack spacing={1} w="60px">
                  <Text fontSize="sm" fontWeight="medium">
                    {star}
                  </Text>
                  <Text fontSize="sm" color="yellow.400">
                    ★
                  </Text>
                </HStack>

                <Progress
                  value={percentage}
                  size="sm"
                  colorScheme="yellow"
                  flex={1}
                  borderRadius="full"
                  bg={useColorModeValue('gray.100', 'gray.700')}
                />

                <Text fontSize="sm" w="40px" textAlign="right" color="gray.600">
                  {count}
                </Text>
              </HStack>
            );
          })}
        </VStack>

        {/* Percentage Breakdown */}
        <VStack spacing={1} align="stretch" pt={2}>
          <HStack justify="space-between" fontSize="xs" color="gray.600">
            <Text>
              {Math.round(
                getPercentage((ratingDistribution[5] || 0) + (ratingDistribution[4] || 0))
              )}
              % Positive
            </Text>
            <Text>
              {Math.round(
                getPercentage((ratingDistribution[1] || 0) + (ratingDistribution[2] || 0))
              )}
              % Negative
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default RatingSummary;
