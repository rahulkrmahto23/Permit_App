import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:7000/api/v1/user",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // allows cookies to be sent/received
});

// Login User
export const loginUser = async (email, password) => {
  try {
    const res = await apiClient.post("/login", { email, password });
    return {
      success: true,
      message: res.data.message,
      user: {
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      },
    };
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Unable to login");
  }
};

// Signup User
export const signupUser = async (name, email, password, role = "CLIENT") => {
  try {
    const res = await apiClient.post("/signup", {
      name,
      email,
      password,
      role,
    });
    return {
      success: true,
      message: res.data.message,
      user: {
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      },
    };
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Unable to signup");
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    const res = await apiClient.get("/logout");
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    console.error("Logout Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Unable to logout");
  }
};
// Add a new permit
export const createPermit = async (permitData) => {
  const res = await apiClient.post("/add-permit", permitData);
  return {
    success: true,
    message: res.data.message,
    permit: res.data.permit,
  };
};

// Get all permits
export const getAllPermits = async () => {
  try {
    const res = await apiClient.get("/permits");
    return {
      success: true,
      message: res.data.message,
      permits: res.data.permits,
    };
  } catch (error) {
    console.error("Get Permits Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Unable to fetch permits");
  }
};

// Edit a permit by ID
export const updatePermit = async (id, updatedData) => {
  try {
    const res = await apiClient.put(`/edit-permit/${id}`, updatedData);
    return {
      success: true,
      message: res.data.message,
      permit: res.data.permit,
    };
  } catch (error) {
    console.error("Edit Permit Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Unable to edit permit");
  }
};

// Delete a permit by ID
export const deletePermit = async (id) => {
  try {
    const res = await apiClient.delete(`/delete-permit/${id}`);
    return {
      success: true,
      message: res.data.message,
      permit: res.data.permit,
    };
  } catch (error) {
    console.error(
      "Delete Permit Error:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Unable to delete permit");
  }
};

// Search permits by query

export const searchPermits = async (queryParams) => {
  try {
    // Prepare query parameters
    const params = {};
    
    if (queryParams.poNumber) params.poNumber = queryParams.poNumber;
    if (queryParams.permitNumber) params.permitNumber = queryParams.permitNumber;
    if (queryParams.permitStatus && queryParams.permitStatus !== 'ALL') {
      params.permitStatus = queryParams.permitStatus;
    }
    
    // Date handling
    if (queryParams.startDate) {
      params.startDate = queryParams.startDate.toISOString();
    }
    if (queryParams.endDate) {
      params.endDate = queryParams.endDate.toISOString();
    }

    const response = await apiClient.get("/search-permits", { params });

    // Ensure response has the expected structure
    if (!response.data) {
      throw new Error("Invalid response from server");
    }

    return {
      success: true,
      message: response.data.message || "Search completed",
      permits: response.data.permits || []
    };
  } catch (error) {
    console.error("Search Permit Error:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Unable to search permits"
    );
  }
};
