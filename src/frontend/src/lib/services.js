import api from './api';
import Cookies from 'js-cookie';

// Development mode - return mock data when backend is unavailable
const DEVELOPMENT_MODE = true; // Set to false to re-enable real API calls

export const authService = {
  // Sign up
  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      if (response.data.success && response.data.data.token) {
        Cookies.set('auth_token', response.data.data.token, { expires: 1 }); // 1 day
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Log in
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success && response.data.data.token) {
        Cookies.set('auth_token', response.data.data.token, { expires: 1 }); // 1 day
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Log out
  logout() {
    Cookies.remove('auth_token');
  },

  // Get current user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!Cookies.get('auth_token');
  },

  // Get auth token
  getToken() {
    return Cookies.get('auth_token');
  }
};

export const routesService = {
  // Get all routes
  async getRoutes(params = {}) {
    if (DEVELOPMENT_MODE) {
      // Return mock routes data for development
      console.log('🔧 Development mode: Returning mock routes data');
      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'Hyde Park to Westminster',
            description: 'Scenic route through central London parks and landmarks',
            difficulty: 'easy',
            distanceKm: 2.8,
            estimatedTimeMinutes: 35,
            safetyRating: 8,
            path: {
              type: 'LineString',
              coordinates: [[-0.165806, 51.508515], [-0.157123, 51.505419], [-0.145712, 51.502321]]
            }
          },
          {
            id: 2,
            name: 'Thames Path - Tower Bridge to London Bridge',
            description: 'Beautiful riverside walk along the Thames',
            difficulty: 'easy',
            distanceKm: 1.2,
            estimatedTimeMinutes: 15,
            safetyRating: 9,
            path: {
              type: 'LineString',
              coordinates: [[-0.075384, 51.505455], [-0.081743, 51.504872], [-0.087052, 51.504412]]
            }
          }
        ]
      };
    }
    
    try {
      const response = await api.get('/routes', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Get single route
  async getRoute(id) {
    try {
      const response = await api.get(`/routes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Get routes near location
  async getNearbyRoutes(latitude, longitude, params = {}) {
    if (DEVELOPMENT_MODE) {
      // Return mock nearby routes data for development
      console.log('🔧 Development mode: Returning mock nearby routes data');
      console.log(`Getting nearby routes for location [${latitude}, ${longitude}]`);
      
      return {
        success: true,
        data: [
          {
            id: 1,
            name: 'Hyde Park to Westminster',
            description: 'Scenic route through central London parks and landmarks',
            type: 'safest',
            distance: 2.8,
            estimatedTime: 35,
            safetyRating: 8,
            coordinates: [
              [latitude, longitude],
              [latitude + 0.01, longitude + 0.01],
              [latitude + 0.02, longitude + 0.02]
            ]
          },
          {
            id: 2,
            name: 'Thames Path - Local Section',
            description: 'Beautiful riverside walk along the Thames',
            type: 'balanced',
            distance: 1.2,
            estimatedTime: 15,
            safetyRating: 9,
            coordinates: [
              [latitude, longitude],
              [latitude + 0.005, longitude + 0.015],
              [latitude + 0.01, longitude + 0.02]
            ]
          },
          {
            id: 3,
            name: 'Quick Local Route',
            description: 'Direct route through well-lit streets',
            type: 'fastest',
            distance: 0.8,
            estimatedTime: 10,
            safetyRating: 7,
            coordinates: [
              [latitude, longitude],
              [latitude + 0.008, longitude + 0.008]
            ]
          }
        ]
      };
    }
    
    try {
      const response = await api.get(`/routes/near/${latitude}/${longitude}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Find routes between two points
  async findRoutes(fromLat, fromLon, toLat, toLon, mode = 'walking') {
    if (DEVELOPMENT_MODE) {
      // Return mock route finding data for development
      console.log('🔧 Development mode: Returning mock route finding data');
      console.log(`Finding ${mode} routes from [${fromLat}, ${fromLon}] to [${toLat}, ${toLon}]`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        data: [
          {
            id: 'safest',
            name: 'Safest Route',
            type: 'safest',
            safetyRating: 9,
            distance: 2.3,
            duration: 28,
            coordinates: [
              [fromLat, fromLon],
              [fromLat + (toLat - fromLat) * 0.3, fromLon + (toLon - fromLon) * 0.2],
              [fromLat + (toLat - fromLat) * 0.7, fromLon + (toLon - fromLon) * 0.8],
              [toLat, toLon]
            ],
            color: '#10b981'
          },
          {
            id: 'fastest',
            name: 'Fastest Route',
            type: 'fastest',
            safetyRating: 6,
            distance: 1.8,
            duration: 22,
            coordinates: [
              [fromLat, fromLon],
              [fromLat + (toLat - fromLat) * 0.5, fromLon + (toLon - fromLon) * 0.5],
              [toLat, toLon]
            ],
            color: '#3b82f6'
          },
          {
            id: 'balanced',
            name: 'Balanced Route',
            type: 'balanced',
            safetyRating: 7,
            distance: 2.1,
            duration: 25,
            coordinates: [
              [fromLat, fromLon],
              [fromLat + (toLat - fromLat) * 0.4, fromLon + (toLon - fromLon) * 0.3],
              [fromLat + (toLat - fromLat) * 0.8, fromLon + (toLon - fromLon) * 0.7],
              [toLat, toLon]
            ],
            color: '#f59e0b'
          }
        ]
      };
    }
    
    try {
      const response = await api.post('/routes/find', {
        fromLat,
        fromLon,
        toLat,
        toLon,
        mode
      });
      return response.data;
    } catch (error) {
      console.error('Route finding error:', error);
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  }
};

export const hazardsService = {
  // Report hazard
  async reportHazard(hazardData) {
    if (DEVELOPMENT_MODE) {
      console.log('🔧 Development mode: Mock hazard reported', hazardData);
      return {
        success: true,
        message: 'Hazard reported successfully (dev mode)',
        data: { id: Date.now(), ...hazardData }
      };
    }
    
    try {
      const response = await api.post('/hazards', hazardData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Get all hazards
  async getHazards(params = {}) {
    if (DEVELOPMENT_MODE) {
      console.log('🔧 Development mode: Returning mock hazards data');
      return {
        success: true,
        data: [
          {
            id: 1,
            description: 'Broken street light',
            location: [-0.1276, 51.5074],
            type: 'lighting',
            hazardType: 'lighting', // Keep both for compatibility
            severity: 'medium',
            isResolved: false,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            description: 'Construction work blocking cycle lane',
            location: [-0.0759, 51.5085],
            type: 'construction',
            hazardType: 'construction', // Keep both for compatibility
            severity: 'high',
            isResolved: false,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      };
    }
    
    try {
      const response = await api.get('/hazards', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Get hazards near location
  async getNearbyHazards(latitude, longitude, params = {}) {
    if (DEVELOPMENT_MODE) {
      // Return mock nearby hazards data for development
      console.log('🔧 Development mode: Returning mock nearby hazards data');
      console.log(`Getting nearby hazards for location [${latitude}, ${longitude}]`);
      
      return {
        success: true,
        data: [
          {
            id: 1,
            description: 'Broken street light on main road',
            location: [latitude + 0.001, longitude + 0.001],
            type: 'lighting',
            hazardType: 'lighting',
            severity: 'medium',
            isResolved: false,
            reportedBy: 'Community Member',
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            updatedAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 2,
            description: 'Construction work blocking cycle lane',
            location: [latitude - 0.002, longitude + 0.003],
            type: 'construction',
            hazardType: 'construction',
            severity: 'high',
            isResolved: false,
            reportedBy: 'Cyclist',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 3,
            description: 'Slippery surface due to recent rain',
            location: [latitude + 0.003, longitude - 0.001],
            type: 'surface',
            hazardType: 'surface',
            severity: 'low',
            isResolved: false,
            reportedBy: 'Pedestrian',
            createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            updatedAt: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: 4,
            description: 'Aggressive behavior reported in this area',
            location: [latitude - 0.001, longitude - 0.002],
            type: 'crime',
            hazardType: 'crime',
            severity: 'high',
            isResolved: true,
            reportedBy: 'Local Resident',
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            updatedAt: new Date(Date.now() - 86400000).toISOString() // Updated 1 day ago
          }
        ]
      };
    }
    
    try {
      const response = await api.get(`/hazards/near/${latitude}/${longitude}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Update hazard status
  async updateHazard(id, updateData) {
    try {
      const response = await api.patch(`/hazards/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  }
};

export const buddiesService = {
  // Find nearby buddies
  async getNearbyBuddies(params = {}) {
    try {
      const response = await api.get('/buddies/nearby', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Find buddies near specific location
  async getBuddiesNearLocation(latitude, longitude, params = {}) {
    try {
      const response = await api.get(`/buddies/near/${latitude}/${longitude}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  },

  // Get all buddies
  async getAllBuddies(params = {}) {
    try {
      const response = await api.get('/buddies/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Network error' };
    }
  }
};