import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function CameraScreen() {
  const router = useRouter();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // 権限ロード中
  if (!permission) {
    return <View />;
  }

  // 権限が許可されていない場合
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>カメラの使用許可が必要です</Text>
        <Button onPress={requestPermission} title="許可する" />
      </View>
    );
  }

  // カメラの向きを切り替える
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // 写真を撮影する
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7, // 画質 (0.0 - 1.0)
          base64: false,
          skipProcessing: true, // Androidでの撮影スピード向上
        });
        
        if (photo) {
          setPhotoUri(photo.uri); // 撮影した画像のURIを保存
        }
      } catch (error) {
        console.error("撮影エラー:", error);
      }
    }
  };

  // 撮影後のプレビュー画面
  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        <View style={styles.previewButtons}>
          <Button title="再撮影" onPress={() => setPhotoUri(null)} />
          <Button title="保存/使用" onPress={() => {
            // ここでAPIに送信したり、前の画面にデータを渡したりします
            console.log("Photo saved:", photoUri);
            router.back();
          }} />
        </View>
      </View>
    );
  }

  // カメラ画面
  return (
    <View style={styles.container}>
      {/* ヘッダー設定（必要に応じて） */}
      <Stack.Screen options={{ title: 'カメラ', headerShown: false }} />

      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}
      >
        <View style={styles.buttonContainer}>
          {/* 反転ボタン */}
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>反転</Text>
          </TouchableOpacity>

          {/* シャッターボタン */}
          <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>

          {/* 戻るボタン（または空のViewでレイアウト調整） */}
          {/* <View style={styles.button}></View> */}
          {/* <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.text}>閉じる</Text>
          </TouchableOpacity> */}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-around', // ボタンを均等配置
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  // シャッターボタンのデザイン
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  },
  // プレビュー画面用
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
  },
});