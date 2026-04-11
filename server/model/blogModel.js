//ctrl+f to any name of user to blog or blog to user

const mongoose = require("mongoose")

const blogSchema = new mongoose. Schema({
                title : {
                                type : String,
                                required : true
                                },

                description:{
                                    type: String,
                                    required : true
                                    },
                image:{
                                    type: String
                                    },
                published: {
                    type: Boolean,
                    default: true
                },

                //we are combining two schemas
                user :{
                         type : mongoose.Schema.Types.ObjectId,
                         ref: "User",
                        required: true

                                    }
                                    })

module.exports = mongoose.model("blog", blogSchema)