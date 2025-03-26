import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URI; // Fetch base URL from environment variables

// Function to create a session
export const createSession = async (socketId) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/session/${socketId}`);
    return response.data;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

// Function to get session data by socketId
export const getSessionData = async (socketId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/session/data/${socketId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching session data:", error);
    throw error;
  }
};

// Function to update session by userId
export const updateSession = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/session/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error updating session:", error);
    throw error;
  }
};

// Function to get all sessions for a user
export const getAllSessions = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/session/all/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all sessions:", error);
    throw error;
  }
};
