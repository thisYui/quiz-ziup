class SocketNotifier
  TYPE_NOTIFICATION = {
    joined: 0,
    left: 1,
    updated: 2
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

  def self.result_and_rating(payload)
    data = JSON.parse(payload)
    quiz_id = data["quiz_id"]

    # Thêm cờ để xác định loại thông báo
    data["type_notify"] = TYPE_NOTIFICATION[:updated]
    ActionCable.server.broadcast("quiz_#{quiz_id}", data)
  end
end