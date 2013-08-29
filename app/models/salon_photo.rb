class SalonPhoto < ActiveRecord::Base
  attr_accessible :image

  belongs_to :salon_gallery
  has_attached_file :image, :styles => { :thumb => ["250x250>", :png]},
                            :convert_options => { :all => "-strip" }
end
