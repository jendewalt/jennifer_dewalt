class TasteEntry < ActiveRecord::Base
  attr_accessible :comments, :image, :name, :rating, :kind, :user_id
  belongs_to :user
  validates :user_id, presence: true

  has_attached_file :image, :styles => { :small => ["x100", :png]},
                            :convert_options => { :all => "-strip" }
end
