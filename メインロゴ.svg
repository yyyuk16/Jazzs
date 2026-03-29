import { Stack } from "expo-router";
import { Image, View } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          headerTitleAlign: "center", // ロゴを中央寄せ
          headerShadowVisible: false, // 下線を消す（お好みで）
          headerStyle: {
            backgroundColor: '#ffffff', // 背景色
          },
          
          // ★ SVGの代わりに Image コンポーネントを使用
          headerTitle: () => (
            <Image
              // 画像パスを指定 (requireを使うのがポイント)
              source={require('@/assets/images/メインロゴ.png')}
              style={{
                width: 120,  // 表示したい幅
                height: 150,  // 表示したい高さ
              }}
              // 縦横比を崩さずに枠内に収める設定 (重要！)
              resizeMode="contain"
            />
          ),
        }}
      />
    </Stack>
  );
}