import mongoose from "mongoose";

// Settings Schema Definition
const settingsSchema = new mongoose.Schema(
  {
    // Store Information
    storeInfo: {
      storeName: {
        type: String,
        default: "Product Store",
        trim: true,
      },
      storeEmail: {
        type: String,
        default: "store@example.com",
        trim: true,
        lowercase: true,
      },
      storePhone: {
        type: String,
        default: "",
        trim: true,
      },
      storeAddress: {
        type: String,
        default: "",
        trim: true,
      },
      storeLogo: {
        type: String,
        default: "",
      },
      storeDescription: {
        type: String,
        default: "",
      },
    },

    // General Settings
    general: {
      enableNotifications: {
        type: Boolean,
        default: true,
      },
      maintenanceMode: {
        type: Boolean,
        default: false,
      },
      allowGuestCheckout: {
        type: Boolean,
        default: true,
      },
      currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "PKR", "INR"],
        default: "USD",
      },
      timezone: {
        type: String,
        enum: ["UTC", "EST", "PST", "GMT", "IST", "PKT"],
        default: "UTC",
      },
      language: {
        type: String,
        enum: ["en", "es", "fr", "de", "ar"],
        default: "en",
      },
    },

    // Payment Settings
    payment: {
      enableStripe: {
        type: Boolean,
        default: false,
      },
      stripePublicKey: {
        type: String,
        default: "",
      },
      stripeSecretKey: {
        type: String,
        default: "",
        select: false, // Don't return in queries by default
      },
      enablePaypal: {
        type: Boolean,
        default: false,
      },
      paypalClientId: {
        type: String,
        default: "",
      },
      paypalSecretKey: {
        type: String,
        default: "",
        select: false,
      },
      enableCOD: {
        type: Boolean,
        default: true,
      },
      taxRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },

    // Shipping Settings
    shipping: {
      freeShippingThreshold: {
        type: Number,
        default: 50,
        min: 0,
      },
      standardShippingFee: {
        type: Number,
        default: 5.99,
        min: 0,
      },
      expressShippingFee: {
        type: Number,
        default: 12.99,
        min: 0,
      },
      enableInternationalShipping: {
        type: Boolean,
        default: false,
      },
      estimatedDeliveryDays: {
        standard: {
          type: Number,
          default: 7,
        },
        express: {
          type: Number,
          default: 3,
        },
      },
    },

    // Email Settings
    email: {
      emailProvider: {
        type: String,
        enum: ["smtp", "sendgrid", "mailgun"],
        default: "smtp",
      },
      smtpHost: {
        type: String,
        default: "",
      },
      smtpPort: {
        type: Number,
        default: 587,
      },
      smtpUser: {
        type: String,
        default: "",
      },
      smtpPassword: {
        type: String,
        default: "",
        select: false,
      },
      fromEmail: {
        type: String,
        default: "",
      },
      fromName: {
        type: String,
        default: "Product Store",
      },
    },

    // SEO Settings
    seo: {
      metaTitle: {
        type: String,
        default: "Product Store - Your Online Shopping Destination",
      },
      metaDescription: {
        type: String,
        default: "Shop the best products at great prices",
      },
      metaKeywords: {
        type: String,
        default: "ecommerce, online shopping, products",
      },
      googleAnalyticsId: {
        type: String,
        default: "",
      },
      facebookPixelId: {
        type: String,
        default: "",
      },
    },

    // Social Media Links
    socialMedia: {
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      youtube: {
        type: String,
        default: "",
      },
    },

    // Last Updated Info
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Ensure only one settings document exists (singleton pattern)
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  
  if (!settings) {
    // Create default settings if none exist
    settings = await this.create({});
  }
  
  return settings;
};

// Method to update settings
settingsSchema.statics.updateSettings = async function (updates, userId) {
  let settings = await this.getSettings();
  
  // Update fields
  Object.keys(updates).forEach((key) => {
    if (settings[key] !== undefined) {
      settings[key] = { ...settings[key], ...updates[key] };
    }
  });
  
  settings.lastUpdatedBy = userId;
  await settings.save();
  
  return settings;
};

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
