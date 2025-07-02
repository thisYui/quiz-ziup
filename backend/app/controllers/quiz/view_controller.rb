class Quiz::ViewController < ApplicationController
  def show
    quiz = Quiz.find_by(id: params[:id])

  end

  def statistical

  end
end
