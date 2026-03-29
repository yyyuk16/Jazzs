import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView, 
} from 'react-native';
import { Stack } from 'expo-router';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as SplashScreen from 'expo-splash-screen';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import { healthCheckApi } from '@/api/endpoints/healthCheck';
import { Spot, ChatRequest } from '@/api/types';
import { RecommendPlacesButton } from '@/components/RecommendPlacesButton';
import { useLocationTracker } from '@/hooks/useLocationTracker';
import { Eyecatch } from '@/components/Eyecatch';
import { AIChatInput } from '@/components/AIChatInput';
import { chatApi } from '@/api/endpoints/chatApi';

SplashScreen.preventAutoHideAsync();

type BootPhase = 'setup' | 'eyecatch' | 'main';

export default function Index() {
  // ★ 修正: バックエンドがまとめてくれるので Spot[] 型でOK
  const [places, setPlaces] = useState<Spot[]>([]);
  
  const [phase, setPhase] = useState<BootPhase>('setup');
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [searchLimit, setSearchLimit] = useState<number>(5);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([])
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const LIMIT_OPTIONS = [5, 10, 20];
  
    const mapRef = useRef<MapView>(null);

  const { location, errorMsg } = useLocationTracker(isPermissionGranted);

  // ヘルスチェック
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await healthCheckApi.getHealth();
        if(result.status === 'ok') {
          console.log('success connection to backend');
        } else {
          console.log('false connection to backend');
        }
      } catch (e) {
        console.log('connection error');
      }
    };
    checkHealth();
  }, []);

  // 初期化プロセス
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.hideAsync();
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert("エラー", "位置情報の許可が必要です");
        }
        setIsPermissionGranted(true);
      } catch (e) {
        console.warn(e);
      } finally {
        setPhase('eyecatch');
      }
    }
    prepare();
  }, []);

  // スポットデータ(places)が更新されたら、全体が映るようにズームする
  useEffect(() => {
    if (places.length > 0 && mapRef.current) {
      // 少し遅延させると地図の準備が整ってから動くので安定します
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          // 合わせたい座標リスト（現在地も含めると親切）
          [
            { latitude: location!.latitude, longitude: location!.longitude }, // 現在地
            ...places.map(p => ({ latitude: p.latitude, longitude: p.longitude })) // スポット
          ],
          {
            edgePadding: { top: 100, right: 50, bottom: 200, left: 50 }, // 余白（下のボタンとかぶらないようにbottomを多めに）
            animated: true,
          }
        );
      }, 500);
    }
  }, [places]); // placesが変わるたびに実行

  const handleSendChat = async (text: string) => {
    setChatMessages(prev => [...prev, `User: ${text}`]);

    if (!location) {
      setChatMessages(prev => [...prev, `System: 位置情報が取得できていません。`]);
      return;
    }

    setIsChatLoading(true);

    try {
      // 2. バックエンドAPIを呼び出し
      const requestData: ChatRequest = {
        chat_text: text,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const response = await chatApi.recommend(requestData);

      // 3. AIの返信を表示 (理由)
      setChatMessages(prev => [...prev, `AI: ${response.reason}`]);

      // 4. 地図上のスポットを更新
      // おすすめスポットを目立たせるために、descriptionに理由を入れたりしてもOK
      const allSpots = response.candidates;
      console.log(allSpots);
      setPlaces(allSpots); // 地図のピンを更新！

      // おすすめスポットの場所に地図を移動させるとさらに良し
      // (mapRefなどを使って animateToRegion する実装も検討できます)

    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, `System: エラーが発生しました。もう一度お試しください。`]);
    } finally {
      setIsChatLoading(false);
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, `AI: 「${text}」についての情報を探しますね。`]);
    }, 1000);
  };

  // 権限確認中画面用
  if( phase === 'setup') {
    return (
      <View style={styles.whiteScreen}>
        <Stack.Screen options={{ headerShown: false }} />
      </View>
    );
  }
  
  // アイキャッチ表示用
  if (phase === 'eyecatch') {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <Eyecatch
          onFinish={() => {
            setPhase('main')
          }}
          />
      </>
    );
  }
  
  // 現在地取得中用
  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#DA8B3C" />
        <Text>現在地を取得中...</Text>
        {errorMsg && <Text style={{color: 'red'}}>{errorMsg}</Text>}
      </View>
    );
  }
  
  // メイン画面表示用
  return (
    <View style={styles.container}>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="現在地"
          description="ここにいます"
          pinColor="#DA8B3C"
        />

        {/* 取得したスポットを表示 */}
        {places.map((spot, index) => (
          <Marker
            key={`spot-${index}`}
            coordinate={{
              latitude: spot.latitude,
              longitude: spot.longitude,
            }}
            pinColor="white"
          >
            {/* descriptionプロパティを使わず、Calloutを子要素にする */}
            <Callout tooltip={true} style={styles.calloutLayer}>
              <View style={styles.bubble}>
                <Text style={styles.title}>{spot.name}</Text>
                {/* numberOfLinesで表示行数を制限 */}
                <Text style={styles.description}>
                  {spot.description}
                </Text>
              </View>
              {/* <View style={styles.arrowBorder} />
              <View style={styles.arrow} /> */}
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      {/* 周辺検索ボタン */}
      <View style={styles.controlsContainer}>
        {/* 件数選択ボタン */}
        <View style={styles.selectorContainer}>
          <Text style={styles.label}>表示数:</Text>
          {LIMIT_OPTIONS.map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => setSearchLimit(num)}
              style={[
                styles.selectButton,
                searchLimit === num && styles.selectButtonActive
              ]}
            >
              <Text style={[
                styles.selectButtonText,
                searchLimit === num && styles.selectButtonTextActive
              ]}>
                {num}件
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 検索ボタン */}
        <RecommendPlacesButton
          limit={searchLimit}
          location={location}
          // シンプルな Spot[] を受け取る
          onSpotsFetched={(newSpots) => setPlaces(newSpots)}
        />
      </View>

      {/* チャットを開くボタン */}
      {!isChatVisible && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsChatVisible(true)}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={28} />
        </TouchableOpacity>
      )}

      {/* チャット */}
      <Modal
        visible={isChatVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsChatVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setIsChatVisible(false)}
          />

          <View style={styles.chatContent}>
            {/* ヘッダー */}
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>AIチャット</Text>
              <TouchableOpacity onPress={() => setIsChatVisible(false)}>
                <Ionicons name="close" size={24} color="#DA8B3C" />
              </TouchableOpacity>
            </View>

            {/* チャットログ */}
            <ScrollView style={styles.chatLog}>
              {chatMessages.length === 0 ? (
                <Text style={styles.emptyText}>どんな気分？どんなことがしたい？</Text>
              ) : (
                chatMessages.map((msg, idx) => (
                  <View key={idx} style={styles.messageBubble}>
                    <Text style={styles.messageText}>{msg}</Text>
                  </View>
                ))
              )}
              {isChatLoading && (
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color="#999" />
                  <Text style={styles.loadingText}>AIが考え中...</Text>
                </View>
              )}
            </ScrollView>

            {/* サジェストチップ&テキストボックス */}
            <AIChatInput
              onSend={handleSendChat}
              suggestions={["おなかがすいてきたな","大学生4人くらいで遊べる場所ある？","ゆっくりお散歩したいな"]}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  whiteScreen: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '90%',
    maxWidth: 400,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  selectButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectButtonActive: {
    backgroundColor: '#DA8B3C',
    borderColor: '#DA8B3C',
  },
  selectButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  selectButtonTextActive: {
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 120, // 検索ボタンの上に配置
    backgroundColor: '#DA8B3C',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  chatContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%', // 画面半分
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatLog: {
    flex: 1,
    padding: 15,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  messageBubble: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  loadingText: {
    marginLeft: 8,
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },
  // Callout全体のラッパー
  calloutLayer: {
    alignItems: 'center', // 矢印を中央に寄せる
    justifyContent: 'center',
  },
  // 吹き出し本体
  bubble: {
    width: 280, // ★重要: 横幅を制限して折り返させる
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    // 影をつける（iOS）
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // 影をつける（Android）
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18, // 行間を少し開けると読みやすい
  },
  // 以下、吹き出しの矢印（▼）を作るためのスタイル
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
});