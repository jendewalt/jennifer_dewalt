class PortraitPhoto < ActiveRecord::Base
  attr_accessible :image

  attr_accessor :content_type, :original_filename, :image_data

  before_save :decode_base64_image

  has_attached_file :image, :styles => { :large => ["400x550>", :png]},
                            :convert_options => { :all => "-strip" }

  def previous
    PortraitPhoto.where(["id < ?", id]).last
  end

  def next
    PortraitPhoto.where(["id > ?", id]).first
  end

  protected
    def decode_base64_image
      if image_data && content_type && original_filename
        decoded_data = Base64.decode64(image_data)
 
        data = StringIO.new(decoded_data)
        data.class_eval do
          attr_accessor :content_type, :original_filename
        end
 
        data.content_type = content_type
        data.original_filename = File.basename(original_filename)
 
        self.image = data
      end
    end
end
