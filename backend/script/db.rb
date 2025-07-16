# Load môi trường Rails
require_relative '../config/environment'

user = User.find_by(id: 3)
user.avatar_url = "3/avatar.png"
user.save