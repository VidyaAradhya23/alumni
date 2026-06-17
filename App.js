import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Platform, Text } from 'react-native';

// Onboarding Screens
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OTPVerificationScreen from './src/screens/OTPVerificationScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';

// Main Tab Screens (Alumni)
import DashboardScreen from './src/screens/DashboardScreen';
import DirectoryScreen from './src/screens/DirectoryScreen';
import EngageScreen from './src/screens/EngageScreen';
import JobsScreen from './src/screens/JobsScreen';
import ContributeScreen from './src/screens/ContributeScreen';

// Secondary Screens (accessible from headers/actions)
import MessagesScreen from './src/screens/MessagesScreen';
import ChatScreen from './src/screens/ChatScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import PostCreationScreen from './src/screens/PostCreationScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Admin Flow Screens
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminOTPScreen from './src/screens/AdminOTPScreen';
import AdminHomeScreen from './src/screens/AdminHomeScreen';
import AdminUsersScreen from './src/screens/AdminUsersScreen';
import AdminJobsScreen from './src/screens/AdminJobsScreen';
import AdminEventsScreen from './src/screens/AdminEventsScreen';
import AdminPanelScreen from './src/screens/AdminPanelScreen';
import AdminProfileScreen from './src/screens/AdminProfileScreen';
import AdminPlacementDetailsScreen from './src/screens/AdminPlacementDetailsScreen';

// Super Admin Flow
import SuperAdminDashboardScreen from './src/screens/SuperAdminDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AdminTab = createBottomTabNavigator();
const SuperAdminTab = createBottomTabNavigator();

// ===== ALUMNI BOTTOM TABS =====
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#003366',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View style={{
                  position: 'absolute',
                  top: -8,
                  width: 24,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: '#003366',
                }} />
              )}
              {route.name === 'Home' && (
                <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
              )}
              {route.name === 'Engage' && (
                <MaterialCommunityIcons name={focused ? 'handshake' : 'handshake-outline'} size={22} color={color} />
              )}
              {route.name === 'Post' && (
                <MaterialCommunityIcons name={focused ? 'account-switch' : 'account-switch-outline'} size={22} color={color} />
              )}
              {route.name === 'Jobs' && (
                <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} size={22} color={color} />
              )}
              {route.name === 'Contribute' && (
                <MaterialCommunityIcons name={focused ? 'hand-heart' : 'hand-heart-outline'} size={22} color={color} />
              )}
              <Text style={{ color, fontSize: 10, fontWeight: '600', marginTop: 2 }}>{route.name}</Text>
            </View>
          );
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 65,
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Engage" component={DirectoryScreen} />
      <Tab.Screen name="Post" component={EngageScreen} />
      <Tab.Screen name="Jobs" component={JobsScreen} />
      <Tab.Screen name="Contribute" component={ContributeScreen} />
    </Tab.Navigator>
  );
}

// ===== ADMIN BOTTOM TABS =====
function AdminTabs() {
  return (
    <AdminTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#003366',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIcon: ({ focused, color }) => {
          let iconName = 'help-circle-outline';
          let label = route.name;

          if (route.name === 'AdminHome') { iconName = focused ? 'home' : 'home-outline'; label = 'Home'; }
          else if (route.name === 'AdminUsers') { iconName = focused ? 'people' : 'people-outline'; label = 'Users'; }
          else if (route.name === 'AdminJobs') { iconName = focused ? 'briefcase' : 'briefcase-outline'; label = 'Jobs'; }
          else if (route.name === 'AdminEvents') { iconName = focused ? 'calendar' : 'calendar-outline'; label = 'Events'; }
          else if (route.name === 'AdminPanel') { iconName = focused ? 'grid' : 'grid-outline'; label = 'Panel'; }

          return (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View style={{
                  position: 'absolute',
                  top: -8,
                  width: 24,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: '#003366',
                }} />
              )}
              <Ionicons name={iconName} size={22} color={color} />
              <Text style={{ color, fontSize: 10, fontWeight: '600', marginTop: 2 }}>{label}</Text>
            </View>
          );
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 65,
          backgroundColor: '#FFFFFF',
        },
      })}
    >
      <AdminTab.Screen name="AdminHome" component={AdminHomeScreen} />
      <AdminTab.Screen name="AdminUsers" component={AdminUsersScreen} />
      <AdminTab.Screen name="AdminJobs" component={AdminJobsScreen} />
      <AdminTab.Screen name="AdminEvents" component={AdminEventsScreen} />
      <AdminTab.Screen name="AdminPanel" component={AdminPanelScreen} />
    </AdminTab.Navigator>
  );
}

// ===== SUPER ADMIN BOTTOM TABS =====
function SuperAdminTabs() {
  return (
    <SuperAdminTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#003366',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIcon: ({ focused, color }) => {
          let iconName = 'help-circle-outline';
          let label = route.name;

          if (route.name === 'SADashboard') { iconName = focused ? 'home' : 'home-outline'; label = 'Dashboard'; }
          else if (route.name === 'SAUsers') { iconName = focused ? 'people' : 'people-outline'; label = 'Users'; }
          else if (route.name === 'SAJobs') { iconName = focused ? 'briefcase' : 'briefcase-outline'; label = 'Jobs'; }
          else if (route.name === 'SAEvents') { iconName = focused ? 'calendar' : 'calendar-outline'; label = 'Events'; }
          else if (route.name === 'SAPanel') { iconName = focused ? 'grid' : 'grid-outline'; label = 'Panel'; }

          return (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View style={{
                  position: 'absolute',
                  top: -8,
                  width: 24,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: '#003366',
                }} />
              )}
              <Ionicons name={iconName} size={22} color={color} />
              <Text style={{ color, fontSize: 10, fontWeight: '600', marginTop: 2 }}>{label}</Text>
            </View>
          );
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 65,
          backgroundColor: '#FFFFFF',
        },
      })}
    >
      <SuperAdminTab.Screen name="SADashboard" component={SuperAdminDashboardScreen} initialParams={{ initialModule: 'dashboard_home' }} />
      <SuperAdminTab.Screen name="SAUsers" component={AdminUsersScreen} initialParams={{ isSuperAdmin: true }} />
      <SuperAdminTab.Screen name="SAJobs" component={AdminJobsScreen} initialParams={{ isSuperAdmin: true }} />
      <SuperAdminTab.Screen name="SAEvents" component={AdminEventsScreen} initialParams={{ isSuperAdmin: true }} />
      <SuperAdminTab.Screen name="SAPanel" component={SuperAdminDashboardScreen} initialParams={{ initialModule: null }} />
    </SuperAdminTab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
          animation: 'slide_from_right',
        }}
      >
        {/* Onboarding Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={RegisterScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />

        {/* Alumni Main App */}
        <Stack.Screen name="Main" component={MainTabs} />

        {/* Admin Auth Flow */}
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminOTP" component={AdminOTPScreen} />

        {/* Admin Main App */}
        <Stack.Screen name="AdminMain" component={AdminTabs} />

        {/* Super Admin Main App */}
        <Stack.Screen name="SuperAdminMain" component={SuperAdminTabs} />

        {/* Shared Overlay/Secondary Screens */}
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="PostCreation" component={PostCreationScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
        <Stack.Screen name="AdminPlacementDetails" component={AdminPlacementDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
