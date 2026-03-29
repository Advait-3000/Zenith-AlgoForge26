import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import generateToken from "../utilities/generateToken.js";

// 🔐 REGISTER
export const register = async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;

    if (!email || !password || !full_name || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      password_hash,
      full_name,
      role,
      location_coordinates: {
        type: "Point",
        coordinates: [0, 0], // default (you can update later)
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};


// 🔐 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    user.last_login = new Date();
    await user.save();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// 🔄 UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { full_name, password, contact_number, patient_details, location_coordinates } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update name
    if (full_name) user.full_name = full_name;

    // Update contact number
    if (contact_number) user.contact_number = contact_number;

    // Update password (if provided)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(password, salt);
    }

    // Update location (optional)
    if (location_coordinates && location_coordinates.coordinates) {
      user.location_coordinates = location_coordinates;
    }

    // Update patient details (vitals, emergency contacts, disease history, etc.)
    if (patient_details) {
      if (!user.patient_details) user.patient_details = {};

      if (patient_details.date_of_birth) user.patient_details.date_of_birth = patient_details.date_of_birth;
      if (patient_details.gender) user.patient_details.gender = patient_details.gender;

      if (patient_details.vitals) {
        if (!user.patient_details.vitals) user.patient_details.vitals = {};
        Object.assign(user.patient_details.vitals, patient_details.vitals);
      }

      if (patient_details.emergency_contacts) {
        user.patient_details.emergency_contacts = patient_details.emergency_contacts;
      }

      if (patient_details.disease_history) {
        user.patient_details.disease_history = patient_details.disease_history;
      }
    }

    user.markModified("patient_details");
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        contact_number: user.contact_number,
        patient_details: user.patient_details,
        location_coordinates: user.location_coordinates,
      },
    });

  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};