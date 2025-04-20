import "dotenv/config";

export default {
  name: "Gecko Monitor",
  slug: "gecko-monitor",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  },
};
