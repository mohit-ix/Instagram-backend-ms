const Message = require("../model/message");

//function to find all the messages between two users
const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const toUserId = req.params.id;

    const result = await Message.find({
      "$or": [
        {
          "$and": [
            {
              "toUserId": userId,
            },
            {
              "fromUserId": toUserId,
            },
          ],
        },
        {
          "$and": [
            {
              "toUserId": toUserId,
            },
            {
              "fromUserId": userId,
            },
          ],
        },
      ],
    }).sort({ timestamp: 1 });
    res.status(200).send({
      status: "success",
      conversation: result,
    });
  } catch (err) {
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
};

//function to find all the recent messages sent to or received by the current user
const getChatList = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Message.find({
      "$or": [
        {
          "toUserId": userId
        }, {
          "fromUserId": userId
        }
      ]
    }).sort({"createdAt": "desc"});

    const uniqueUser = [];

    const chatList = [];

    result.map((message) => {
      if(message.toUserId === userId) {
        if(!uniqueUser.includes(message.fromUserId)) {
          uniqueUser.push(message.fromUserId);
          chatList.push(message);
        }
      } else if(message.fromUserId === userId) {
        if(!uniqueUser.includes(message.toUserId)) {
          uniqueUser.push(message.toUserId);
          chatList.push(message);
        }
      }
    });

    res.status(200).send({
      status: "success",
      uniqueUser,
      chatList,
    })
  } catch (err) {
    res.status(500).send({
      status: "failure",
      message: err.message,
    });
  }
}

module.exports = {
    getMessages,
    getChatList
}