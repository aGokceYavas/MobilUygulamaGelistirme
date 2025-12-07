// Navigasyon kütüphanelerini çağırıyoruz
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Kendi ekranlarımızı çağırıyoruz
import AnaEkran from './src/screens/AnaEkran';
import RaporEkrani from './src/screens/RaporEkrani';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Üstteki başlığı gizle
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Ana Sayfa') {
              iconName = focused ? 'timer' : 'timer-outline';
            } else if (route.name === 'Raporlar') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue', // Hocan maviyi seviyor (innerText: 'blue')
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Ana Sayfa" component={AnaEkran} />
        <Tab.Screen name="Raporlar" component={RaporEkrani} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}