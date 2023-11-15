import SectorModel from "../models/SectorModel.js";
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
            res.send({ status: "failed", message: "Failed to save mission" });
          });
      } catch (error) {
        res.send({ status: "failed", message: "Unable to connect" });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required." });
    }
  };

  static update_sector = async (req, res) => {
    try {
      const { title, difficulty, message, distance, duration, location, id } =
        req.body;

      if (
        title &&
        difficulty &&
        message &&
        distance &&
        duration &&
        location &&
        id
      ) {
        const update_sector = await SectorModel.findByIdAndUpdate(id, {
          $set: {
            title: title,
            difficulty: difficulty,
            message: message,
            distance: distance,
            duration: duration,
            location: location,
          },
        });
        if (update_sector) {
          res.send({
            status: "success",
            message: "Sector update successfully",
          });
        } else {
          res.send({ status: "failed", message: "Unable to  update sector" });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Error updating sector" });
    }
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
          res.send({ status: "failed", message: "Failed to delete sector" });
        }
      } else {
        res.send({ status: "failed", message: "No sector found to delete" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  static get_sector = async (req, res) => {
    try {
      const { sectorId } = req.params;
      if (sectorId) {
        const sector = await SectorModel.findOne({ _id: sectorId });
        if (sector) {
          res.send({ status: "success", sector: sector });
        } else {
          res.send({ status: "failed", message: "No Sector Found" });
        }
      }
    } catch (error) {
      req.send({ status: "failed", message: "Unable to connect" });
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
          res.send({ status: "failed", message: "No tasks found" });
        }
      } else {
        res.send({ status: "failed", message: "No tasks found" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  static get_sector_task = async (req, res) => {
    try {
      const { sectorId, taskId } = req.params;

      if (sectorId) {
        const sector = await SectorModel.findOne({ _id: sectorId });
        if (sector) {
          let found_task = {};
          sector.tasks.forEach((task, index) => {
            if (task._id == taskId) {
              found_task = task;
            }
          });
          res.send({ status: "success", task: found_task });
        } else {
          res.send({ status: "failed", message: "No Task Found" });
        }
      }
    } catch (error) {
      req.send({ status: "failed", message: "Unable to connect" });
    }
  };

  static add_task = async (req, res) => {
    const {
      title,
      question,
      answer,
      location,
      message,
      hints,
      image,
      sector_id,
    } = req.body;
    try {
      if (
        title &&
        question &&
        answer &&
        hints.length > 0 &&
        location &&
        message &&
        sector_id
      ) {
        const update_sector_tasks = await SectorModel.updateOne(
          { _id: sector_id },
          {
            $push: {
              tasks: {
                title: title,
                question: question,
                answer: answer,
                message: message,
                location: location,
                hints: hints,
                image: image,
              },
            },
          }
        );
        console.log(update_sector_tasks);
        if (update_sector_tasks) {
          res.send({ status: "success", message: "Task addedd Successfully!" });
        } else {
          res.send({ status: "failed", message: "Unable to add task" });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Unable to connect" });
    }
  };

  static update_task = async (req, res) => {
    try {
      const {
        title,
        question,
        answer,
        message,
        hints,
        location,
        sector_id,
        task_id,
        image,
      } = req.body;
      if (
        title &&
        question &&
        message &&
        answer &&
        hints.length > 0 &&
        location &&
        sector_id &&
        task_id
      ) {
        const update_task = await SectorModel.updateOne(
          {
            _id: sector_id,
            "tasks._id": task_id,
          },
          {
            $set: {
              "tasks.$.title": title,
              "tasks.$.question": question,
              "tasks.$.answer": answer,
              "tasks.$.location": location,
              "tasks.$.hints": hints,
              "tasks.$.image": image,
              "tasks.$.message": message,
            },
          }
        );
        if (update_task) {
          res.send({
            status: "success",
            message: "Task update successfully",
          });
        } else {
          res.send({ status: "failed", message: "Unable to  update task" });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Error updating task" });
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

  // Function that fetch official sector from database and return as a response
  static get_all_official_sectors = async (req, res) => {
    const official_sectors = await SectorModel.find({ official: true });
    if (official_sectors.length > 0) {
      res.send({ official_sectors: official_sectors });
    } else {
      res.send({ status: "failed", message: "Sectors not found" });
    }
  };

  static sectors = async (req, res) => {
    const { official } = req.params;
    try {
      const sectors = await SectorModel.find({ official: official });
      if (sectors.length > 0) {
        res.send({ status: "success", sectors: sectors });
      } else {
        res.send({ status: "failed", message: "Sectors not found" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Sectors not found" });
    }
  };

  // Function that fetch community sector from database and return as a response
  static get_all_community_sectors = async (req, res) => {
    const community_sectors = await SectorModel.find({ official: false });
    if (community_sectors.length > 0) {
      res.send({ community_sectors: community_sectors });
    } else {
      res.send({ status: "failed", message: "Sectors not found" });
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
            res.send({ status: "failed", message: "No sectors found" });
          }
        }
      } else {
        res.send({ status: "failed", message: "Invalid Parameters" });
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
}

export default SectorController;
