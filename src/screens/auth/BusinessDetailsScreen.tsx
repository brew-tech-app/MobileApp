import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { requestLocationPermission, getCurrentLocation } from '../../utils/locationPermissions';

export default function BusinessDetailsScreen() {
  const [formData, setFormData] = useState({
    organizationName: '',
    gstin: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const validateGSTIN = (gstin: string) => {
    // GSTIN Format: 2 digits state code + 10 digits PAN + 1 digit entity number + 1 digit check sum
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const validatePincode = (pincode: string) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
  };

  const handleSubmit = () => {
    // Validate organization name
    if (!formData.organizationName.trim()) {
      Alert.alert('Error', 'Please enter organization name');
      return;
    }

    // Validate GSTIN
    if (!validateGSTIN(formData.gstin)) {
      Alert.alert('Error', 'Please enter a valid GSTIN number');
      return;
    }

    // Validate address
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter address');
      return;
    }

    // Validate city
    if (!formData.city.trim()) {
      Alert.alert('Error', 'Please enter city');
      return;
    }

    // Validate state
    if (!formData.state.trim()) {
      Alert.alert('Error', 'Please enter state');
      return;
    }

    // Validate pincode
    if (!validatePincode(formData.pincode)) {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
      return;
    }

    // If all validations pass, proceed with submission
    handleRequestLocationPermission();
  };

  const navigation = useNavigation();

  const handleRequestLocationPermission = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        const location = await getCurrentLocation();
        if (location) {
          // TODO: Save all details including location to your backend
          // For now, just navigate to Home
          navigation.navigate('Home');
        }
      }
    } catch (error) {
      console.error('Error handling location:', error);
      Alert.alert('Error', 'Failed to get location. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Business Details</Text>
            <Text style={styles.subtitle}>Please fill in your business information</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Organization Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter organization name"
                value={formData.organizationName}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, organizationName: text }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>GSTIN Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter GSTIN number"
                value={formData.gstin}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, gstin: text.toUpperCase() }))
                }
                autoCapitalize="characters"
                maxLength={15}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter address"
                value={formData.address}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, address: text }))
                }
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter city"
                  value={formData.city}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, city: text }))
                  }
                />
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter state"
                  value={formData.state}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, state: text }))
                  }
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter pincode"
                value={formData.pincode}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, pincode: text }))
                }
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit & Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});