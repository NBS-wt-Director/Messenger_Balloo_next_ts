/**
 * Balloo SMS Node - Android Application
 * Отправка SMS OTP кодов через Android устройство
 * 
 * @author NBS-wt
 * @version 0.1.0
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// API Configuration
const DEFAULT_API_URL = 'https://api.working.balloo.su/sms';
const STORAGE_KEYS = {
  API_URL: '@balloo_sms_api_url',
  API_TOKEN: '@balloo_sms_api_token',
  SERVICE_ENABLED: '@balloo_sms_service_enabled',
};

interface SMSRequest {
  requestId: string;
  phone: string;
  code: string;
  timestamp: number;
}

export default function App() {
  // State
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [apiToken, setApiToken] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState<SMSRequest | null>(null);
  const [sentCount, setSentCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
    requestSMSPermission();
  }, []);

  // Poll for new SMS requests when enabled
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isEnabled && apiToken) {
      interval = setInterval(pollForSMS, 5000); // Poll every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEnabled, apiToken, apiUrl]);

  // Load settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const [storedUrl, storedToken, storedEnabled, storedStats] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.API_URL),
        AsyncStorage.getItem(STORAGE_KEYS.API_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.SERVICE_ENABLED),
        AsyncStorage.getItem('@balloo_sms_stats'),
      ]);

      if (storedUrl) setApiUrl(storedUrl);
      if (storedToken) setApiToken(storedToken);
      if (storedEnabled) setIsEnabled(storedEnabled === 'true');
      if (storedStats) {
        const stats = JSON.parse(storedStats);
        setSentCount(stats.sent || 0);
        setFailedCount(stats.failed || 0);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  // Save settings to AsyncStorage
  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.API_URL, apiUrl);
      await AsyncStorage.setItem(STORAGE_KEYS.API_TOKEN, apiToken);
      await AsyncStorage.setItem(STORAGE_KEYS.SERVICE_ENABLED, isEnabled.toString());
      await AsyncStorage.setItem(
        '@balloo_sms_stats',
        JSON.stringify({ sent: sentCount, failed: failedCount })
      );
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // Request SMS permission
  const requestSMSPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.SEND_SMS);
      
      if (result !== RESULTS.GRANTED) {
        Alert.alert(
          'Требуется разрешение',
          'Приложению необходимо разрешение на отправку SMS для работы.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  // Poll API for new SMS requests
  const pollForSMS = async () => {
    if (!apiToken || !isEnabled) return;

    try {
      const response = await fetch(`${apiUrl}/pending`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.pending && data.pending.length > 0) {
          await processSMSRequest(data.pending[0]);
        }
      }
    } catch (error) {
      console.error('Poll failed:', error);
    }
  };

  // Process SMS request
  const processSMSRequest = async (request: SMSRequest) => {
    try {
      setIsLoading(true);
      setLastRequest(request);

      // Send SMS via Android
      await sendSMS(request.phone, `Balloo OTP код: ${request.code}. Действует 5 мин.`);

      // Report success to API
      await reportStatus(request.requestId, 'sent');

      setSentCount(prev => prev + 1);
      await saveSettings();

      Alert.alert('Успешно', `SMS отправлено на ${request.phone}`);
    } catch (error) {
      console.error('SMS send failed:', error);
      setFailedCount(prev => prev + 1);
      await reportStatus(request.requestId, 'failed');
      await saveSettings();

      Alert.alert('Ошибка', 'Не удалось отправить SMS');
    } finally {
      setIsLoading(false);
    }
  };

  // Send SMS via Android
  const sendSMS = async (phone: string, message: string): Promise<void> => {
    // Using react-native-sms-android or similar library
    // This is a placeholder - actual implementation depends on the library
    return new Promise((resolve, reject) => {
      try {
        // Native SMS sending logic would go here
        console.log(`Sending SMS to ${phone}: ${message}`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  // Report status to API
  const reportStatus = async (requestId: string, status: 'sent' | 'failed') => {
    try {
      await fetch(`${apiUrl}/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, status }),
      });
    } catch (error) {
      console.error('Status report failed:', error);
    }
  };

  // Handle save
  const handleSave = async () => {
    setIsLoading(true);
    await saveSettings();
    setIsLoading(false);
    Alert.alert('Сохранено', 'Настройки сохранены');
  };

  // Handle test connection
  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
      });

      if (response.ok) {
        Alert.alert('Успешно', 'Соединение с API установлено');
      } else {
        Alert.alert('Ошибка', `API вернул статус: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎈 Balloo SMS Node</Text>
        <Text style={styles.subtitle}>Android SMS-узел для OTP</Text>
      </View>

      {/* Service Toggle */}
      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Сервис активен</Text>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{ false: '#767577', true: '#0066FF' }}
            thumbColor={isEnabled ? '#0039A6' : '#f4f3f4'}
          />
        </View>
        {isEnabled && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>🟢 Работает</Text>
          </View>
        )}
      </View>

      {/* API Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        
        <TextInput
          style={styles.input}
          placeholder="API URL"
          value={apiUrl}
          onChangeText={setApiUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="API Token"
          value={apiToken}
          onChangeText={setApiToken}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleTestConnection}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Тест соединения</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Статистика</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{sentCount}</Text>
            <Text style={styles.statLabel}>Отправлено</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>
              {failedCount}
            </Text>
            <Text style={styles.statLabel}>Ошибок</Text>
          </View>
        </View>
      </View>

      {/* Last Request */}
      {lastRequest && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Последний запрос</Text>
          <View style={styles.lastRequestCard}>
            <Text>Телефон: {lastRequest.phone}</Text>
            <Text>Время: {new Date(lastRequest.timestamp).toLocaleTimeString()}</Text>
          </View>
        </View>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      )}

      {/* Save Button */}
      <TouchableOpacity 
        style={[styles.button, styles.saveButton]} 
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Сохранить настройки</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          NBS-wt © 2026 • v0.1.0
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0039A6',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0066FF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#0039A6',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10B981',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  lastRequestCard: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
