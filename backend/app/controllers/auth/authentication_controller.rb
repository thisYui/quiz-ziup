class Auth::AuthenticationController < ApplicationController
    def login
      user = User.find_by(email: params[:email])

      if user && user.password == BCrypt::Password.new(params[:password])
        # Tạo token hoặc session cho người dùng
        token = JwtService.encode({ user_id: user.id })
        render json: { message: I18n.t('auth.login.success'), token: token }, status: :ok
      else
        render json: { error: I18n.t('auth.login.failure') }, status: :unauthorized
      end
    end

    def register
        user = User.new(
            email: params[:email],
            password: BCrypt::Password.create(params[:password]),
            birth_date: params[:birth_date]
        )

        if user.save
          render json: { message: I18n.t('auth.register.success') }, status: :created
        else
          render json: { errors: I18n.t('auth.register.failure') }, status: :unprocessable_entity
        end
    end


    def send_otp
      # Gửi OTP đến email người dùng
      OTP.send_otp(params[:email])
    end

    def confirm_otp
      # xác nhận OTP
      if OTPServices.confirm_otp(params[:email], params[:otp])
        render json: { message: I18n.t('auth.otp.success') }, status: :ok
      else
        render json: { error: I18n.t('auth.otp.failure') }, status: :unprocessable_entity
      end
    end

    def logout
      # Xóa session hoặc token
    end
end
