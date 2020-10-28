import React, { ImgHTMLAttributes, useMemo } from 'react';

import { AvatarContainer } from './styles';

type AvatarProps = ImgHTMLAttributes<HTMLImageElement> & {
  size?: number;
  name: string;
};

const Avatar: React.FC<AvatarProps> = props => {
  const { src, name, size = 56, ...rest } = props;

  const avatarPlaceholderUrl = useMemo(() => {
    return `https://ui-avatars.com/api/?bold=true&background=232129&color=fff&size=${size}&name=${name.replace(
      /\s/g,
      '+'
    )}`;
  }, [name, size]);

  return (
    <AvatarContainer
      size={size}
      {...rest}
      src={src || avatarPlaceholderUrl}
      alt={name}
    />
  );
};

export default Avatar;
