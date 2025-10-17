import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./mongoose";
import User from "../models/User";
import Campaign from "../models/Campaign";
import CreatorProfile from "../models/CreatorProfile";
import Connection from "../models/Connection";
import CampaignApplication from "../models/CampaignApplication";
import Task from "../models/Task";
import Page from "../models/Page";
import CreatorLike from "../models/CreatorLike";
import CreatorBookmark from "../models/CreatorBookmark";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    console.log("🌱 Starting database seed...");

    // Clear existing data
    console.log("🗑️ Clearing existing data...");
    await CampaignApplication.deleteMany({});
    await Connection.deleteMany({});
    await CreatorProfile.deleteMany({});
    await CreatorLike.deleteMany({});
    await CreatorBookmark.deleteMany({});
    await Task.deleteMany({});
    await Page.deleteMany({});
    await Campaign.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Cleared existing data");

    // --- Create Users ---
    console.log("👤 Creating users...");
    const password = "password123";
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const users = await User.insertMany([
      // Brands
      {
        email: "ethiocoffee@example.com",
        passwordHash,
        role: "brand",
        name: "Ethio Coffee Co.",
      },
      {
        email: "addisfashion@example.com",
        passwordHash,
        role: "brand",
        name: "Addis Fashion",
      },
      {
        email: "techhub@example.com",
        passwordHash,
        role: "brand",
        name: "Innovate Tech Hub",
      },
      // Creators
      {
        email: "hanan@example.com",
        passwordHash,
        role: "creator",
        name: "Hanan Yusuf",
      },
      {
        email: "dawit@example.com",
        passwordHash,
        role: "creator",
        name: "Dawit Getachew",
      },
      {
        email: "meron@example.com",
        passwordHash,
        role: "creator",
        name: "Meron Tesfaye",
      },
      {
        email: "yohannes@example.com",
        passwordHash,
        role: "creator",
        name: "Yohannes Abebe",
      },
    ]);

    const [brand1, brand2, brand3, creator1, creator2, creator3, creator4] =
      users;
    console.log(`✅ Created ${users.length} users`);

    // --- Create Creator Profiles ---
    console.log("✨ Creating creator profiles...");
    const profiles = await CreatorProfile.insertMany([
      {
        userId: creator1._id,
        username: "hanan_y",
        displayName: "Hanan Yusuf",
        avatar: "https://i.pravatar.cc/150?u=hanan",
        bio: "Lifestyle & Travel enthusiast exploring the beauty of Ethiopia and beyond. ✈️🌍",
        category: "Lifestyle",
        location: "Addis Ababa, Ethiopia",
        followers: 15200,
        engagement: 1.8,
        rating: 4.9,
        platforms: ["instagram", "tiktok"],
        tags: ["travel", "lifestyle", "foodie"],
      },
      {
        userId: creator2._id,
        username: "dawit_codes",
        displayName: "Dawit Getachew",
        avatar: "https://i.pravatar.cc/150?u=dawit",
        bio: "Tech reviewer and software developer. Making complex tech simple.",
        category: "Technology",
        location: "Addis Ababa, Ethiopia",
        followers: 8500,
        engagement: 3.2,
        rating: 4.8,
        platforms: ["youtube", "twitter"],
        tags: ["tech", "software", "gadgets"],
      },
      {
        userId: creator3._id,
        username: "meron_styles",
        displayName: "Meron Tesfaye",
        avatar: "https://i.pravatar.cc/150?u=meron",
        bio: "Fashion designer and stylist. Passionate about sustainable and traditional Ethiopian fashion.",
        category: "Fashion",
        location: "Hawassa, Ethiopia",
        followers: 25000,
        engagement: 2.5,
        rating: 4.9,
        platforms: ["instagram", "pinterest"],
        tags: ["fashion", "sustainable", "design"],
      },
      {
        userId: creator4._id,
        username: "yohannes_fit",
        displayName: "Yohannes Abebe",
        avatar: "https://i.pravatar.cc/150?u=yohannes",
        bio: "Fitness coach and nutritionist. Helping you become the best version of yourself.",
        category: "Fitness",
        location: "Addis Ababa, Ethiopia",
        followers: 12000,
        engagement: 4.1,
        rating: 5.0,
        platforms: ["instagram", "youtube"],
        tags: ["fitness", "health", "nutrition"],
      },
    ]);
    console.log(`✅ Created ${profiles.length} creator profiles`);

    // --- Create Campaigns ---
    console.log("🚀 Creating campaigns...");
    const campaigns = await Campaign.insertMany([
      {
        userId: brand1._id,
        title: "Morning Brew Coffee Launch",
        description:
          "Launch campaign for our new single-origin coffee bean. Looking for creators to showcase the coffee-making ritual.",
      },
      {
        userId: brand2._id,
        title: "Summer Collection Showcase",
        description:
          "Promote our new summer fashion line. Need creators for lookbooks and style videos.",
      },
    ]);
    const [campaign1, campaign2] = campaigns;
    console.log(`✅ Created ${campaigns.length} campaigns`);

    // --- Create Connections ---
    console.log("🤝 Creating connections...");
    await Connection.insertMany([
      {
        requesterId: creator1._id,
        receiverId: creator2._id,
        status: "accepted",
      },
      {
        requesterId: creator3._id,
        receiverId: creator1._id,
        status: "accepted",
      },
      {
        requesterId: creator4._id,
        receiverId: creator1._id,
        status: "pending",
      },
    ]);
    console.log("✅ Created connections");

    // --- Create Campaign Applications ---
    console.log("📝 Creating campaign applications...");
    await CampaignApplication.insertMany([
      {
        campaignId: campaign1._id,
        creatorId: creator1._id,
        coverLetter:
          "I'm a huge coffee lover and my audience enjoys my morning routine content. I'd love to feature your new brew!",
        status: "pending",
      },
      {
        campaignId: campaign2._id,
        creatorId: creator3._id,
        coverLetter:
          "My fashion-focused audience would be perfect for your summer collection. I have some great ideas for a lookbook video.",
        status: "approved",
      },
      {
        campaignId: campaign2._id,
        creatorId: creator1._id,
        coverLetter:
          "I'd love to expand my content into fashion and your summer collection looks amazing!",
        status: "rejected",
      },
    ]);
    console.log("✅ Created campaign applications");

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await disconnectDB();
    console.log("🔌 Database connection closed.");
  }
};

seed();
