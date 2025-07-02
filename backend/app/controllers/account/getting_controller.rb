class Account::GettingController < ApplicationController
  def information
    user = User.find_by(id: current_user.id)

    if user.nil?
      render json: { error: I18n.t('account.get.not_found') }, status: :not_found
    else
      path = Rails.root.join("storage").to_s
      user.avatar_url = path + '/' + user.avatar_url

      render json: user, status: :ok
    end
  end

  def all_quiz
    id = params[:id]
    quiz = Quiz.where(user_id: id)

    quiz.map do |q|
      {
        id: q.id,
        name: q.name,
        code: q.code,
        description: q.description
      }
    end
  end

  def quiz_outstanding

  end
end
