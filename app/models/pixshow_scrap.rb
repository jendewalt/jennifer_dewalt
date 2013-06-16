class PixshowScrap < ActiveRecord::Base
  attr_accessible :photo
  has_attached_file :photo, :styles => { :thumb => ["200x200>", :png]},
                            :convert_options => { :all => "-strip" }
end

