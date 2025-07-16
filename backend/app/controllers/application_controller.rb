class ApplicationController < ActionController::Base
  def find_user(id)
    user = User.find_by(id: id)
    if user.nil?
      render json: { error: I18n.t('account.update.not_found') }, status: :not_found
      return nil
    end
    user
  end

  def find_user_by_email(email)
    user = User.find_by(email: email)
    if user.nil?
      render json: { error: I18n.t('account.update.not_found') }, status: :not_found
      return nil
    end
    user
  end

  def save_user(user)
    if user.save
      render json: { message: I18n.t('account.update.success') }, status: :ok
    else
      render json: { error: I18n.t('account.update.failure') }, status: :unprocessable_entity
    end
  end
end
