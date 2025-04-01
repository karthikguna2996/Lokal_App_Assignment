import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import JobsScreen from './screens/JobsScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import JobDetailsScreen from './screens/JobDetailsScreen';

const Tab = createBottomTabNavigator();
const JobsStack = createStackNavigator();
const BookmarksStack = createStackNavigator();

function JobsStackScreen() {
  return (
    <JobsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <JobsStack.Screen 
        name="Jobs" 
        component={JobsScreen}
        options={{ headerShown: false }}
      />
      <JobsStack.Screen 
        name="JobDetails" 
        component={JobDetailsScreen}
        options={{ title: 'Job Details' }}
      />
    </JobsStack.Navigator>
  );
}

function BookmarksStackScreen() {
  return (
    <BookmarksStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <BookmarksStack.Screen 
        name="Bookmarks" 
        component={BookmarksScreen}
        options={{ headerShown: false }}
      />
      <BookmarksStack.Screen 
        name="JobDetails" 
        component={JobDetailsScreen}
        options={{ title: 'Job Details' }}
      />
    </BookmarksStack.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Jobs') {
                iconName = focused ? 'briefcase' : 'briefcase-outline';
              } else if (route.name === 'Bookmarks') {
                iconName = focused ? 'bookmark' : 'bookmark-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: '#64748b',
            tabBarStyle: {
              height: 60,
              paddingBottom: 5,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              marginBottom: 5,
            },
          })}
        >
          <Tab.Screen 
            name="Jobs" 
            component={JobsStackScreen} 
            options={{ headerShown: false }}
          />
          <Tab.Screen 
            name="Bookmarks" 
            component={BookmarksStackScreen} 
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}