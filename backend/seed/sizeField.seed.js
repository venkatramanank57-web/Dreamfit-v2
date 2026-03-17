import mongoose from "mongoose";
import dotenv from "dotenv";
import SizeField from "../models/SizeField.js";

dotenv.config();

const seedSizeFields = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // const sizeFields = [
    //   { name: "chest", displayName: "Chest", category: "upper", order: 1 },
    //   { name: "shoulder", displayName: "Shoulder", category: "upper", order: 2 },
    //   { name: "sleeveLength", displayName: "Sleeve Length", category: "upper", order: 3 },
    //   { name: "neck", displayName: "Neck", category: "upper", order: 4 },
    //   { name: "shirtLength", displayName: "Shirt Length", category: "upper", order: 5 },

    //   { name: "waist", displayName: "Waist", category: "lower", order: 6 },
    //   { name: "hip", displayName: "Hip", category: "lower", order: 7 },
    //   { name: "thigh", displayName: "Thigh", category: "lower", order: 8 },
    //   { name: "knee", displayName: "Knee", category: "lower", order: 9 },
    //   { name: "bottom", displayName: "Bottom", category: "lower", order: 10 },

    //   { name: "pantLength", displayName: "Pant Length", category: "lower", order: 11 },
    //   { name: "inseam", displayName: "Inseam", category: "lower", order: 12 },

    //   { name: "fullLength", displayName: "Full Length", category: "full", order: 13 },
    //   { name: "armHole", displayName: "Arm Hole", category: "upper", order: 14 },
    //   { name: "wrist", displayName: "Wrist", category: "upper", order: 15 }
    // ];
    const sizeFields = [
  { name: "dressLength", displayName: "Dress Length", category: "full", order: 1 },
  { name: "topLength", displayName: "Top Length", category: "upper", order: 2 },
  { name: "blouseLength", displayName: "Blouse Length", category: "upper", order: 3 },

  { name: "shoulder", displayName: "Shoulder", category: "upper", order: 4 },
  { name: "frontNeckDepth", displayName: "Front Neck Depth", category: "upper", order: 5 },
  { name: "backNeckDepth", displayName: "Back Neck Depth", category: "upper", order: 6 },

  { name: "aboveChest", displayName: "Above Chest", category: "upper", order: 7 },
  { name: "chest", displayName: "Chest", category: "upper", order: 8 },

  { name: "underBustLength", displayName: "Under Bust Length", category: "upper", order: 9 },
  { name: "underBustRound", displayName: "Under Bust Round", category: "upper", order: 10 },

  { name: "waistBlouseEnd", displayName: "Waist (Blouse End)", category: "upper", order: 11 },

  { name: "pointLength", displayName: "Point Length", category: "upper", order: 12 },
  { name: "distanceBetweenPoints", displayName: "Distance Between Points", category: "upper", order: 13 },

  { name: "actualArmhole", displayName: "Actual Armhole", category: "upper", order: 14 },

  { name: "sleeveLength", displayName: "Sleeve Length", category: "upper", order: 15 },
  { name: "sleeveOpen", displayName: "Sleeve Open", category: "upper", order: 16 },

  { name: "naturalWaistLength", displayName: "Natural Waist Length", category: "lower", order: 17 },
  { name: "naturalWaist", displayName: "Natural Waist", category: "lower", order: 18 },

  { name: "artificialWaistLength", displayName: "Artificial Waist Length", category: "lower", order: 19 },
  { name: "artificialWaist", displayName: "Artificial Waist", category: "lower", order: 20 },

  { name: "bottomLength", displayName: "Bottom Length", category: "lower", order: 21 },
  { name: "seatHip", displayName: "Seat / Hip", category: "lower", order: 22 },

  { name: "waistToKnee", displayName: "Waist to Knee", category: "lower", order: 23 },
  { name: "thighWidth", displayName: "Thigh Width", category: "lower", order: 24 },
  { name: "kneeWidth", displayName: "Knee Width", category: "lower", order: 25 },
  { name: "kneeToCalf", displayName: "Knee to Calf", category: "lower", order: 26 },

  { name: "calfWidth", displayName: "Calf Width", category: "lower", order: 27 },
  { name: "ankleWidth", displayName: "Ankle Width", category: "lower", order: 28 },

  { name: "shoulderToCalf", displayName: "Shoulder to Calf", category: "full", order: 29 },
  { name: "pinningToInseam", displayName: "Pinning to Inseam Point", category: "full", order: 30 },

  { name: "sareeWidth", displayName: "Saree Width", category: "saree", order: 31 },
  { name: "sareeWaist", displayName: "Saree Waist", category: "saree", order: 32 }
];

    for (const field of sizeFields) {

      const exists = await SizeField.findOne({ name: field.name });

      if (!exists) {
        const newField = new SizeField(field);
        await newField.save();
      }

    }

    console.log("🎉 Size fields seeded successfully");
    process.exit();

  } catch (error) {

    console.error("❌ Error seeding size fields:", error);
    process.exit(1);

  }
};

seedSizeFields();