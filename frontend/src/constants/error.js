export const ERROR = {
    'forbidden': {
        code: 403,
        message: 'Bạn không có quyền truy cập vào trang này.',
    },
    'not_found': {
        code: 404,
        message: 'Không tìm thấy trang bạn yêu cầu.',
        sub_code: {
            require_key: {
                code: 0,
                message: 'Quiz yêu cầu mã truy cập.',
            },
            key_invalid: {
                code: 1,
                message: 'Mã truy cập không hợp lệ.',
            },
        }
    },
    'internal_server_error': {
        code: 500,
        message: 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.',
    },
    'bad_request': {
        code: 400,
        message: 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại dữ liệu bạn đã nhập.',
    },
    'unauthorized': {
        code: 401,
        message: 'Bạn cần đăng nhập để thực hiện hành động này.',
    },
}