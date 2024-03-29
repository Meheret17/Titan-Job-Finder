const express = require("express");
const moment = require("moment");
const verifyToken = require("../middlewares/authentication");
const jobsModel = require("../models/job");

exports.createJobController = async (req, res, next) => {
  try {
    const { company, position } = req.body;
    if (!company || !position) {
      res.status(400).json({ message: "Please Provide All Fields" });
    }
    req.body.createdBy = req.user.userId;
    const job = await jobsModel.create(req.body);
    res.status(201).json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======= GET JOBS ===========
exports.getAllJobsController = async (req, res, next) => {
  try {
    const { status, workType, search, sort } = req.query;
    //conditons for searching filters
    const queryObject = {
      createdBy: req.user.userId,
    };
    //logic filters
    if (status && status !== "all") {
      queryObject.status = status;
    }
    if (workType && workType !== "all") {
      queryObject.workType = workType;
    }
    if (search) {
      queryObject.position = { $regex: search, $options: "i" };
    }

    let queryResult = jobsModel.find(queryObject);

    //sorting
    if (sort === "latest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "a-z") {
      queryResult = queryResult.sort("position");
    }
    if (sort === "z-a") {
      queryResult = queryResult.sort("-position");
    }
    //pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    queryResult = queryResult.skip(skip).limit(limit);
    //jobs count
    const totalJobs = await jobsModel.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalJobs / limit);

    const jobs = await queryResult;

    // const jobs = await jobsModel.find({ createdBy: req.user.userId });
    res.status(200).json({
      totalJobs,
      jobs,
      numOfPage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======= UPDATE JOBS ===========
exports.updateJobController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company, position } = req.body;
    //validation
    if (!company || !position) {
      res.status(400).json({ message: "Please Provide All Fields" });
    }
    //find job
    const job = await jobsModel.findOne({ _id: id });
    //validation
    if (!job) {
      res.status(400).send(`no jobs found with this id ${id}`);
    }
    if (!req.user.userId === job.createdBy.toString()) {
      res
        .status(400)
        .json({ message: "Your Not Authorized to update this job" });
      return;
    }
    const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    //res
    res.status(200).json({ updateJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======= DELETE JOBS ===========
exports.deleteJobController = async (req, res, next) => {
  try {
    const { id } = req.params;
    //find job
    const job = await jobsModel.findOne({ _id: id });
    //validation
    if (!job) {
      res.status(400).json({ message: `No Job Found With This ID ${id}` });
    }
    if (!req.user.userId === job.createdBy.toString()) {
      res
        .status(400)
        .json({ message: "Your Not Authorize to delete this job" });
      return;
    }
    await job.deleteOne();
    res.status(200).json({ message: "Success, Job Deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======  JOBS STATS & FILTERS ===========
exports.jobStatsController = async (req, res) => {
  try {
    const stats = await jobsModel.aggregate([
      // search by user jobs
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    //default stats
    const defaultStats = {
      pending: stats.pending || 0,
      reject: stats.reject || 0,
      interview: stats.interview || 0,
    };

    //monthly yearly stats
    let monthlyApplication = await jobsModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    monthlyApplication = monthlyApplication
      .map((item) => {
        const {
          _id: { year, month },
          count,
        } = item;
        const date = moment()
          .month(month - 1)
          .year(year)
          .format("MMM Y");
        return { date, count };
      })
      .reverse();
    res
      .status(200)
      .json({ totlaJob: stats.length, defaultStats, monthlyApplication });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
