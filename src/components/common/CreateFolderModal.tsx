import React, { Dispatch, SetStateAction } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  StyleSheet,
  Alert
} from 'react-native';
import { User, Folder } from '../../types';
import { style } from '../../styles';

interface FolderModalProps {
  folderModalVisible: boolean;
  setFolderModalVisible: (visible: boolean) => void;
  newFolderTitle: string;
  setNewFolderTitle: (title: string) => void;
  user: User | null;
  parentFolderId?: number | null;
  createFolder: (title: string) => Promise<Folder>;
}

export const FolderModal: React.FC<FolderModalProps> = ({
  folderModalVisible,
  setFolderModalVisible,
  newFolderTitle,
  setNewFolderTitle,
  user,
  createFolder
}) => {
  const handleCreateFolder = async () => {
    try {
      if (!user?.id) {
        Alert.alert('error', 'User not found');
        return;
      }

      if (!newFolderTitle.trim()) {
        Alert.alert('error', 'Please enter a folder name.');
        return;
      }

      await createFolder(newFolderTitle);
      setNewFolderTitle('');
      setFolderModalVisible(false);
    } catch (error) {
      Alert.alert('error', 'Failed to create folder.');
    }
  };

  

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={folderModalVisible}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => setFolderModalVisible(false)}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>New Folder</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <TextInput
                value={newFolderTitle}
                onChangeText={setNewFolderTitle}
                style={styles.modalInput}
                placeholder="Folder Name"
                placeholderTextColor={style.colors.text.placeholder}
                autoFocus={true}
                selectionColor={style.colors.primary.mainDarker}
              />
            </View>
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleCreateFolder}
            >
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    width: '80%',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  inputContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 16,
  },
  modalInput: {
    color: '#FFFFFF',
    fontSize: 17,
    padding: 16,
  },
  completeButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#007AFF',
  },
});
