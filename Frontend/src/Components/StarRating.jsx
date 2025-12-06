import { HStack, Icon } from '@chakra-ui/react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, size = 20, color = 'yellow.400', showNumber = false }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <HStack spacing={1}>
      {/* Full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <Icon key={`full-${index}`} as={FaStar} boxSize={`${size}px`} color={color} />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <Icon as={FaStarHalfAlt} boxSize={`${size}px`} color={color} />
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, index) => (
        <Icon key={`empty-${index}`} as={FaRegStar} boxSize={`${size}px`} color={color} />
      ))}

      {/* Optional number display */}
      {showNumber && (
        <span style={{ marginLeft: '8px', fontSize: `${size - 4}px` }}>
          {rating.toFixed(1)}
        </span>
      )}
    </HStack>
  );
};

export default StarRating;
