import 'dotenv/config.js';
import express, { urlencoded, json } from 'express';
import cors from 'cors';
import session from 'express-session';
import sequelize from './config/database.js';
import ApiError from './utils/ApiError.js';
import { ErrorHandler } from './middleware/Error.js';

import gateRoutes from './routes/gate/gate.routes.js';
import wifiRoutes from './routes/wifi/wifi.routes.js';

// Client Route Imports
import roomRoutes from './routes/client/roomBooking.routes.js';
import foodRoutes from './routes/client/foodBooking.routes.js';
import travelRoutes from './routes/client/travelBooking.routes.js';
import adhyayanRoutes from './routes/client/adhyayanBooking.routes.js';
import utsavBookingRoutes from './routes/client/utsavBooking.routes.js';
import maintenanceRoutes from './routes/client/maintenaneRequest.routes.js';

// Admin Route Imports
import authRoutes from './routes/admin/auth.routes.js';
import adminControlRoutes from './routes/admin/adminControls.routes.js';
import adhyayanManagementRoutes from './routes/admin/adhyayanManagement.routes.js';
import cardManagementRoutes from './routes/admin/cardManagement.routes.js';
import foodManagementRoutes from './routes/admin/foodManagement.routes.js';
import gateManagementRoutes from './routes/admin/gateManagement.routes.js';
import roomManagementRoutes from './routes/admin/roomManagement.routes.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Database 🚀');

    // Synchronize the models with the database (create tables if they don't exist)
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
};

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env['SESSION_SECRET'],
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 86400000 }
  })
);

app.get('/', (_req, res) => {
  res.status(200).send({ data: 'API is up and running... 🚀', status: 200 });
});

app.use('/api/v1/gate', gateRoutes);
app.use('/api/v1/wifi', wifiRoutes);
app.use('/api/v1/stay', roomRoutes);
app.use('/api/v1/food', foodRoutes);
app.use('/api/v1/travel', travelRoutes);
app.use('/api/v1/adhyayan', adhyayanRoutes);
app.use('/api/v1/utsav', utsavBookingRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);

// Admin Routes
app.use('/api/v1/admin/sudo', adminControlRoutes);
app.use('/api/v1/admin/auth', authRoutes);
app.use('/api/v1/admin/adhyayan', adhyayanManagementRoutes);
app.use('/api/v1/admin/card', cardManagementRoutes);
app.use('/api/v1/admin/food', foodManagementRoutes);
app.use('/api/v1/admin/gate', gateManagementRoutes);
app.use('/api/v1/admin/stay', roomManagementRoutes);

// if any unknown endpoint is hit then the error is handelled
app.use((_req, _res) => {
  throw new ApiError(404, 'Page Not Found');
});
app.use(ErrorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is listning on port ${port}...`);
});
