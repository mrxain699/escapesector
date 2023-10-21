import SectorModel from "../models/SectorModel.js";

class SectorController {
  // Funtion that saved sector into database
  static add_sector = async (req, res) => {
    const { title, difficulty, duration, message, location, tasks } = req.body;
    if (
      (title && difficulty && duration && message && location, tasks.length > 0)
    ) {
      try {
        const sector = await new SectorModel({
          title: title,
          difficulty: difficulty,
          duration: duration,
          message: message,
          location: location,
          tasks: tasks,
          official: false,
        });
        await sector
          .save()
          .then(() => {
            res.send({
              status: "success",
              message: " Mission saved successfully",
            });
          })
          .catch(() => {
            res.send({ status: "Failed", message: "Failed to save mission" });
          });
      } catch (error) {
        res.send({ status: "Failed", message: "Unable to connect" });
      }
    } else {
      res.send({ status: "Failed", message: "All fields are required." });
    }
  };

  // Function that fetch official sector from database and return as a response
  static get_all_official_sectors = async (req, res) => {
    const official_sectors = await SectorModel.find({ official: true });
    if (official_sectors.length > 0) {
      res.send({ official_sectors: official_sectors });
    } else {
      res.send({ status: "Failed", message: "Sectors not found" });
    }
  };

  // Function that fetch community sector from database and return as a response
  static get_all_community_sectors = async (req, res) => {
    const community_sectors = await SectorModel.find({ official: false });
    if (community_sectors.length > 0) {
      res.send({ community_sectors: community_sectors });
    } else {
      res.send({ status: "Failed", message: "Sectors not found" });
    }
  };
}

export default SectorController;
