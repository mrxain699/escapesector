import LeaderboardModel from "../models/LeaderboardModel.js";
class LeaderboardController {
  static AddLeader = async (req, res) => {
    const { mission_id, ranked_user } = req.body;
    if (
      mission_id &&
      ranked_user.user_id &&
      ranked_user.username &&
      ranked_user.rank &&
      ranked_user.time_completed
    ) {
      try {
        const isMissionExist = await LeaderboardModel.findOne({
          mission_id: mission_id,
        });
        if (isMissionExist) {
          const add_user_rank = await LeaderboardModel.updateOne(
            { mission_id: mission_id },
            { $push: { ranked_users: ranked_user } }
          );
          if (add_user_rank.modifiedCount > 0) {
            res.send({
              status: "success",
              message: "User rank added successfully",
            });
          } else {
            res.send({
              status: "failed",
              message: "Something went wrong",
            });
          }
        } else {
          const leaderboard = new LeaderboardModel({
            mission_id: mission_id,
            ranked_users: [ranked_user],
          });
          await leaderboard
            .save()
            .then(() => {
              res.send({
                status: "success",
                message: "User rank added successfully",
              });
            })
            .catch((error) => {
              res.send({ status: "failed", message: error.message });
            });
        }
      } catch (error) {
        res.send({ status: "failed", message: error.message });
      }
    }
  };

  static getLeader = async (req, res) => {
    const { missionId } = req.params;
    if (missionId) {
      try {
        const ranked_users = await LeaderboardModel.findOne({
          mission_id: missionId,
        });
        if (ranked_users) {
          res.send({ status: "success", ranked_user_list: ranked_users });
        } else {
          res.send({ status: "failed", message: "Ranked users not found" });
        }
      } catch (error) {
        res.send({ status: "failed", message: error.message });
      }
    } else {
      res.send({ status: "failed", message: "Invalid mission Id" });
    }
  };

  static getUserFromLeader = async (req, res) => {
    const { missionId, userId } = req.params;
    if ((missionId, userId)) {
      try {
        const ranked_user = await LeaderboardModel.findOne({
          mission_id: missionId,
        });
        if (ranked_user) {
          let rank_user = {};
          ranked_user.ranked_users.forEach((user) => {
            if (user.user_id == userId) {
              rank_user = user;
            }
          });
          res.send({ status: "success", ranked_user: rank_user });
        } else {
          res.send({ status: "failed", message: "Ranked user not found" });
        }
      } catch (error) {
        res.send({ status: "failed", message: error.message });
      }
    } else {
      res.send({ status: "failed", message: "Invalid mission or user Id" });
    }
  };
}

export default LeaderboardController;
