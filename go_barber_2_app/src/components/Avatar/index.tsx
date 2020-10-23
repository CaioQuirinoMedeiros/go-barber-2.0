import React, { useMemo, useState } from 'react';
import { Image } from 'react-native';

import { AvatarProps } from './props';
import { AvatarContainer, AvatarIniciais } from './styles';

const Avatar: React.FC<AvatarProps> = props => {
  const { nome, size = 112, style, ...rest } = props;

  const [hideIniciais, setHideIniciais] = useState(false);

  const iniciais = useMemo(() => {
    const nomesArray = nome.split(' ');

    const primeiraLetra = nomesArray[0].charAt(0);
    const segundaLetra = nomesArray[1]
      ? nomesArray[1].charAt(0)
      : nomesArray[0].charAt(1);

    return `${primeiraLetra}${segundaLetra}`.toUpperCase();
  }, [nome]);

  return (
    <AvatarContainer size={size} style={style}>
      {!hideIniciais && (
        <AvatarIniciais style={{ fontSize: size / 3 }} bold>
          {iniciais}
        </AvatarIniciais>
      )}
      <Image
        style={{ height: size, width: size, borderRadius: size }}
        onLoad={e => {
          if (e.nativeEvent.source.width > 1) {
            setHideIniciais(true);
          }
        }}
        {...rest}
      />
    </AvatarContainer>
  );
};

export default Avatar;
