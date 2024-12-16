import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useEffect } from 'react';
import { style } from '../../styles';


interface ItemModalProps {
  modalVisible: boolean;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
  editingType: 'presentation' | 'folder' | null;
  editingId: string | null;
  deleteItem: (itemType: 'presentation' | 'folder', itemId: string) => Promise<void>;
  renameItem: (itemType: 'presentation' | 'folder', itemId: string, newTitle: string) => Promise<void>;
  setModalVisible: () => void; 
  slideAnim: Animated.Value;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  modalVisible,
  editingTitle,
  setEditingTitle,
  editingType,
  editingId,
  setModalVisible,
  slideAnim,
  deleteItem,
  renameItem
}) => {

  useEffect(() => {
    if (modalVisible) {
      slideAnim.setValue(0);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', (e) => {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleCancel = () => setModalVisible();
  
  const handleDelete = async () => {
    if (!editingType || !editingId) return;
    
    Alert.alert(
      'Delete Confirmation',
      `Are you sure you want to delete this ${editingType === 'presentation' ? 'presentation' : 'folder'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(editingType, editingId);
              setModalVisible();
            } catch (error) {
              Alert.alert('error', 'Failed to delete.');
            }
          }
        }
      ]
    );
  };

  const handleCompleteSave = async () => {
    try {
      if (!editingType || !editingId) return;
      
      await renameItem(editingType, editingId, editingTitle);
      setModalVisible(); // 성공 후 모달 닫기
    } catch (error) {
      Alert.alert('error', 'Failed to save.');
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0]
  });

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={handleCancel}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <Animated.View 
                style={[
                  styles.modalContent,
                  {
                    transform: [{ translateY }]
                  }
                ]}
              >
                <View style={styles.inputContainer}>
                  <TextInput
                    value={editingTitle}
                    onChangeText={setEditingTitle}
                    style={styles.modalInput}
                    autoFocus={false}
                    selectionColor={style.colors.primary.mainDarker}
                    placeholderTextColor="#666"
                  />
                  {editingTitle && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => setEditingTitle('')}
                    >
                      <Text style={styles.clearButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDelete}
                  >
                    <Text style={[styles.buttonText, { color: style.colors.error }]}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.button, styles.completeButton]}
                    onPress={handleCompleteSave}
                  >
                    <Text style={[styles.buttonText, { color: style.colors.primary.mainDarker }]}>Complete</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginBottom: 16,
    position: 'relative',
    padding: 4,
  },
  modalInput: {
    color: '#FFFFFF',
    fontSize: 17,
    padding: 12,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 17,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  button: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  deleteButton: {
    marginBottom: 8,
  },
  completeButton: {
    backgroundColor: '#1C1C1E',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
});