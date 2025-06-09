const Department = require('../models/Department.js'); // import đúng theo CommonJS
const Counter = require('../models/Counter.js'); // nếu có dùng Counter cho getNextSequence

exports.createDepartment = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      parentDepartmentId,
      headUserId,
      establishedDate,
      displayOrder
    } = req.body;

    const newDepartment = new Department({
      name,
      code,
      description,
      parentDepartmentId: parentDepartmentId || null,
      headUserId: headUserId || null,
      establishedDate: establishedDate ? new Date(establishedDate) : null,
      displayOrder: displayOrder || 0,
    });

    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(400).json({ message: error.message, stack: error.stack });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('parentDepartmentId', 'name')  // populate đúng field tham chiếu ObjectId
      .lean();

    if (req.originalUrl.startsWith('/api/admin/get')) {
      res.render('admin/index', { departments, user: req.user });
    } else {
      res.json(departments);
    }
  } catch (error) {
    console.error(error);
    if (req.originalUrl.startsWith('/api/admin/get')) {
      res.status(500).send('Lỗi khi hiển thị giao diện quản lý đơn vị');
    } else {
      res.status(500).json({ error: 'Lỗi khi lấy danh sách đơn vị' });
    }
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
  return seq.toString();
};

const generatePath = async (parentId) => {
  const parent = await Department.findOne({ departmentId: parentId });
  if (!parent) throw new Error('Parent department not found');
  return `${parent.path}${parent.departmentId}/`;
};
