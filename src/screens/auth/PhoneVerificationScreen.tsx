import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import Logger from '../../utils/logger';

const OTP_LENGTH = 6;
const TIMER_DURATION = 30;
const PHONE_REGEX = /^[6-9]\d{9}$/;

export default function PhoneVerificationScreen() {
  // State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [timer, setTimer] = useState(TIMER_DURATION);

  // Refs
  const timerRef = useRef<NodeJS.Timeout>();

  // Hooks
  const navigation = useNavigation();
  const { verifyPhone, isLoading } = useAuth();

  // Lifecycle
  useEffect(() => {
    Logger.info('PhoneVerificationScreen mounted');
    return () => {
      Logger.info('PhoneVerificationScreen unmounted');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Validation
  const validatePhoneNumber = useCallback((number: string): boolean => {
    Logger.info('Validating phone number');
    return PHONE_REGEX.test(number);
  }, []);

  // Event Handlers
  const handleSendOtp = useCallback(async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Logger.warn('Invalid phone number attempt', { phoneNumber });
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit Indian mobile number');
      return;
    }

    Logger.info('Sending OTP', { phoneNumber });
    try {
      await verifyPhone(phoneNumber);
      setShowOtpInput(true);
      startTimer();
    } catch (error) {
      Logger.error('Failed to send OTP', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  }, [phoneNumber, validatePhoneNumber, verifyPhone]);

  const startTimer = useCallback(() => {
    Logger.info('Starting OTP timer');
    setTimer(TIMER_DURATION);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  }, []);

  // Refs for OTP inputs
  const otpInputs = useRef<Array<TextInput | null>>(new Array(OTP_LENGTH).fill(null));

  const handleOtpChange = useCallback((text: string, index: number) => {
    Logger.info('OTP input changed', { index });
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text.length === 1 && index < OTP_LENGTH - 1 && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleVerifyOtp = useCallback(async () => {
    const enteredOtp = otp.join('');
    Logger.info('Verifying OTP');
    
    if (enteredOtp.length !== OTP_LENGTH) {
      Logger.warn('Invalid OTP length');
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      // Here you would typically verify the OTP with your backend
      // For now, we'll just assume it's successful
      Logger.info('OTP verification successful');
      navigation.navigate('BusinessDetails');
    } catch (error) {
      Logger.error('OTP verification failed', error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    }
  }, [otp, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Number</Text>
          <Text style={styles.subtitle}>
            We'll send you a one-time password on your phone
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter mobile number"
              keyboardType="numeric"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {!showOtpInput ? (
            <TouchableOpacity
              style={[styles.button, !phoneNumber && styles.buttonDisabled]}
              onPress={handleSendOtp}
              disabled={!phoneNumber}
            >
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          ) : (
            <View>
              <Text style={styles.otpLabel}>Enter OTP</Text>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(input) => {
                      if (input) otpInputs.current[index] = input;
                    }}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                  />
                ))}
              </View>

              {timer > 0 ? (
                <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
              ) : (
                <TouchableOpacity onPress={handleSendOtp}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, !otp.every(Boolean) && styles.buttonDisabled]}
                onPress={handleVerifyOtp}
                disabled={!otp.every(Boolean)}
              >
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
            </View>
          )}
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
    fontSize: 28,
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
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  countryCode: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  otpLabel: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
    marginTop: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
  },
  timerText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});