import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#df9a1bff',
        tabBarPosition: 'top',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'マップ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'カメラ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'camera-sharp' : 'camera-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  )
}