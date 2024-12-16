import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Pressable, NativeSyntheticEvent, NativeScrollEvent, Linking, Alert, Image } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import CloseIcon from '../../assets/icons/icon_close.svg';
import AccountIcon from '../../assets/icons/icon_account.svg';
import LogoutIcon from '../../assets/icons/icon_logout.svg';
import FeedbackIcon from '../../assets/icons/icon_feedback.svg';
import PrivacyIcon from '../../assets/icons/icon_privacy.svg';
import TermsIcon from '../../assets/icons/icon_terms.svg';
import { supabase } from '../../lib/supabase';
import { FeedbackModal } from './FeedbackModal';
import { AccountModal } from './AccountModal';


interface SettingsMenuProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const SettingsMenu = ({ visible, onClose, onLogout }: SettingsMenuProps) => {
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    profileUrl?: string;
    provider?: string;
  } | null>(null);

  const translateY = useSharedValue(1000);
  const scrollOffset = useSharedValue(0);
  const isScrolledToTop = useSharedValue(true);
  const lastDragY = useSharedValue(0);
  const dragY = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    } else {
      translateY.value = 1000;
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setAccountModalVisible(false);
      setFeedbackModalVisible(false);
    }
  }, [visible]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    'worklet';
    if (!isScrolling.value) return;

    const offsetY = event.nativeEvent.contentOffset.y;
    scrollOffset.value = offsetY;
    isScrolledToTop.value = offsetY <= 0;

    if (!isScrolledToTop.value) {
      translateY.value = 0;
    }
  };

  const handleScrollBeginDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    'worklet';
    isScrolling.value = true;
    lastDragY.value = event.nativeEvent.contentOffset.y;
    dragY.value = 0;
    handleScroll(event);
  };

  const handleScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    'worklet';
    isScrolling.value = false;
    
    if (isScrolledToTop.value && dragY.value < -100) {
      translateY.value = withTiming(1000, {
        duration: 250,
      }, () => {
        runOnJS(onClose)();
      });
    } else {
      translateY.value = withSpring(0);
    }
    dragY.value = 0;
  };

  const handleScroll2 = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    'worklet';
    if (!isScrolling.value) return;
    
    handleScroll(event);
    
    if (isScrolledToTop.value) {
      const currentY = event.nativeEvent.contentOffset.y;
      dragY.value = currentY - lastDragY.value;
      if (dragY.value < 0) {
        translateY.value = -dragY.value;
      }
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) return;

        const provider = user.app_metadata?.provider || 'email';

        setUser({
          id: user.id,
          email: user.email,
          profileUrl: user.user_metadata?.avatar_url || null,
          provider: provider
        });

      } catch (error) {
        console.error('프로필 정보 로딩 오류:', error);
      }
    };

    if (visible) {
      getUser();
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleFeedback = () => {
    setFeedbackModalVisible(true);
  };

  const handlePrivacyPolicy = async () => {
    try {
      await Linking.openURL('https://vivid-consonant-f5c.notion.site/15177b4832a1808f9de4c85c30ba6fb4?pvs=74');
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not open the page',
        [{ text: 'Ok' }]
      );
    }
  };

  const handleTermsOfService = async () => {
    try {
      await Linking.openURL('https://vivid-consonant-f5c.notion.site/15177b4832a180a1b762d5d2a1e3186b?pvs=74');
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not open the page',
        [{ text: 'Ok' }]
      );
    }
  };

  const renderSection = (title: string, items: {
    label: string;
    onPress: () => void;
    color?: string;
    icon?: React.ReactNode;
  }[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.menuItem}
          onPress={item.onPress}
        >
          {item.icon && <View style={styles.iconContainer}>{item.icon}</View>}
          <Text style={[styles.menuItemText, item.color && { color: item.color }]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <>
      <Modal 
        visible={visible} 
        transparent 
        statusBarTranslucent 
        animationType="fade"
      >
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          <GestureHandlerRootView style={styles.gestureContainer}>
            <Animated.View style={[styles.modalContainer, animatedStyle]}>
              <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
                <Pressable style={styles.closeButton} onPress={onClose}>
                  <CloseIcon />
                </Pressable>
              </View>
              <Animated.ScrollView
                ref={scrollViewRef}
                style={styles.content}
                onScroll={handleScroll2}
                scrollEventThrottle={1}
                bounces={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScrollBeginDrag={handleScrollBeginDrag}
                onScrollEndDrag={handleScrollEndDrag}
                scrollToOverflowEnabled={true}
              >
                {renderSection('Account', [
                  { 
                    label: user?.email || 'Loading...', 
                    onPress: () => setAccountModalVisible(true),
                    icon: user?.profileUrl ? (
                      <Image 
                        source={{ uri: user.profileUrl }} 
                        style={styles.profileIcon}
                      />
                    ) : (
                      <AccountIcon width={24} height={24} />
                    )
                  },
                  { 
                    label: 'Log out', 
                    onPress: onLogout,
                    icon: <LogoutIcon width={24} height={24} />
                  }
                ])}
                {renderSection('Support', [
                  { 
                    label: 'Leave feedback', 
                    onPress: handleFeedback,
                    icon: <FeedbackIcon width={24} height={24} />
                  }
                ])}
                {renderSection('Legal', [
                  { 
                    label: 'Privacy policy', 
                    onPress: handlePrivacyPolicy,
                    icon: <PrivacyIcon width={24} height={24} />
                  },
                  { 
                    label: 'Terms of Service', 
                    onPress: handleTermsOfService,
                    icon: <TermsIcon width={24} height={24} />
                  }
                ])}
              </Animated.ScrollView>
            </Animated.View>
          </GestureHandlerRootView>

          {accountModalVisible && (
            <View style={styles.modalWrapper}>
              <AccountModal
                visible={accountModalVisible}
                onClose={() => setAccountModalVisible(false)}
                email={user?.email}
                profileUrl={user?.profileUrl}
                provider={user?.provider}
              />
            </View>
          )}

          {feedbackModalVisible && (
            <View style={styles.modalWrapper}>
              <FeedbackModal
                visible={feedbackModalVisible}
                onClose={() => setFeedbackModalVisible(false)}
              />
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  gestureContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  modalContainer: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: '85%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#666',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 17,
    color: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  modalWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
