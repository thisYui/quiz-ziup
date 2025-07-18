# Load môi trường Rails
require_relative '../config/environment'

participations = Participation.new(
  quiz_session_id: 1,
  participator: User.find(3)
  )

if participations.save
  puts "Participation created successfully!"
else
  puts "Failed to create participation: #{participations.errors.full_messages.join(', ')}"
end