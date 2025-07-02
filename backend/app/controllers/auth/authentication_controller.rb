class Auth::AuthenticationController < ApplicationController
    def login
      user = User.find_by(email: params[:email])

      if user && user.password == BCrypt::Password.new(params[:password])
        # Tạo token hoặc session cho người dùng
        token = JwtService.encode({ user_id: user.id })
        render json: { message: "Đăng nhập thành công", token: token }, status: :ok
      else
        render json: { error: "Email hoặc mật khẩu không đúng" }, status: :unauthorized
      end
    end

    def register
        user = User.new(
            email: params[:email],
            password: BCrypt::Password.create(params[:password]),
            birth_date: params[:birth_date]
        )

        if user.save
          render json: { message: "Đăng ký thành công" }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
    end


    def send_otp
      # Tạo OTP 6 chữ số
      otp = "%06d" % rand(0..999999)

      puts "OTP được gửi: #{otp}" # In ra OTP để kiểm tra (thực tế sẽ gửi qua email hoặc SMS)
    end

    def confirm_otp
      # xác nhận OTP
    end

    def logout
      # Xóa session hoặc token
    end
end
