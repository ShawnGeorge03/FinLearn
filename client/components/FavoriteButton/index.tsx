'use client';

import { StarIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';

interface FavoriteButtonProps {
  color: string;
  onClickButton: any;
  size: 'sm' | 'md' | 'lg';
}

const FavoriteButton = ({
  color,
  onClickButton,
  size,
}: FavoriteButtonProps) => {
  return (
    <IconButton
      aria-label="favorite"
      colorScheme={color}
      icon={<StarIcon />}
      isRound={true}
      onClick={onClickButton}
      size={size}
    />
  );
};

export default FavoriteButton;
