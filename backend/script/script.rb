# Load môi trường Rails
require_relative '../config/environment'

# Ví dụ: chạy logic dùng model User
user = User.new(
  full_name: 'user_1',
  email: 'ad1@gmail.com',
  password: '123',
)
user.save
quiz = Quiz.new(
  description: 'description_1',
  code: 'code_1',
  is_private: false,
  title: 'title_1',
  max_participants: 100,
  topic: 0,
  key: nil,
  owner_user_id: user.id
)
quiz.save

user = User.new(
  full_name: 'user_2',
  email: 'ad2@gmail.com',
  password: '123',
)
user.save
quiz = Quiz.new(
  description: 'description_2',
  code: 'code_2',
  is_private: true,
  title: 'title_2',
  max_participants: 10,
  topic: 0,
  key: 'key',
  owner_user_id: user.id
)
quiz.save