import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { useAuth } from '../../hooks/useAuth';
import Logger from '../../utils/logger';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  // State Management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Hooks
  const navigation = useNavigation();
  const { login, isLoading, error } = useAuth();

  // Lifecycle
  useEffect(() => {
    Logger.info('LoginScreen mounted');
    return () => Logger.info('LoginScreen unmounted');
  }, []);

  // Form Validation
  const validateForm = useCallback((): boolean => {
    Logger.info('Validating login form');
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    Logger.info('Form validation result', { isValid });
    return isValid;
  }, [email, password]);

  // Event Handlers
  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      Logger.warn('Login form validation failed');
      return;
    }

    Logger.info('Attempting login', { email });
    const success = await login({ email, password });
    
    if (success) {
      Logger.info('Login successful, navigating to home');
      navigation.navigate('Home');
    } else if (error) {
      Logger.error('Login failed', { error });
      Alert.alert('Login Failed', error);
    }
  }, [validateForm, login, error, navigation, email, password]);

  // UI Handlers
  const handleForgotPassword = useCallback(() => {
    Logger.info('Navigate to forgot password');
    // TODO: Implement forgot password
  }, []);

  const handleSignUp = useCallback(() => {
    Logger.info('Navigate to registration');
    navigation.navigate('Register');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <AppInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <AppInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <AppButton
            title="Forgot Password?"
            variant="secondary"
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          />

          <AppButton
            title={isLoading ? 'Signing In...' : 'Sign In'}
            onPress={handleLogin}
            disabled={isLoading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <AppButton
              title="Sign Up"
              variant="secondary"
              style={styles.signUpButton}
              onPress={handleSignUp}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666666',
    fontSize: 14,
    marginRight: 8,
  },
  signUpButton: {
    backgroundColor: 'transparent',
    height: 30,
    paddingHorizontal: 0,
  },
});