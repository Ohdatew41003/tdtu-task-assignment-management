//D:\DACNTT\controllers\departmentController.js
const Department = require('../models/Department');

exports.createDepartment = async (req, res) => {
  try {
    const { name, description, parentId } = req.body;

    const newDepartment = new Department({
      departmentId: await generateDepartmentId(), // Thêm await
      name,
      description,
      parentId,
      path: parentId ? await generatePath(parentId) : '/'
    });

    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('head deputyHead', 'fullName email')
      .populate('parentId', 'name');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Không tìm thấy phòng ban' });
    }
    res.json({ message: 'Xóa phòng ban thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Helper functions
const getNextSequence = async (name) => {
  const ret = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return ret.seq;
};

const generateDepartmentId = async () => {
  const seq = await getNextSequence('departmentId');
  return seq.toString(); // Chuyển số thành string
};
const generatePath = async (parentId) => {
  const parent = await Department.findOne({ departmentId: parentId });
  if (!parent) throw new Error('Parent department not found');
  return `${parent.path}${parent.departmentId}/`;
};