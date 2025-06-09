const TaskExtensionRequest = require('../models/TaskExtensionRequest');
const Task = require('../models/Task');
const TaskProgress = require('../models/TaskProgress');
const User = require('../models/User');

const createExtensionRequest = async (req, res) => {
    try {
        const { taskId, proposeNewEndDate, reason, taskProgressId } = req.body;

        // Lấy requestedById từ req.user sau khi authenticate
        const requestedById = req.user.userId || req.user._id; // tùy token bạn có gì

        const newRequest = new TaskExtensionRequest({
            taskId,
            requestedById,
            proposeNewEndDate,
            reason,
            taskProgressId
        });

        await newRequest.save();

        res.status(201).json({ message: 'Gửi yêu cầu gia hạn thành công', data: newRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi gửi yêu cầu gia hạn', error: error.message });
    }
};


const get_name_ExtensionRequests = async (req, res) => {
    try {
        // 1. Lấy tất cả yêu cầu gia hạn
        const extensionRequests = await TaskExtensionRequest.find().lean();

        // 2. Lấy danh sách taskId và requestedById duy nhất
        const taskIds = [...new Set(extensionRequests.map(r => r.taskId))];
        const userIds = [...new Set(extensionRequests.map(r => r.requestedById))];

        // 3. Lấy thông tin Task tương ứng với taskIds (giả sử taskId là field trong Task)
        const tasks = await Task.find({ taskId: { $in: taskIds } })
            .select('taskId title')
            .lean();

        // 4. Lấy thông tin User tương ứng với userIds (giả sử userId là field trong User)
        const users = await User.find({ userId: { $in: userIds } })
            .select('userId fullName')
            .lean();

        // 5. Tạo Map để tra cứu nhanh theo taskId và userId
        const taskMap = {};
        tasks.forEach(task => {
            taskMap[task.taskId] = task.title;
        });

        const userMap = {};
        users.forEach(user => {
            userMap[user.userId] = user.fullName;
        });

        // 6. Map dữ liệu trả về theo yêu cầu
        const result = extensionRequests.map(r => ({
            extensionRequestId: r.extensionRequestId,
            taskId: taskMap[r.taskId] || '',
            requestedById: userMap[r.requestedById] || '',
            reason: r.reason,
            status: r.status,
            createdAt: r.createdAt,
        }));

        res.json(result);

    } catch (error) {
        console.error('Lỗi lấy yêu cầu gia hạn:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};



// Admin xem danh sách yêu cầu
const getAllExtensionRequests = async (req, res) => {
    try {
        const { status } = req.query; // có thể lọc theo status

        const filter = {};
        if (status) {
            filter.status = status;
        }

        const requests = await TaskExtensionRequest.find(filter).sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách yêu cầu gia hạn' });
    }
};

// Admin duyệt yêu cầu
const approveExtensionRequest = async (req, res) => {
    try {

        const { id } = req.params; // id của extensionRequest
        const { status, adminComment, progressDescription, progressPercentage } = req.body;

        // Tìm yêu cầu gia hạn theo id
        const request = await TaskExtensionRequest.findOne({ extensionRequestId: id });


        if (!request) {
            return res.status(404).json({ message: 'Không tìm thấy yêu cầu gia hạn' });
        }

        if (request.status !== 'Pending') {
            return res.status(400).json({ message: 'Yêu cầu đã được xử lý trước đó' });
        }

        if (status === 'Approved') {
            // Cập nhật deadline trong Task
            await Task.updateOne(
                { taskId: request.taskId },
                { endDate: request.proposeNewEndDate }
            );

            // Nếu có taskProgressId thì cập nhật TaskProgress tương ứng
            if (request.taskProgressId) {
                const taskProgress = await TaskProgress.findOne({ progressId: request.taskProgressId });
                if (taskProgress) {
                    taskProgress.reportDate = request.proposeNewEndDate; // hoặc set theo yêu cầu
                    if (progressDescription !== undefined) taskProgress.description = progressDescription;
                    if (progressPercentage !== undefined) taskProgress.progressPercentage = progressPercentage;
                    await taskProgress.save();
                }
            }
        }

        // Cập nhật trạng thái và comment của yêu cầu gia hạn
        request.status = status;
        request.adminComment = adminComment || '';
        request.updatedAt = new Date();
        await request.save();

        res.json({ message: 'Duyệt yêu cầu gia hạn thành công và cập nhật tiến độ', request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi duyệt yêu cầu gia hạn' });
    }
};

const getTaskAssignments = async (req, res) => {
    try {
        // B1: Lấy danh sách TaskProgress với trường taskId và _id
        const taskProgressList = await TaskProgress.find().select('taskId progressId').lean();


        // B2: Lấy danh sách taskId duy nhất từ taskProgressList
        const uniqueTaskIds = [...new Set(taskProgressList.map(tp => tp.taskId))];

        // B3: Lấy thông tin task tương ứng
        const tasks = await Task.find({ taskId: { $in: uniqueTaskIds } })
            .select('taskId title')
            .lean();

        // B4: Map taskId sang progressId tương ứng (giả sử lấy progressId đầu tiên tìm được)
        const taskIdToProgressId = {};
        taskProgressList.forEach(tp => {
            if (!taskIdToProgressId[tp.taskId]) {
                taskIdToProgressId[tp.taskId] = tp.progressId;

            }
        });

        // B5: Format response
        const response = tasks.map(task => ({
            taskId: task.taskId,
            taskTitle: task.title,
            progressId: taskIdToProgressId[task.taskId] || null,
        }));

        res.json(response);
    } catch (error) {
        console.error('Lỗi lấy task assignments:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};



module.exports = {
    createExtensionRequest,
    getAllExtensionRequests,
    approveExtensionRequest,
    getTaskAssignments,
    get_name_ExtensionRequests
};

