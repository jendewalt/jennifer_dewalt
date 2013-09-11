class PicturePenPicture < ActiveRecord::Base
  attr_accessible :image, :slug

  attr_accessor :content_type, :original_filename, :image_data

  before_create :create_unique_slug
  before_save :decode_base64_image

  has_attached_file :image, :styles => { :large => ["600x600>", :png], :small => ["x200", :png]},
                            :convert_options => { :all => "-strip" }

  def to_param
    slug
  end

  def create_unique_slug
    begin
      self[:slug] = SecureRandom.urlsafe_base64(8)
    end while PicturePenPicture.exists?(:slug => self[:slug])
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
      if self.image_file_size.nil? or self.image_content_type.nil?
        return false
      end
    end
end
