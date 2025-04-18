module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key',
  roles: {
    DEAN: 'truong_khoa',
    DEPUTY_DEAN: 'pho_khoa',
    DEPARTMENT_HEAD: 'truong_bo_mon',
    COORDINATOR: 'dau_moi_cong_viec'
  },
  tokenExpiration: '1h'
};