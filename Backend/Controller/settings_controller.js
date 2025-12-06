import Settings from "../models/settings.model.js";

// Get all settings
export const getSettings = async (req, res) => {
  try {
    console.log('📋 Fetching settings...');
    const settings = await Settings.getSettings();
    
    res.status(200).json({
      success: true,
      message: "Settings fetched successfully",
      settings,
    });
  } catch (error) {
    console.error("❌ Error fetching settings:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch settings",
    });
  }
};

// Update store information
export const updateStoreInfo = async (req, res) => {
  try {
    console.log('🏪 Updating store info:', req.body);
    
    const { storeName, storeEmail, storePhone, storeAddress, storeLogo, storeDescription } = req.body;
    
    const settings = await Settings.updateSettings(
      {
        storeInfo: {
          storeName,
          storeEmail,
          storePhone,
          storeAddress,
          storeLogo,
          storeDescription,
        },
      },
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Store information updated successfully",
      settings,
    });
  } catch (error) {
    console.error("❌ Error updating store info:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update store information",
    });
  }
};

// Update general settings
export const updateGeneralSettings = async (req, res) => {
  try {
    console.log('⚙️ Updating general settings:', req.body);
    
    const {
      enableNotifications,
      maintenanceMode,
      allowGuestCheckout,
      currency,
      timezone,
      language,
    } = req.body;

    const settings = await Settings.updateSettings(
      {
        general: {
          enableNotifications,
          maintenanceMode,
          allowGuestCheckout,
          currency,
          timezone,
          language,
        },
      },
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "General settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("❌ Error updating general settings:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update general settings",
    });
  }
};

// Update payment settings
export const updatePaymentSettings = async (req, res) => {
  try {
    console.log('💳 Updating payment settings');
    
    const {
      enableStripe,
      stripePublicKey,
      stripeSecretKey,
      enablePaypal,
      paypalClientId,
      paypalSecretKey,
      enableCOD,
      taxRate,
    } = req.body;

    const settings = await Settings.updateSettings(
      {
        payment: {
          enableStripe,
          stripePublicKey,
          stripeSecretKey,
          enablePaypal,
          paypalClientId,
          paypalSecretKey,
          enableCOD,
          taxRate: Number(taxRate),
        },
      },
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Payment settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("❌ Error updating payment settings:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update payment settings",
    });
  }
};

// Update shipping settings
export const updateShippingSettings = async (req, res) => {
  try {
    console.log('🚚 Updating shipping settings:', req.body);
    
    const {
      freeShippingThreshold,
      standardShippingFee,
      expressShippingFee,
      enableInternationalShipping,
      estimatedDeliveryDays,
    } = req.body;

    const settings = await Settings.updateSettings(
      {
        shipping: {
          freeShippingThreshold: Number(freeShippingThreshold),
          standardShippingFee: Number(standardShippingFee),
          expressShippingFee: Number(expressShippingFee),
          enableInternationalShipping,
          estimatedDeliveryDays,
        },
      },
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Shipping settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("❌ Error updating shipping settings:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update shipping settings",
    });
  }
};

// Update email settings
export const updateEmailSettings = async (req, res) => {
  try {
    console.log('📧 Updating email settings');
    
    const {
      emailProvider,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      fromEmail,
      fromName,
    } = req.body;

    const settings = await Settings.updateSettings(
      {
        email: {
          emailProvider,
          smtpHost,
          smtpPort: Number(smtpPort),
          smtpUser,
          smtpPassword,
          fromEmail,
          fromName,
        },
      },
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Email settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("❌ Error updating email settings:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update email settings",
    });
  }
};

// Update SEO settings
export const updateSEOSettings = async (req, res) => {
  try {
    console.log('🔍 Updating SEO settings');
    
    const {
      metaTitle,
      metaDescription,
      metaKeywords,
      googleAnalyticsId,
      facebookPixelId,
    } = req.body;

    const settings = await Settings.updateSettings(
      {
        seo: {
          metaTitle,
          metaDescription,
          metaKeywords,
          googleAnalyticsId,
          facebookPixelId,
        },
      },
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "SEO settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("❌ Error updating SEO settings:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update SEO settings",
    });
  }
};

// Update social media links
export const updateSocialMedia = async (req, res) => {
  try {
    console.log('📱 Updating social media links');
    
    const { facebook, twitter, instagram, linkedin, youtube } = req.body;

    const settings = await Settings.updateSettings(
      {
        socialMedia: {
          facebook,
          twitter,
          instagram,
          linkedin,
          youtube,
        },
      },
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Social media links updated successfully",
      settings,
    });
  } catch (error) {
    console.error("❌ Error updating social media:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update social media links",
    });
  }
};

// Reset settings to default
export const resetSettings = async (req, res) => {
  try {
    console.log('🔄 Resetting settings to default');
    
    // Delete existing settings
    await Settings.deleteMany({});
    
    // Create new default settings
    const settings = await Settings.create({
      lastUpdatedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Settings reset to default successfully",
      settings,
    });
  } catch (error) {
    console.error("❌ Error resetting settings:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reset settings",
    });
  }
};
