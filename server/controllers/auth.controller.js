import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import MedicalRecord from "../models/reports.model.js";
import generateToken from "../utilities/generateToken.js";

import { sendOTPEmail } from "../utilities/nodeMailer.js";
import { sendOTPSMS } from "../utilities/twilio.js";
import { generateOTP } from "../utilities/otp.js";
import { decryptText } from "../utilities/cryptoutils.js";


// 🔐 REGISTER
export const register = async (req, res) => {
  try {
    const { email, password, full_name, role, phone_number } = req.body;

    if (!email || !password || !full_name || !role || !phone_number) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password_hash,
      full_name,
      role,
      phone_number,
      location_coordinates: {
        type: "Point",
        coordinates: [0, 0],
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
        phone_number: user.phone_number,
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

    // Supports login by email or phone_number
    const user = await User.findOne({ 
      $or: [{ email: email }, { phone_number: email }] 
    });

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
        phone_number: user.phone_number,
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


// 👤 GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password_hash -otp_code -otp_expiry -otp_attempts -otp_last_sent");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Get User Error:", err);
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
    const { full_name, password, location_coordinates, phone_number } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (full_name) user.full_name = full_name;
    if (phone_number) user.phone_number = phone_number;

    if (password) {
      user.password_hash = await bcrypt.hash(password, 10);
    }

    if (location_coordinates?.coordinates) {
      user.location_coordinates = location_coordinates;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        phone_number: user.phone_number,
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


// 🔐 FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email, phone_number } = req.body;

    if (!email && !phone_number) {
      return res.status(400).json({
        success: false,
        message: "Provide email or phone_number",
      });
    }

    const user = await User.findOne(
      email ? { email } : { phone_number }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ⛔ Rate limit
    if (user.otp_last_sent && Date.now() - user.otp_last_sent < 60000) {
      return res.status(429).json({
        success: false,
        message: "Wait before requesting OTP again",
      });
    }

    const otp = generateOTP();

    user.otp_code = otp;
    user.otp_expiry = Date.now() + 10 * 60 * 1000;
    user.otp_attempts = 0;
    user.otp_last_sent = Date.now();

    await user.save();

    if (email) {
      await sendOTPEmail(email, otp);
    } else {
      await sendOTPSMS(phone_number, otp);
    }

    res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// 🔐 RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, phone_number, otp, newPassword } = req.body;

    if ((!email && !phone_number) || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Provide email/phone_number, OTP, and new password",
      });
    }

    const user = await User.findOne(
      email ? { email } : { phone_number }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp_code || user.otp_code !== otp) {
      user.otp_attempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otp_expiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.password_hash = await bcrypt.hash(newPassword, 10);

    // Clear OTP
    user.otp_code = undefined;
    user.otp_expiry = undefined;
    user.otp_attempts = 0;
    user.otp_last_sent = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// 👥 GET PATIENTS
export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "Patient" }).select("-password_hash -otp_code -otp_expiry");
    
    res.json({
      success: true,
      patients
    });
  } catch (err) {
    console.error("Get Patients Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// 📊 GET DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "Patient" });
    const reportsAnalyzed = await MedicalRecord.countDocuments({});
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyConsults = await MedicalRecord.countDocuments({ upload_date: { $gte: sevenDaysAgo } });

    // Aggregate Risk Distribution
    const patients = await User.find({ role: "Patient" }).select("patient_details.current_health_score");
    
    let low = 0, medium = 0, high = 0;
    patients.forEach(p => {
        const score = p.patient_details?.current_health_score !== undefined && p.patient_details?.current_health_score !== null 
            ? p.patient_details.current_health_score 
            : 85; // Default healthy baseline
        if (score >= 75) low++;
        else if (score >= 40) medium++;
        else high++;
    });

    const total = patients.length || 1;
    const riskStats = [
        { name: 'Low', value: Math.round((low/total)*100), color: '#10B981' },
        { name: 'Medium', value: Math.round((medium/total)*100), color: '#F59E0B' },
        { name: 'High', value: Math.round((high/total)*100), color: '#EF4444' },
    ];

    // Build Weekly Graph Data
    const weeklyDataAgg = await MedicalRecord.aggregate([
      { $match: { upload_date: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$upload_date" } },
          count: { $sum: 1 }
        }
      }
    ]);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = [];
    for(let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const match = weeklyDataAgg.find(w => w._id === dateStr);
        weeklyData.push({ day: days[d.getDay()], count: match ? match.count : 0 });
    }

    // Build Monthly Graph Data
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const monthlyDataAgg = await MedicalRecord.aggregate([
      { $match: { upload_date: { $gte: fourWeeksAgo } } },
      { $group: {
          _id: { $week: "$upload_date" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    const monthlyData = monthlyDataAgg.map((m, i) => ({ day: `W${i+1}`, count: m.count }));
    while(monthlyData.length < 4) monthlyData.push({ day: `W${monthlyData.length+1}`, count: 0 });

    res.json({
      success: true,
      stats: {
        totalPatients,
        riskStats,
        reportsAnalyzed,
        weeklyConsults,
        weeklyData,
        monthlyData
      }
    });
  } catch (err) {
    console.error("Get Stats Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📄 GET LATEST RECORD FOR PATIENT
export const getLatestRecord = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        // Import dynamic decrypt utility if needed inside or ensure it's at top
        const records = await MedicalRecord.find({ patient_id: patientId })
            .sort({ upload_date: -1 })
            .limit(5);

        const decryptedRecords = records.map(record => {
            const r = record.toObject();
            if (r.ocr_extracted_text) {
                r.ocr_extracted_text = decryptText(r.ocr_extracted_text);
            }
            return r;
        });

        res.json({
            success: true,
            records: decryptedRecords
        });
    } catch (err) {
        console.error("Get Records Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};