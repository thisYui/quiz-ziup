require 'singleton'

module StorageAnswer
  def self.add_answer_to_storage(quiz_id, answer_data)
    SingletonAnswerStorage.instance.init_storage(quiz_id)
    storage = SingletonAnswerStorage.instance.get_answer_storage(quiz_id)
    storage.add_answer(answer_data)
  end

  def self.get_answer_storage(quiz_id)
    storage = SingletonAnswerStorage.instance.get_answer_storage(quiz_id)
    SingletonAnswerStorage.instance.clear_answer_storage(quiz_id) unless storage
    storage
  end
end

# Class này chịu trách nhiệm thống kê
# và lưu trữ câu trả lời của người chơi trong 1 question
# Chi bao gồm thông tin cơ baản cảu người chơi và câu họ trả lời
# Nếu thuộc cấc loại không phải choice ch cần is_correct là đủ
# Việc phân tích tính đúng sai, keiemr tra loại câu do client thực hiện
# Cần phân biệt giữa các loại câu hỏi để lưu trữ đúng cách
# Các loại câu hỏi bao gồm: choice, matching, fill_in

class SingletonAnswerStorage
  include Singleton

  def initialize
    @quiz_answers = {}
  end

  def init_storage(quiz_id)
    return if @quiz_answers.key?(quiz_id)
    @quiz_answers[quiz_id] = AnswerStorageQuiz.send(:new)
  end

  def get_answer_storage(quiz_id)
    @quiz_answers[quiz_id]
  end

  def clear_answer_storage(quiz_id)
    @quiz_answers.delete(quiz_id)
  end

  def all_quiz_ids
    @quiz_answers.keys
  end
end

class AnswerStorageQuiz
  attr_reader :answers

  # Object {
  #   id: Integer,
  #   full_name: String,
  #   avatar_url: String,
  #   score: Integer,
  #   is_correct: Boolean, unless question_type == 'choice',
  #   choices: Array<String>, if question_type == 'choice',
  # }
  def initialize
    @answers = []
  end

  def add_answer(answer_data)
    @answers.push(answer_data)
  end

  def result_summary
    @answers
  end

  private_class_method :new
end
