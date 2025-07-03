import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "./Supabase/Supabase";
import { useEffect } from "react";

import ChatScreen from "./screens/ChatScreen";
import MapScreen from "./screens/MapScreen";
import NavBar from "./components/NavBar";
import PlaceDetails from "./screens/PlaceDetails";  

const Stack = createNativeStackNavigator();

export default function Navigation() {

  useEffect(() => {
    const loginAnon = async () => {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error('Error en login anónimo:', error);
      } else {
        console.log('Sesión anónima activa:', data.session?.access_token);
      }
    };
  
    loginAnon();
  }, []);

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MapScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="MapScreen"
            component={MapScreen}
            options={{
              animation: "slide_from_left",
            }}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="SpotDetail"
            component={PlaceDetails}
            options={{
              animation: "slide_from_right",
            }}
          />
        </Stack.Navigator>

        <NavBar />
      </NavigationContainer>
    </NavigationIndependentTree>

  );
}