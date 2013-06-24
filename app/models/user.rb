class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :timeoutable, :confirmable
  devise :database_authenticatable, :lockable, :omniauthable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :username, :email, :password, :password_confirmation, :remember_me, :photo, :name, :description

  has_attached_file :photo, :styles => { :medium => "300x300>", :thumb => "100x100>" }, :default_url => "missing_icon.png"
  has_many :tiny_notes_notes, dependent: :destroy
  has_many :liquor_likes_likes
  has_many :liquor_likes_liquors, :through => :liquor_likes_likes

  def likes_liquor?(liquor_id)
    liquor_likes_likes.exists?(:liquor_likes_liquor_id => liquor_id)
  end
end
