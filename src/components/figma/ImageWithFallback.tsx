import React, { useState } from 'react';
import { Image, View, StyleSheet, ImageProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageWithFallbackProps extends Omit<ImageProps, 'source'> {
  src: string;
  alt?: string;
}

export function ImageWithFallback({ src, alt, style, ...rest }: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  return (
    <View style={[styles.container, style]}>
      {didError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="image-outline" size={44} color="#d1d5db" />
        </View>
      ) : (
        <Image 
          source={{ uri: src }} 
          style={[styles.image, style]}
          onError={handleError}
          resizeMode="cover"
          {...rest}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
