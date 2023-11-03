import SectorModel from "../models/SectorModel.js";
import upload_image from "../utils/ImageUpload.js";
class SectorController {
  static add_sector = async (req, res) => {
    const {
      title,
      difficulty,
      duration,
      distance,
      message,
      location,
      tasks,
      official,
      creator,
    } = req.body;

    if (
      title &&
      difficulty &&
      duration &&
      distance &&
      message &&
      location &&
      creator &&
      tasks.length > 0
    ) {
      try {
        // const uploadPromises = tasks.map(async (task) => {
        //   if (task.image) {
        //     return upload_image(task.image);
        //   }
        //   return null;
        // });
        // const uploadedImages = await Promise.all(uploadPromises);
        // tasks.forEach((task, index) => {
        //   if (task.image) {
        //     task.image = uploadedImages[index];
        //   }
        // });

        const sector = await new SectorModel({
          title: title,
          difficulty: difficulty,
          distance: distance,
          duration: duration,
          message: message,
          location: location,
          tasks: tasks,
          official: official,
          creator: creator,
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

  static get_sector_tasks = async (req, res) => {
    try {
      const { sectorId } = req.params;
      if (sectorId) {
        const sector = await SectorModel.findOne({ _id: sectorId });
        if (sector && sector.tasks.length > 0) {
          res.send({ status: "success", sector_tasks: sector.tasks });
        } else {
          res.send({ status: "Failed", message: "No tasks found" });
        }
      } else {
        res.send({ status: "Failed", message: "No tasks found" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function that fetch missions that are nearby to user
  static get_nearby_sectors = async (req, res) => {
    try {
      const { lat, long, official } = req.params;
      if (lat && long) {
        const sectors = await SectorModel.find({ official: official });
        if (sectors.length > 0) {
          const maxRadius = 50; // Maximum radius in kilometers
          const nearby_sectors = SectorController.findNearbySectors(
            lat,
            long,
            sectors,
            maxRadius
          );
          if (nearby_sectors.length > 0) {
            res.send({ status: "success", sectors: nearby_sectors });
          } else {
            res.send({ status: "Failed", message: "No sectors found" });
          }
        }
      } else {
        res.send({ status: "Failed", message: "Invalid Parameters" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function thet calculate distance using haversine formula and return the distance
  static haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in kilometers

    // Convert latitude and longitude from degrees to radians
    const toRadians = (angle) => angle * (Math.PI / 180);
    lat1 = toRadians(lat1);
    lon1 = toRadians(lon1);
    lat2 = toRadians(lat2);
    lon2 = toRadians(lon2);

    // Differences in coordinates
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;

    // Haversine formula
    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  static findNearbySectors = (userLat, userLon, sectors, maxRadius) => {
    const nearbySectors = [];

    for (const sector of sectors) {
      const sectorLat = sector.location.latitude;
      const sectorLon = sector.location.longitude;
      const distance = SectorController.haversine(
        userLat,
        userLon,
        sectorLat,
        sectorLon
      );
      if (distance <= maxRadius) {
        nearbySectors.push(sector);
      }
    }

    return nearbySectors;
  };

  static delete_sector = async (req, res) => {
    try {
      const { sectorId } = req.params;
      if (sectorId) {
        const deleted_sector = await SectorModel.deleteOne({ _id: sectorId });
        if (deleted_sector) {
          res.send({
            status: "success",
            message: "Sector Deleted successfully",
          });
        } else {
          res.send({ status: "Failed", message: "Failed to delete sector" });
        }
      } else {
        res.send({ status: "Failed", message: "No sector found to delete" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  static delete_task = async (req, res) => {
    try {
      const { sectorId, taskId } = req.params;
      if (taskId && sectorId) {
        const sector = await SectorModel.findById(sectorId);
        if (sector) {
          const delete_task = await SectorModel.updateOne(
            { _id: sectorId },
            { $pull: { tasks: { _id: taskId } } }
          );
          if (delete_task) {
            res.send({
              status: "success",
              message: "Task deleted successfully",
            });
          } else {
            res.send({ status: "failed", message: "Task not deleted" });
          }
        } else {
          res.send({ status: "failed", message: "No Sector Found" });
        }
      }
    } catch (error) {
      res.send({ status: "failed", message: "Unable to delete task" });
    }
  };
}

export default SectorController;
