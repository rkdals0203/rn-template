import React, { useEffect, useRef, } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  View,
  Text
} from 'react-native';

interface AddItemMenuProps {
  visible: boolean;
  onClose: () => void;
  onCreateFolder: () => void;
  onPickDocument: () => void;
}

export const AddItemMenu: React.FC<AddItemMenuProps> = ({
  visible,
  onClose,
  onCreateFolder,
  onPickDocument
}) => {
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (!visible) onClose();
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0]
              })
            }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={onCreateFolder}
        >
          <Text style={styles.menuText}>Create Folder</Text>
        </TouchableOpacity>
        <View style={styles.menuDivider} />
        <TouchableOpacity
          style={styles.menuItem}
          onPress={onPickDocument}
        >
          <Text style={styles.menuText}>Add Presentation</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 34,
  },
  menuItem: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '400',
  },
  menuDivider: {
    height: 0.5,
    backgroundColor: '#48484A',
  },
});
