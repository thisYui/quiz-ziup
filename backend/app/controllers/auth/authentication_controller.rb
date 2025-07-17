class Auth::AuthenticationController < ApplicationController
  def login
    if params[:email].present? && params[:password].present?
      login_with_password(params)
    elsif params[:jti].present?
      login_with_jwt(params)
    else
      render json: { error: I18n.t('auth.login.invalid_params') }, status: :bad_request
    end
  end

  def register
      user = User.new(
          email: params[:email],
          password: params[:password],
      )

      return unless is_true(user.save)
      render json: { message: I18n.t('account.update.success') }, status: :ok
  end


  def send_otp
    # Gửi OTP đến email người dùng
    if OtpService.send_otp(params[:email])
      render json: { message: I18n.t('auth.otp.notice') }, status: :ok
    else
      render json: { error: I18n.t('auth.otp.failure') }, status: :unprocessable_entity
    end
  end

  def confirm_otp
    # xác nhận OTP
    if OtpService.confirm_otp(params[:email], params[:otp])
      render json: { message: I18n.t('auth.otp.success') }, status: :ok
    else
      render json: { error: I18n.t('auth.otp.failure') }, status: :unprocessable_entity
    end
  end

  def renew_token
    new_jti = JwtToken.renew_token(params)
    if new_jti
      render json: { token: new_jti }, status: :ok
    else
      render json: { error: I18n.t('auth.login.error_token') }, status: :unauthorized
    end
  end

  def logout
    # Xóa session
    if JwtToken.delete_token(params)
      render json: { message: I18n.t('auth.logout.success') }, status: :ok
    else
      render json: { error: I18n.t('auth.logout.failure') }, status: :unprocessable_entity
    end
  end

  private

  def login_with_password(params)
    user = User.find_by(email: params[:email])
    return unless is_true(user) and user

    if user.authenticate(params[:password])
      # Tạo token hoặc session cho người dùng
      if params[:remember_me]
        jti = JwtToken.add_token(user.id, params[:jwt_token])
        render json: { user_id: user_id, token: jti }, status: :ok
      else
        render json: { user_id: user_id, token: nil }, status: :ok
      end
    else
      render json: { error: I18n.t('auth.login.failure') }, status: :unauthorized
      nil
    end
  end

  def login_with_jwt(params)
    # Giải mã JWT token và lấy id
    user_id = JwtToken.find_by_jti(params)
    unless user_id
      render json: { error: I18n.t('auth.login.error_token') }, status: :unauthorized
      return
    end

    render json: { user_id: user_id, token: params[:jti] }, status: :ok
  end
end
