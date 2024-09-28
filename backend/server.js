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

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.set("trust proxy", true);
// File uploading

// Sanitize data
app.use(mongoSanitize());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routers
app.use("/api/v1/users", users);
app.use("/api/v1/record", record);

app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/',(req, res) => {
    res.send('API is running....')
  })
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
  // server.close(() => process.exit(1));
});
