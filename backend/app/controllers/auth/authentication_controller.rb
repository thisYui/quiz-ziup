class Auth::AuthenticationController < ApplicationController
  def login
    if params[:email].present? && params[:password].present?
      login_with_password
    elsif params[:jti].present?
      login_with_jwt
    else
      render json: { error: I18n.t('auth.login.invalid_params') }, status: :bad_request
    end
  end

  def register
    user = User.new(email: params[:email], password: params[:password])

    return unless is_true(user.save)

    render json: { message: I18n.t('account.update.success') }, status: :ok
  end

  def send_otp
    if OtpService.send_otp(params[:email])
      render json: { message: I18n.t('auth.otp.notice') }, status: :ok
    else
      render json: { error: I18n.t('auth.otp.failure') }, status: :unprocessable_entity
    end
  end

  def confirm_otp
    if OtpService.confirm_otp(params[:email], params[:otp])
      render json: { message: I18n.t('auth.otp.success') }, status: :ok
    else
      render json: { error: I18n.t('auth.otp.failure') }, status: :unprocessable_entity
    end
  end

  def renew_token
    new_jti = JwtToken.renew_token(params[:token])
    if new_jti
      render json: { token: new_jti }, status: :ok
    else
      render json: { error: I18n.t('auth.login.error_token') }, status: :unauthorized
    end
  end

  def logout
    if JwtToken.delete_token(params[:token])
      render json: { message: I18n.t('auth.logout.success') }, status: :ok
    else
      render json: { error: I18n.t('auth.logout.failure') }, status: :unprocessable_entity
    end
  end

  private

  def login_with_password
    user = User.find_by(email: params[:email])
    return render json: { error: I18n.t('auth.login.failure') }, status: :unauthorized unless user

    if user.authenticate(params[:password])
      ip_address = request.remote_ip

      if params[:remember_me]
        jti = JwtToken.add_token(user.id, params[:jwt_token], ip_address)
        render json: { user_id: user.id, token: jti }, status: :ok
      else
        render json: { user_id: user.id, token: nil }, status: :ok
      end
    else
      render json: { error: I18n.t('auth.login.failure') }, status: :unauthorized
    end
  end

  def login_with_jwt
    user_id = JwtToken.find_by_jti(params[:jti])
    if user_id
      render json: { user_id: user_id, token: params[:jti] }, status: :ok
    else
      render json: { error: I18n.t('auth.login.error_token') }, status: :unauthorized
    end
  end
end
