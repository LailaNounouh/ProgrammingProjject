import { baseUrl } from '../config';

// Create a secure API client with automatic token handling
class ApiClient {
  constructor() {
    this.baseURL = baseUrl;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  // Create headers with authentication
  createHeaders(additionalHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle API responses
  async handleResponse(response) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // GET request
  async get(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.createHeaders(options.headers),
      credentials: 'include',
      ...options
    });

    return this.handleResponse(response);
  }

  // POST request
  async post(endpoint, data = null, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.createHeaders(options.headers),
      credentials: 'include',
      body: data ? JSON.stringify(data) : null,
      ...options
    });

    return this.handleResponse(response);
  }

  // PUT request
  async put(endpoint, data = null, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.createHeaders(options.headers),
      credentials: 'include',
      body: data ? JSON.stringify(data) : null,
      ...options
    });

    return this.handleResponse(response);
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.createHeaders(options.headers),
      credentials: 'include',
      ...options
    });

    return this.handleResponse(response);
  }

  // Upload file
  async uploadFile(endpoint, formData, options = {}) {
    const headers = { ...options.headers };
    // Don't set Content-Type for FormData, let browser set it with boundary
    delete headers['Content-Type'];

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
      ...options
    });

    return this.handleResponse(response);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export convenience methods
export const { get, post, put, delete: del, uploadFile } = apiClient;
