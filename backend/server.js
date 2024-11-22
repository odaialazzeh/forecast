import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import colors from "colors";
import { errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
import users from "./routes/userRoutes.js";
import record from "./routes/recordRoutes.js";
import upload from "./routes/uploadRoutes.js";

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Trust proxy
app.set("trust proxy", 1);

// Sanitize data
app.use(mongoSanitize());

// Set security headers and update CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://flask-app-6shfu.ondigitalocean.app", // External API
        ],
        scriptSrc: ["'self'", "https://trusted-scripts.com"], // Example for script sources
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Allow Google Fonts
        fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow Google Fonts
        imgSrc: ["'self'", "data:"], // Allow inline Base64 images
        // Add other CSP directives as needed
      },
    },
  })
);

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
const corsOptions = {
  origin: ["https://forecast-app-zhvoc.ondigitalocean.app"], // Replace with your frontend URL
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Mount routers
app.use("/api/v1/users", users);
app.use("/api/v1/record", record);
app.use("/api/v1", upload);

// Serve static files from the uploads folder
const __dirname = path.resolve(); // Ensure __dirname is available
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Error Handler Middleware
app.use(errorHandler);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
