class ApplicationController < ActionController::Base
  def is_true(result)
    if result
      true
    else
      render json: { error: I18n.t('general.failure') }, status: :unprocessable_entity
      nil
    end
  end
end
