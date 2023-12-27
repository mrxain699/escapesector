import LeaderboardModel from "../models/LeaderboardModel.js";
class LeaderboardController {
  static AddLeader = async (req, res) => {
    const { mission_id, ranked_user } = req.body;
    if (
      mission_id &&
      ranked_user.user_id &&
      ranked_user.username &&
      ranked_user.time_completed
    ) {
      try {
        const isMissionExist = await LeaderboardModel.findOne({
          mission_id: mission_id,
        });
        if (isMissionExist) {
          const isUserExist = await LeaderboardModel.findOne({
            mission_id: mission_id,
            ranked_users: { $elemMatch: { user_id: ranked_user.user_id } },
          });
          if (isUserExist) {
            const updateUserRank = await LeaderboardModel.updateOne(
              {
                mission_id: mission_id,
                "ranked_users.user_id": ranked_user.user_id,
              },
              {
                $set: {
                  "ranked_users.$.time_completed": ranked_user.time_completed,
                },
              }
            );
            if (updateUserRank.modifiedCount > 0) {
              res.send({
                status: "success",
                message: "User rank update successfully",
              });
            } else {
              res.send({
                status: "failed",
                message: "Rank Update Error",
              });
            }
          } else {
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
                message: "User rank not added",
              });
            }
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
        const leaderboard = await LeaderboardModel.findOne({
          mission_id: missionId,
        });
        if (leaderboard) {
          const ranked_users = leaderboard.ranked_users.sort(
            (a, b) => a.time_completed - b.time_completed
          );
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
