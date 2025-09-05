class SocketNotifier
  TYPE_NOTIFICATION = {
    owner: 0,
    joined: 1,
    left: 0,
    updated: 3,
    started: 4,
    result_question: 5,
    next_question: 6,
    final_quiz: 7
  }

  def self.one_player_joined(payload)
    data = JSON.parse(payload)
    quiz_id = data["quiz_id"]

    # Thêm cờ để xác định loại thông báo
    data["type_notify"] = TYPE_NOTIFICATION[:joined]
    ActionCable.server.broadcast("quiz_#{quiz_id}", data)
  end

  def self.one_player_left(participantion_id, quiz_id)
    # Xóa dòng dữ liệu khỏi table
    participantion = Participation.find_by(id: participantion_id)
    return unless participantion

    participantion.destroy

    # Gửi thông báo đến tất cả người dùng trong quiz
    ActionCable.server.broadcast("quiz_#{quiz_id}", {
      type_notify: TYPE_NOTIFICATION[:left],
      participantion_id: participantion_id
    })
  end

  def self.start_quiz(quiz_id)
    data = {}

    # Thêm cờ để xác định loại thông báo
    data["type_notify"] = TYPE_NOTIFICATION[:started]
    ActionCable.server.broadcast("quiz_#{quiz_id}", data)
  end

  def self.result_and_rating(data, quiz_id)
    # Thêm cờ để xác định loại thông báo
    data["type_notify"] = TYPE_NOTIFICATION[:result_question]
    ActionCable.server.broadcast("quiz_#{quiz_id}", data)
  end

  def self.next_question(quiz_id)
    data = {}

    # Thêm cờ để xác định loại thông báo
    data["type_notify"] = TYPE_NOTIFICATION[:next_question]
    ActionCable.server.broadcast("quiz_#{quiz_id}", data)
  end

  def self.final_quiz(data, quiz_id)
    # Thêm cờ để xác định loại thông báo
    data["type_notify"] = TYPE_NOTIFICATION[:final_quiz]
    ActionCable.server.broadcast("quiz_#{quiz_id}", data)
  end
end