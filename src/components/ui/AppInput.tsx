import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

interface AppInputProps extends TextInputProps {
  error?: string;
}

export const AppInput: React.FC<AppInputProps> = ({ error, style, ...props }) => {
  return (
    <TextInput
      style={[
        styles.input,
        error && styles.inputError,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  inputError: {
    borderColor: '#ff0000',
  },
});