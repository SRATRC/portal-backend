import express from 'express';
const router = express.Router();
import {
  AvailabilityCalender,
  BookingForMumukshu,
  ViewAllBookings,
  FlatBookingForMumukshu,
  CancelBooking,
  AddWaitlist
} from '../../controllers/client/roomBooking.controller.js';
import CatchAsync from '../../utils/CatchAsync.js';
import { validateCard, CheckDatesBlocked } from '../../middleware/validate.js';

router.use(validateCard);

router.get('/availablity', CatchAsync(AvailabilityCalender));
router.post('/room', CheckDatesBlocked, CatchAsync(BookingForMumukshu));
router.post('/room/:cardno', CatchAsync(CancelBooking));
router.post('/flat', CatchAsync(FlatBookingForMumukshu));
router.post('/room/waitlist', CatchAsync(AddWaitlist));
router.get('/bookings/:cardno', CatchAsync(ViewAllBookings));

export default router;
