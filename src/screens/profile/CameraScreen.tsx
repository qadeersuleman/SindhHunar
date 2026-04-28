import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
  type CameraRef,
  type CameraPosition,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CameraScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('back');
  const device = useCameraDevice(cameraPosition);
  const camera = useRef<CameraRef>(null);
  const photoOutput = usePhotoOutput();
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const flipCamera = () => {
    setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'));
  };

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Icon name="camera-off-outline" size={60} color="#800000" />
        <Text style={styles.text}>Camera permission is required</Text>
        <TouchableOpacity onPress={() => Linking.openSettings()} style={styles.button}>
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#800000" />
        <Text style={[styles.text, { marginTop: 12 }]}>Loading camera...</Text>
      </View>
    );
  }

  const takePhoto = async () => {
    try {
      if (photoOutput == null) return;
      setIsTakingPhoto(true);
      const photoFile = await photoOutput.capturePhotoToFile(
        { flashMode: 'off' },
        {}
      );
      setIsTakingPhoto(false);

      // Instead of calling a non-serializable function passed via params, 
      // navigate back and pass the URI as a parameter.
      navigation.navigate({
        name: 'PersonalInfo',
        params: { avatarUri: `file://${photoFile.filePath}` },
        merge: true,
      });
    } catch (e) {
      console.error(e);
      setIsTakingPhoto(false);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        outputs={[photoOutput]}
      />

      <SafeAreaView style={styles.overlay}>
        {/* Top Controls */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.controlBtn}>
            <Icon name="close" size={26} color="white" />
          </TouchableOpacity>

          {/* Flip Button */}
          <TouchableOpacity onPress={flipCamera} style={styles.controlBtn}>
            <Icon name="camera-reverse-outline" size={26} color="white" />
          </TouchableOpacity>
        </View>

        {/* Bottom Capture */}
        <View style={styles.bottomBar}>
          {/* Gallery shortcut */}
          <View style={styles.sideBtn} />

          {/* Shutter */}
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePhoto}
            disabled={isTakingPhoto}
            activeOpacity={0.8}
          >
            <View style={[styles.captureInner, isTakingPhoto && { backgroundColor: '#ccc' }]} />
          </TouchableOpacity>

          {/* Flip shortcut (bottom) */}
          <TouchableOpacity onPress={flipCamera} style={styles.sideBtn}>
            <Icon name="camera-reverse-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {isTakingPhoto && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Capturing...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    gap: 16,
  },
  text: { fontSize: 15, color: '#333', textAlign: 'center', paddingHorizontal: 30 },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#800000',
    borderRadius: 12,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  overlay: { flex: 1, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sideBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'white',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: { color: 'white', fontSize: 14 },
});

export default CameraScreen;
