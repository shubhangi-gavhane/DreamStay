const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const { isLoggedIn } = require("../middleware");

router.post("/", isLoggedIn, async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const booking = new Booking({
        user: req.user._id,
        listing: listing._id
    });
    await booking.save();
    req.flash("success", "Booking initiated. Redirecting to payment...");
    res.redirect(`/listings/${listing._id}/pay`);
});

router.get("/pay", isLoggedIn, (req, res) => {
    res.render("payment");
});

module.exports = router;
