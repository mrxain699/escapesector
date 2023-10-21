import SectorModel from "../models/SectorModel.js";

class SectorController {
  // Add Sector
  static add_sector = (req, res) => {};

  // static update_sector
  static update_sector = (req, res) => {};

  static get_all_official_sectors = async (req, res) => {
    const official_sectors = await SectorModel.find({ official: true });
    if (official_sectors.length > 0) {
      res.send({ official_sectors: official_sectors });
    } else {
      res.send({ status: "Failed", message: "Sectors not found" });
    }
  };
}

export default SectorController;
