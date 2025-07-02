class Auth::AuthenticationController < ApplicationController
    def login
      user = User.find_by(email: params[:email])

      if user&.authenticate(params[:password])
        # Tạo token hoặc session cho người dùng
        if params[:remember_me]
          # Lấy ra phần dữ liệu của thiết bị
          #   :device
          #   :ip_address
          #   :user_agent
          jwt_token = params[:jwt_token]

          # Tạo token
          jti = JwtService.encode({ user_id: user.id })
          exp = 1.hours.from_now.to_i

          # Thêm token
          jwt_token[:jti] = jti
          jwt_token[:exp] = exp.to_i

          JwtToken.create(jwt_token).save

          render json: { message: I18n.t('auth.login.success'), token: jti }, status: :ok
        else
          render json: { message: I18n.t('auth.login.success') }, status: :ok
        end
      else
        render json: { error: I18n.t('auth.login.failure') }, status: :unauthorized
      end
    end

    def register
        user = User.new(
            email: params[:email],
            password: params[:password],
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
      if OTPServices.send_otp(params[:email])
        render json: { message: I18n.t('auth.otp.notice') }, status: :ok
      else
        render json: { error: I18n.t('auth.otp.failure') }, status: :unprocessable_entity
      end
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
      # Xóa session
      # Tìm đúng dòng dữ liệu
      jwt_token = JwtToken.where(jti: params[:jti],
                                 device: params[:device],
                                 ip_address: params[:ip_address],
                                 user_agent: params[:user_agent])
      # Xóa dòng
      jwt_token.delete_all
    end
end
