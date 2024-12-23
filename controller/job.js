const { mongoose } = require("mongoose");
const jobModel = require("../model/job");

const getJob = async (req, res, next) => {
  try {
    let search = req.query.search || "";
    let jobType = req.query.job_type || "";
    let jobLevel = req.query.job_level || "";
    let jobCategory = req.query.category || "";
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 5;
    let skip = perPage * (page - 1);
    let limit = perPage;
    console.log(page, perPage);
    /* ch-soln
     const filters = [];
    // if (search) {
    //   filters.push({ $match: { title: RegExp(search, "i") } });
    // }
    // if (jobType) {
    //   filters.push({ $match: { job_type: RegExp(jobType, "i") } });
    // }
    // if (jobLevel) {
    //   filters.push({ $match: { job_level: RegExp(jobLevel, "i") } });
    // }
    // if (jobCategory) {
    //   filters.push({ $match: { category: RegExp(jobCategory, "i") } });
    // }

    // const aggregationPipeline = [...filters];
*/

    const jobs = await jobModel.aggregate([
      {
        //match work as find
        $match: {
          title: RegExp(search, "i"), // here i is for case sensitive  & RegExp create regular expression object

          job_type: RegExp(jobType, "i"),
          category: RegExp(jobCategory, "i"),
          job_level: RegExp(jobLevel, "i"),

          //
        },
      }, //mathi bata filter vayerw aako lai pheri tala ko match le filter  garne vo
      //

      {
        $project: {
          description: 0, //description jadaina 0 halda
        },
      },
      {
        $lookup: {
          //kun table ma herne for eg hamro users table ma
          from: "users", //this users is db collection name which we can see in the mongodb
          localField: "createdBy", //hamro yo table ma k name ma store xa
          foreignField: "_id", // arko foreign table i.e USers ma createdBy ma vako id ko value tw _id  ko form ma xa so tei lekheko
          as: "createdBy",
        },
      },
      {
        $unwind: "$createdBy",
      },

      {
        $project: {
          "createdBy.password": 0,
          "createdBy.repeat_password": 0,
          "createdBy.role": 0,
        },
      },
      //
      //

      {
        //used to send count and data itself
        //facet le just mathi bata filter vayerw aako data nai line or copy garxa
        $facet: {
          data: [
            {
              $skip: skip,
              //for 1st page we dont want to skip so 1st page is page=1 (1-1)*perpage(10) we get initial 1st 10 jobs we zero skip and in 2nd page  (2-1)*10 i.e 10jobs will be skipped
            },
            {
              $limit: limit,
            },
          ],
          metadata: [
            { $count: "total" }, // total search garerw aako jobs haru ko number
            { $addFields: { page, perPage } },
          ],
        },
      },
    ]);
    console.log("yoyoyoyoyo");
    console.log("job is here", jobs);
    return res.status(200).send(jobs);
  } catch (err) {
    next(err);
  }
};
//getjob by id
const getJobById = async (req, res, next) => {
  try {
    const job = await jobModel.findById(req.params.id);
    // console.log(job);
    return res.status(200).send(job);
  } catch (err) {
    next(err);
  }
};

const getHotJob = async (req, res, next) => {
  try {
    // res.send("dsadasdasda");
    const allhotjobs = await jobModel.find({ type: "hot" });
    // console.log(allhotjobs);
    return res.status(200).send(allhotjobs);
  } catch (err) {
    next(err);
  }
};
// const getHotJobs = async (req, res, next) => {
//   try {
//     req.send("jhahahahjahah");
//     // const allhotjobs = await jobModel.find({ type: "hot" });
//     // console.log(alljobs);
//     // console.log("mpkpkkkkkk");
//     // res.status(200).send("done");
//   } catch (err) {
//     next(err);
//   }
// };
const createJob = async (req, res, next) => {
  try {
    console.log(req.user.user._id);

    const job = await jobModel.create({
      ...req.body,
      // deadline_date: req.body.deadline_date,
      createdBy: req.user.user._id,
      creatorPic: req.user.user.image,
      createdAt: "Date-" + new Date().toDateString(),
    });
    console.log("job is here", job);
    res.status(200).send(job);
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    let job = await jobModel.findById(req.params.id);

    if (job) {
      job = job.toObject();
      if (req.user.user._id !== job.createdBy.toString()) {
        return res
          .status(401)
          .send({ msg: "Access Denied- This job is not created by you" });
      } else {
        let deletedJob = await jobModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({ deletedJobDetail: deletedJob });
      }
    } else {
      return res.status(401).send({ msg: "Job Post not Found" });
    }
  } catch (Err) {
    next(Err);
  }
};

const editjob = async (req, res, next) => {
  try {
    let job = await jobModel.findById(req.params.id);

    if (job) {
      job = job.toObject();

      if (req.user.user._id !== job.createdBy.toString()) {
        return res
          .status(401)
          .send({ msg: "Access denied- this job is not created by you" });
      } else {
        let updatedJob = await jobModel.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );
        res.status(200).send(updatedJob);
      }
    } else {
      return res.status(401).send({ msg: "Job Post not found" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getJob,
  createJob,
  deleteJob,
  editjob,
  getJobById,
  getHotJob,
};
