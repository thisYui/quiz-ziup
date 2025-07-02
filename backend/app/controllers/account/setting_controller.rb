class Account::SettingController < ApplicationController
  def update_avatar
    user = User.find_by(id: current_user.id)

    if user.nil?
      render json: { error: I18n.t('account.update.not_found') }, status: :not_found
      return
    end

    # Mặc định url là (user.id).type
    name = "#{user.id}#{params[:type]}"
    data = params[:data]

    # Lưu data vào storage
    FileServices.update_file(name, data)

    # Thay đổi path
    user.avatar_url = name
    user.save

    render json: { message: I18n.t('account.update.success') }, status: :ok
  end

  def update_name
    user = User.find_by(id: current_user.id)

    if user.nil?
      render json: { error: I18n.t('account.update.not_found') }, status: :not_found
      return
    end

    new_name = params[:name]

    if new_name.blank?
      render json: { error: I18n.t('account.update.blank') }, status: :unprocessable_entity
      return
    end

    user.full_name = new_name
    user.save

    render json: { message: I18n.t('account.update.success') }, status: :ok
  end

  def update_email
    user = User.find_by(id: current_user.id)

    if user.nil?
      render json: { error: I18n.t('account.update.not_found') }, status: :not_found
      return
    end

    new_email = params[:email]

    if new_email.blank?
      render json: { error: I18n.t('account.update.blank') }, status: :unprocessable_entity
      return
    end

    if User.exists?(email: new_email)
      render json: { error: I18n.t('account.update.already_exists') }, status: :unprocessable_entity
      return
    end

    user.email = new_email
    user.save

    render json: { message: I18n.t('account.update.success') }, status: :ok
  end

  def update_password
    user = User.find_by(id: current_user.id)

    if user.nil?
      render json: { error: I18n.t('account.update.not_found') }, status: :not_found
      return
    end

    new_password = params[:password]

    if new_password.blank?
      render json: { error: I18n.t('account.update.blank') }, status: :unprocessable_entity
      return
    end

    user.password = BCrypt::Password.create(new_password)
    user.save

    render json: { message: I18n.t('account.update.success') }, status: :ok
  end

  def delete_account
    user = User.find_by(id: current_user.id)

    if user.nil?
      render json: { error: I18n.t('account.delete.not_found') }, status: :not_found
      return
    end

    # Xoá người dùng
    user.destroy

    render json: { message: I18n.t('account.delete.success') }, status: :ok
  end
end
