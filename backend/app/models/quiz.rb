class Quiz < ApplicationRecord
  belongs_to :owner_user, class_name: 'User', dependent: :destroy
  enum status: { private: 0, public: 1 }
  enum topic: {
    math: 0,
    physics: 1,
    chemistry: 2,
    biology: 3,
    literature: 4,
    history: 5,
    geography: 6,
    music: 7,
    art: 7,
    technology: 8,
    health: 9,
    society: 10,
    other: 11
  }
end
