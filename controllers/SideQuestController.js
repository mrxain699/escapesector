import SideQuestModel from "../models/SideQuestModel.js";
class SideQuestController {
  static add_side_quest = async (req, res) => {
    const { mission_id, question, answer, options, image } = req.body;
    if (
      mission_id &&
      question &&
      answer &&
      options &&
      options.length > 0 &&
      image
    ) {
      try {
        const sidequest = new SideQuestModel({
          mission_id: mission_id,
          question: question,
          answer: answer,
          options: options,
          image: image,
        });
        await sidequest
          .save()
          .then(() => {
            res.send({
              status: "success",
              message: "Side Quest upload successfully.",
            });
          })
          .catch((error) => {
            res.send({
              status: "failed",
              message: error.message,
            });
          });
      } catch (error) {
        res.send({
          status: "failed",
          message: error.message,
        });
      }
    } else {
      res.send({ status: "failed", message: "All the fields are required." });
    }
  };

  static get_side_quests = async (req, res) => {
    const { mission_id } = req.params;
    if (mission_id) {
      try {
        const quests = await SideQuestModel.find({ mission_id: mission_id });
        if (quests && quests.length > 0) {
          res.send({ status: "success", message: quests });
        } else {
          res.send({ status: "failed", message: "Side Quests not found." });
        }
      } catch (error) {
        res.send({
          status: "failed",
          message: error.message,
        });
      }
    } else {
      res.send({
        status: "failed",
        message: "Invalid Parameters",
      });
    }
  };

  static update_side_quest = async (req, res) => {
    const { quest_id, mission_id, question, answer, options, image } = req.body;
    if (
      quest_id &&
      mission_id &&
      question &&
      answer &&
      options &&
      options.length > 0 &&
      image
    ) {
      try {
        const sidequest = await SideQuestModel.updateOne(
          { _id: quest_id },
          {
            $set: {
              mission_id: mission_id,
              question: question,
              answer: answer,
              options: options,
              image: image,
            },
          }
        );
        if (sidequest.modifiedCount > 0) {
          res.send({
            status: "success",
            message: "Side Quest update successfully.",
          });
        } else {
          res.send({
            status: "failed",
            message: "Something went wrong to update side quest.",
          });
        }
      } catch (error) {
        res.send({
          status: "failed",
          message: error.message,
        });
      }
    } else {
      res.send({ status: "failed", message: "All the fields are required." });
    }
  };

  static delete_side_quests = async (req, res) => {
    const { quest_id } = req.params;
    if (quest_id) {
      try {
        const quest = await SideQuestModel.findOne({ _id: quest_id });
        if (quest) {
          const delete_quest = await SideQuestModel.deleteOne({
            _id: quest_id,
          });
          if (delete_quest) {
            res.send({
              status: "success",
              message: "Side Quest delete successfully.",
            });
          } else {
            res.send({
              status: "failed",
              message: "Something went wrong to  delete side quest.",
            });
          }
        } else {
          res.send({ status: "failed", message: "Side Quest not found." });
        }
      } catch (error) {
        res.send({
          status: "failed",
          message: error.message,
        });
      }
    } else {
      res.send({
        status: "failed",
        message: "Invalid Parameters",
      });
    }
  };
}

export default SideQuestController;
