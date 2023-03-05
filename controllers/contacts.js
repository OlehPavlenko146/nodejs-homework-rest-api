const { Contact } = require("../models/contact");

const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 20, favorite, name, email } = req.query;
  console.log(req.query);
  const skip = (page - 1) * limit;

  let result;

  if (favorite || name || email) {
    result = await Contact.find(
      { owner, $or: [{ favorite }, { name }, { email }] },
      "-createdAt -updatedAt",
      {
        skip,
        limit,
      }
    ).populate("owner", "email subscription");
  } else {
    result = await Contact.find({ owner }, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "email subscription");
  }

  return res.status(200).json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findById(id);

  if (!result || owner.toString() !== result.owner.toString()) {
    throw HttpError(404, "Not found");
  }

  return res.status(200).json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  return res.status(201).json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  const { _id: owner } = req.user;
  if (owner.toString() === contact.owner.toString()) {
    result = await Contact.findByIdAndDelete(id);
  } else {
    throw HttpError(404, "Not found");
  }
  return res.status(200).json({ message: "contact deleted" });
};

const updatebyId = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result || owner.toString() !== result.owner.toString()) {
    throw HttpError(404, "Not found");
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "missing fields" });
  }
  return res.status(200).json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result || owner.toString() !== result.owner.toString()) {
    throw HttpError(404, "Not found");
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "missing fields" });
  }
  return res.status(200).json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  updatebyId: ctrlWrapper(updatebyId),
  updateFavorite: ctrlWrapper(updateFavorite),
};
