class Account::SettingController < ApplicationController
  def update_avatar
    user = find_user(params[:user_id])
    return unless user

    # Mặc định url là (user.id).type
    name = "#{user.id}/avatar/#{params[:type]}"
    data = params[:data]

    # Lưu data vào storage
    FileService.update_file(data, name, user.avatar_url)
    user.avatar_url = name  # Thay đổi path

    save_user(user)
  end

  def update_name
    user = find_user(params[:user_id])
    return unless user

    new_name = params[:new_name]
    user.full_name = new_name
    
    save_user(user)
  end

  def update_email
    user = find_user(params[:user_id])
    return unless user

    new_email = params[:email]

    # Kiểm tra email đã tồn tại chưa
    if User.exists?(email: new_email)
      render json: { error: I18n.t('account.update.already_exists') }, status: :unprocessable_entity
      return
    end

    user.email = new_email

    save_user(user)
  end

  def update_password
    user = find_user(params[:user_id])
    return unless user

    new_password = params[:password]
    user.password = new_password
    
    save_user(user)
  end

  def delete_account
    user = find_user(params[:user_id])
    return unless user

    # Xoá người dùng 
    if user.destroy
      render json: { message: I18n.t('account.delete.success') }, status: :ok
    else
      render json: { error: I18n.t('account.delete.failure') }, status: :unprocessable_entity
    end
  end
end
