import {
  Box,
  VStack,
  HStack,
  Select,
  Text,
  Button,
  Spinner,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import ReviewItem from './ReviewItem';
import RatingSummary from './RatingSummary';

const ReviewsList = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: '0.0',
    count: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(5);

  const bgColor = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [reviews, filterRating, sortBy]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/reviews/product/${productId}`
      );
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
        setStats({
          averageRating: data.averageRating,
          count: data.count,
          ratingDistribution: data.ratingDistribution,
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...reviews];

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(filterRating)
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
        break;
      default:
        break;
    }

    setFilteredReviews(filtered);
    setVisibleCount(5); // Reset visible count when filters change
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="cyan.500" thickness="4px" />
      </Center>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Rating Summary */}
        {stats.count > 0 && (
          <RatingSummary
            averageRating={stats.averageRating}
            totalReviews={stats.count}
            ratingDistribution={stats.ratingDistribution}
          />
        )}

        {/* Filters and Sort */}
        {stats.count > 0 && (
          <HStack
            spacing={4}
            p={4}
            bg={bgColor}
            borderRadius="md"
            flexWrap="wrap"
          >
            <HStack>
              <Text fontSize="sm" fontWeight="medium">
                Filter:
              </Text>
              <Select
                size="sm"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                w="140px"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </Select>
            </HStack>

            <HStack>
              <Text fontSize="sm" fontWeight="medium">
                Sort by:
              </Text>
              <Select
                size="sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                w="160px"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </Select>
            </HStack>

            <Text fontSize="sm" color="gray.600" ml="auto">
              Showing {Math.min(visibleCount, filteredReviews.length)} of{' '}
              {filteredReviews.length} reviews
            </Text>
          </HStack>
        )}

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <Center py={10}>
            <VStack spacing={3}>
              <Text fontSize="xl" color="gray.500">
                {stats.count === 0
                  ? 'No reviews yet'
                  : 'No reviews match your filter'}
              </Text>
              <Text fontSize="sm" color="gray.400">
                {stats.count === 0 && 'Be the first to review this product!'}
              </Text>
            </VStack>
          </Center>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredReviews.slice(0, visibleCount).map((review) => (
              <ReviewItem
                key={review._id}
                review={review}
                onHelpfulClick={fetchReviews}
              />
            ))}
          </VStack>
        )}

        {/* Load More Button */}
        {filteredReviews.length > visibleCount && (
          <Center>
            <Button
              onClick={handleLoadMore}
              variant="outline"
              colorScheme="cyan"
            >
              Load More Reviews ({filteredReviews.length - visibleCount} remaining)
            </Button>
          </Center>
        )}
      </VStack>
    </Box>
  );
};

export default ReviewsList;
