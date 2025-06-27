const { initialiseDatabase } = require("./db.connect");
const Hotel = require("./hotel.model");
const express = require("express");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
initialiseDatabase();

app.use(express.json());
app.use(cors(corsOptions));

//3. Read all Hotel
async function readAllHotels() {
  try {
    const hotels = await Hotel.find();
    return hotels;
  } catch (error) {
    throw error;
  }
}

// readAllHotels();
app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();

    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

//4. Read a hotel by its name ("Lake View")
async function readByName(hotelName) {
  try {
    const hotel = await Hotel.findOne({ name: hotelName });
    return hotel;
  } catch (error) {
    throw error;
  }
}

// readByName("Lake View");
app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await readByName(req.params.hotelName);

    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

//5. hotels which offers parking space
async function offersParking(isParking) {
  try {
    const hotels = await Hotel.find({ isParkingAvailable: isParking });
    console.log("Hotels which offers parking space:", hotels);
  } catch (error) {
    throw error;
  }
}

// offersParking(true);

//6. read all hotels which has restaurant available.
async function restaurentAvailable(isRestaurent) {
  try {
    const hotels = await Hotel.find({ isRestaurantAvailable: isRestaurent });
    console.log("Hotels which has restaurant available:", hotels);
  } catch (error) {
    throw error;
  }
}

// restaurentAvailable(true);

//7. read all hotels by category ("Mid-Range")
async function readHotelByCategory(hotelCategory) {
  try {
    const hotels = await Hotel.find({ category: hotelCategory });
    return hotels;
  } catch (error) {
    throw error;
  }
}

// readHotelByCategory("Mid-Range");
app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await readHotelByCategory(req.params.hotelCategory);

    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

//8. read all hotels by price range ("$$$$ (61+)")
async function readHotelsByPriceRange(range) {
  try {
    const hotels = await Hotel.find({ priceRange: range });
    console.log("Hotels by price range $$$$ (61+):", hotels);
  } catch (error) {
    throw error;
  }
}

// readHotelsByPriceRange("$$$$ (61+)");

//9. read all hotels with 4.0 rating
async function readHotelsByRating(hotelRating) {
  try {
    const hotels = await Hotel.find({ rating: hotelRating });
    return hotels;
  } catch (error) {
    throw error;
  }
}

// readHotelsByRating(4.0);
app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await readHotelsByRating(req.params.hotelRating);

    if (hotels.length != 0) {
      res.json({ hotels });
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

//10. read hotel by phone number ("+1299655890")
async function readHotelByPhoneNumber(hotelNumber) {
  try {
    const hotel = await Hotel.findOne({ phoneNumber: hotelNumber });
    return hotel;
  } catch (error) {
    throw error;
  }
}

// readHotelByPhoneNumber("+1299655890");
app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await readHotelByPhoneNumber(req.params.phoneNumber);

    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

async function addNewHotel(data) {
  try {
    const newHotel = new Hotel(data);
    const save = await newHotel.save();
    return save;
  } catch (error) {
    throw error;
  }
}

app.post("/hotels", async (req, res) => {
  try {
    const hotel = await addNewHotel(req.body); // wait for DB save thats why use await
    console.log("Incoming data: ", req.body);
    res
      .status(201)
      .json({ message: "New Hotel data added successfully.", hotel });
  } catch (error) {
    console.error("Error adding hotel:", error);
    res.status(500).json({ error: "Failed to add hotel data." });
  }
});

async function deleteHotelById(hotelId) {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    console.log("Deleted Hotel", deletedHotel);
    return deletedHotel;
  } catch (error) {
    throw error;
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deleteHotel = await deleteHotelById(req.params.hotelId);

    if (!deleteHotel) {
      res.status(404).json({ error: "Hotel not found." });
    }

    res.status(200).json({ message: "Hotel data deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete a Hotel." });
  }
});

async function updateHotelData(hotelId, dataToUpdate) {
  try {
    const updateHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {
      new: true,
    });
    console.log("Updated Data", updateHotel);
    return updateHotel;
  } catch (error) {
    console.log("Error updating Hotel Data.");
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotelData(req.params.hotelId, req.body);
    if (updatedHotel) {
      res
        .status(200)
        .json({ message: "Hotel Data updated successfully.", updatedHotel });
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Data" });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server is running on PORT", PORT);
});
