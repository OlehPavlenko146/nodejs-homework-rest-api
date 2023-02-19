const contactsActions = require("../models/contacts");

const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const result = await contactsActions.listContacts();

  return res.status(200).json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await contactsActions.getContactById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  return res.status(200).json(result);
};

const add = async (req, res) => {
  const result = await contactsActions.addContact(req.body);
  return res.status(201).json(result);
};

const deleteById = async (req, res) => {
  const { id } = req.params;
  const result = await contactsActions.removeContact(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  return res.status(200).json({ message: "contact deleted" });
};

const updatebyId = async (req, res) => {
  const { id } = req.params;
  // const getResult = await contactsActions.getContactById(id);
  const putResult = await contactsActions.updateContact(id, req.body);
  if (!putResult) {
    throw HttpError(404, "Not found");
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "missing fields" });
  }
  return res.status(200).json(putResult);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  updatebyId: ctrlWrapper(updatebyId),
};
