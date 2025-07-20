class Participation < ApplicationRecord
  belongs_to :participator, polymorphic: true, dependent: :destroy
  belongs_to :quiz_session
  has_many :answers, dependent: :destroy

  def self.update_score(participation_id, score)
    participation = find_by(id: participation_id)
    return false unless participation

    new_score = participation.score.to_i + score.to_i
    participation.update(score: new_score)
    new_score
  end
end